import numpy as np
import pandas as pd
from typing import List, Dict, Any

# Appliance Profiles for Signature Matching
APPLIANCE_SIGNATURES = {
    "Water Heater": {"power": 2000.0, "tolerance": 150.0, "category": "Heating"},
    "Air Conditioner": {"power": 1500.0, "tolerance": 100.0, "category": "Cooling"},
    "Microwave Oven": {"power": 1200.0, "tolerance": 100.0, "category": "Cooking"},
    "Washing Machine": {"power": 500.0, "tolerance": 50.0, "category": "Laundry"},
    "Refrigerator": {"power": 150.0, "tolerance": 20.0, "category": "Refrigeration"},
    "Smart TV": {"power": 120.0, "tolerance": 15.0, "category": "Entertainment"},
    "Ceiling Fan": {"power": 60.0, "tolerance": 10.0, "category": "Ventilation"},
    "Laptop Charger": {"power": 55.0, "tolerance": 10.0, "category": "Work/Study"},
    "LED Bulb": {"power": 15.0, "tolerance": 3.0, "category": "Lighting"}
}

def analyze_power_transient(delta_p: float) -> Dict[str, Any]:
    """
    Identifies if a power delta matches an appliance activation or deactivation signature.
    """
    abs_delta = abs(delta_p)
    matched_device = None
    event_type = "activation" if delta_p > 0 else "deactivation"
    confidence = 0.0

    for name, spec in APPLIANCE_SIGNATURES.items():
        if abs(abs_delta - spec["power"]) <= spec["tolerance"]:
            matched_device = name
            # Closer to theoretical rated power = higher confidence
            dev_dist = abs(abs_delta - spec["power"])
            confidence = max(80.0, min(99.0, 100.0 - (dev_dist / spec["tolerance"]) * 20.0))
            break
            
    if matched_device:
        return {
            "matched": True,
            "device": matched_device,
            "event_type": event_type,
            "confidence": round(confidence, 1),
            "delta_w": round(delta_p, 1)
        }
    return {"matched": False}

def run_nilm_inference(current_power: float, prev_power: float) -> Dict[str, Any]:
    """
    Performs transient edge extraction. Returns event log info if an edge is detected.
    """
    delta_p = current_power - prev_power
    if abs(delta_p) >= 30.0:
        result = analyze_power_transient(delta_p)
        if result["matched"]:
            return result
    return {"matched": False}

def scan_for_leaks(df_telemetry: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Performs rolling threshold checks on historical telemetry logs to isolate energy leaks.
    """
    alerts = []
    if df_telemetry.empty or len(df_telemetry) < 5:
        return alerts

    # Anomaly 1: Vampire Stanby Leak Check
    # If aggregate power stays consistently low but non-zero during off hours (e.g. 2 AM - 4 AM)
    # we inspect if any device is leaking.
    low_loads = df_telemetry[df_telemetry["aggregate_power"] < 50.0]
    if not low_loads.empty:
        mean_vampire_draw = low_loads["aggregate_power"].mean()
        if mean_vampire_draw > 25.0: # normally house baseline noise is 15-20W
            alerts.append({
                "id": "py_leak_standby",
                "title": "Low-Load Vampire Leakage Detect",
                "severity": "warning",
                "appliance": "Smart TV / Chargers",
                "wastedEnergy": float(round((mean_vampire_draw - 15.0) * 24 / 1000, 3)),
                "wastedMoney": float(round((mean_vampire_draw - 15.0) * 24 / 1000 * 7.50, 2)),
                "explanation": f"Average standby baseline load is high ({mean_vampire_draw:.1f}W). Smart-meter profiles trace an inactive transformer draw.",
                "action": "Unplug laptop bricks and switch off gaming hubs at power strips overnight."
            })

    # Anomaly 2: Heavy Load Running Prolonged Check
    # Find active periods of heavy loads (e.g. > 1800W representing Water Heater)
    heavy_loads = df_telemetry[df_telemetry["aggregate_power"] > 1800.0]
    if len(heavy_loads) > 12: # more than an hour (assuming 5-min intervals, 12 samples = 60 mins)
        alerts.append({
            "id": "py_leak_heater",
            "title": "Water Heater Overrun Flag",
            "severity": "critical",
            "appliance": "Water Heater",
            "wastedEnergy": float(round(2.0 * len(heavy_loads) * 5 / 60, 3)),
            "wastedMoney": float(round(2.0 * len(heavy_loads) * 5 / 60 * 7.50, 2)),
            "explanation": "High thermal load (2000W) has operated continuously for over 60 minutes. Thermostat sensor is stuck or scaling exists.",
            "action": "Disable manual breaker control immediately. Verify thermostat sensor functions."
        })

    return alerts

def generate_explain_details(appliance_name: str) -> Dict[str, Any]:
    """
    Generates XAI explanation features for a given appliance profile.
    """
    spec = APPLIANCE_SIGNATURES.get(appliance_name, {"power": 50.0, "category": "General"})
    
    return {
        "appliance": appliance_name,
        "feature_weights": {
            "transient_amplitude": 0.45 if spec["power"] > 200 else 0.15,
            "steady_state_level": 0.35,
            "harmonics_profile": 0.10,
            "power_factor_angle": 0.10
        },
        "signature_class": spec["category"],
        "average_draw_w": spec["power"],
        "reasoning": f"NILM isolation isolated a step change matching the rated power ({spec['power']}W) with high transient stability. Signature contains inductive properties characteristic of {spec['category']} loads."
    }
