from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List, Any
import datetime
import math
from ..database import (
    get_appliance_states, update_appliance_state, 
    save_telemetry_reading, get_global_variables, update_global_variables
)

router = APIRouter()

class SimulationStatePayload(BaseModel):
    toggles: Dict[str, bool]
    anomalies: Dict[str, bool]
    speed: int
    tariff: float
    tick: int

@router.post("/api/simulation/state")
def get_simulation_state(payload: SimulationStatePayload):
    # 1. Retrieve current base state from DB / cache
    appliances = get_appliance_states()
    globals_data = get_global_variables()

    speed = payload.speed
    tariff = payload.tariff
    tick = payload.tick

    updated_apps = []
    active_power_sum = 0.0

    # 2. Iterate and evaluate current power for each appliance
    for app in appliances:
        app_id = app["id"]
        is_logical_on = payload.toggles.get(app_id, False)
        current_power = 0.0
        health_modifier = 1.0
        is_leaking = False

        if app_id == "fridge":
            cycle_time = tick % 35
            is_compressor_on = cycle_time < 15
            if payload.anomalies.get("fridgeInefficient", False):
                current_power = 375.0 if is_compressor_on else 15.0
                health_modifier = 0.55
                is_leaking = True
            else:
                current_power = 150.0 if is_compressor_on else 12.0
        
        elif app_id == "ac":
            if is_logical_on:
                ac_cycle_time = tick % 60
                current_power = 1500.0 if ac_cycle_time < 40 else 80.0
            else:
                current_power = 0.0
                
        elif app_id == "washing":
            if is_logical_on:
                wash_cycle_time = tick % 30
                if wash_cycle_time < 10:
                    current_power = 500.0
                elif wash_cycle_time < 25:
                    current_power = 120.0
                else:
                    current_power = 8.0
            else:
                current_power = 0.0
                
        elif app_id == "tv":
            if is_logical_on:
                current_power = 120.0
            else:
                if payload.anomalies.get("tvStandbyLeak", False):
                    current_power = 18.0
                    is_leaking = True
                else:
                    current_power = 0.0
                    
        elif app_id == "laptop":
            if is_logical_on:
                pulse = math.sin(tick / 5.0) * 10.0
                current_power = float(round(55.0 + pulse))
            else:
                if payload.anomalies.get("chargerIdleLeak", False):
                    current_power = 8.0
                    is_leaking = True
                else:
                    current_power = 0.0
                    
        elif app_id == "heater":
            if is_logical_on or payload.anomalies.get("heaterThermostatStick", False):
                current_power = 2000.0
                if payload.anomalies.get("heaterThermostatStick", False):
                    is_leaking = True
                    health_modifier = 0.65
            else:
                current_power = 0.0
        else:
            if is_logical_on:
                current_power = float(app["rated_power"])
            else:
                current_power = 0.0

        # Noise modification
        if current_power > 10.0:
            current_power = float(round(current_power + (hash(app_id) % 3) - 1))

        # Runtime & energy increments
        status = "OFF"
        if current_power > 15.0:
            status = "ON"
        elif current_power > 0.0:
            status = "STANDBY"

        new_runtime = app.get("runtime", 0.0)
        new_energy = app.get("energy_used", 0.0)
        new_cost = app.get("cost", 0.0)

        if status != "OFF":
            new_runtime += speed
            delta_energy = (current_power * speed) / (1000.0 * 3600.0)
            new_energy += delta_energy
            new_cost = new_energy * tariff

        active_power_sum += current_power

        updated_app = {
            "id": app_id,
            "name": app["name"],
            "status": status,
            "current_power": current_power,
            "runtime": new_runtime,
            "energy_used": new_energy,
            "cost": new_cost,
            "health_score": float(max(20, min(100, round(app["health_score"] * health_modifier)))),
            "leak_status": is_leaking
        }
        updated_apps.append(updated_app)
        update_appliance_state(app_id, updated_app)

    # 3. Aggregate Calcs
    house_noise = 25.0 + (tick % 5)
    aggregate_power = active_power_sum + house_noise

    energy_delta = (aggregate_power * speed) / (1000.0 * 3600.0)
    cumulative_energy = globals_data.get("cumulative_energy", 0.85) + energy_delta
    cumulative_cost = cumulative_energy * tariff

    # Saved energy stats increments if leaks are avoided
    energy_saved = globals_data.get("energy_saved", 18.4)
    if not payload.anomalies.get("fridgeInefficient", False) and not payload.anomalies.get("tvStandbyLeak", False):
        energy_saved += (speed * 0.05) / 3600.0 # seed increment

    carbon_reduction = energy_saved * 0.85
    potential_savings = 1450.0

    globals_update = {
        "cumulative_energy": cumulative_energy,
        "cumulative_cost": cumulative_cost,
        "energy_saved": energy_saved,
        "potential_savings": potential_savings,
        "carbon_reduction": carbon_reduction
    }
    update_global_variables(globals_update)

    # Save to history records database
    telemetry_record = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "aggregate_power": aggregate_power,
        "voltage": 230.0,
        "current": round(aggregate_power / 230.0, 2)
    }
    save_telemetry_reading(telemetry_record)

    # 4. Leak Detection warnings compiling
    alerts = []
    if payload.anomalies.get("fridgeInefficient", False):
        alerts.append({
            "id": "leak_fridge",
            "title": "Refrigerator Consuming 2.5× Expected Power",
            "severity": "critical",
            "appliance": "Refrigerator",
            "wastedEnergy": float(round(0.22 * (speed / 3600.0) * tick, 3)),
            "wastedMoney": float(round(0.22 * (speed / 3600.0) * tick * tariff, 2)),
            "explanation": "NILM analysis shows refrigerator compressor draws 375W (normally 150W) and stays in a constant state due to gasket degradation.",
            "action": "Vacuum dust off the rear condenser coils and verify door magnet seals align."
        })

    if payload.anomalies.get("tvStandbyLeak", False):
        w_energy = float(round(0.018 * ((speed * tick) / 3600.0), 3))
        alerts.append({
            "id": "leak_tv",
            "title": "Standby TV Vampire Load",
            "severity": "warning",
            "appliance": "Smart TV",
            "wastedEnergy": w_energy,
            "wastedMoney": float(round(w_energy * tariff, 2)),
            "explanation": "The entertainment center draws 18W continuous vampire load while logically shut off, indicating background timers are active.",
            "action": "Isolate standby elements using a smart power strip when the room is empty."
        })

    if payload.anomalies.get("heaterThermostatStick", False):
        alerts.append({
            "id": "leak_heater",
            "title": "Water Heater Running Unusually Long",
            "severity": "critical",
            "appliance": "Water Heater",
            "wastedEnergy": float(round(2.0 * ((speed * tick) / 3600.0), 3)),
            "wastedMoney": float(round(2.0 * ((speed * tick) / 3600.0) * tariff, 2)),
            "explanation": "NILM thermal tracking indicates element is locked in constant 2000W load without standard thermostat cycling.",
            "action": "Disable circuit breakers immediately. Calibrate thermostat temperature limits."
        })

    return {
        "aggregate_power": aggregate_power,
        "cumulative_energy": cumulative_energy,
        "cumulative_cost": cumulative_cost,
        "energy_saved": energy_saved,
        "potential_savings": potential_savings,
        "carbon_reduction": carbon_reduction,
        "appliances": updated_apps,
        "alerts": alerts
    }
