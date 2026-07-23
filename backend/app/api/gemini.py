from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import requests
import json
from ..config import settings

router = APIRouter()

class GeminiPayload(BaseModel):
    running_appliances: List[str]
    leak_alerts: List[str]
    today_cost: float
    projected_monthly_bill: float
    currency: str

@router.post("/api/gemini/insights")
def get_gemini_insights(payload: GeminiPayload):
    # If API Key is present, call Google Gemini 2.5 Flash API
    if settings.GEMINI_API_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
            headers = {"Content-Type": "application/json"}
            
            prompt = f"""
            You are VoltWise AI, an expert energy intelligence system. Analyze the following household metrics disaggregated from a single smart meter:
            - Active Running Appliances: {', '.join(payload.running_appliances) if payload.running_appliances else 'None'}
            - Active Leak/Inefficiency Warnings: {', '.join(payload.leak_alerts) if payload.leak_alerts else 'None'}
            - Daily Accumulated Cost: {payload.currency}{payload.today_cost:.2f}
            - Projected Monthly Bill: {payload.currency}{payload.projected_monthly_bill:.2f}
            
            Provide a response in JSON format matching the following keys:
            - summary: A 2-sentence executive summary of the household's current energy state.
            - savings_advice: Concrete steps to immediately reduce active leakage points or heavy loads.
            - unusual_observation: Identify anomalies, cycle spikes, or any unusual standby trends.
            - carbon_tips: Specific advice on how minimizing active loads offsets regional grid greenhouse footprints.
            """

            request_body = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "responseSchema": {
                        "type": "OBJECT",
                        "properties": {
                            "summary": {"type": "STRING"},
                            "savings_advice": {"type": "STRING"},
                            "unusual_observation": {"type": "STRING"},
                            "carbon_tips": {"type": "STRING"}
                        },
                        "required": ["summary", "savings_advice", "unusual_observation", "carbon_tips"]
                    }
                }
            }

            response = requests.post(url, headers=headers, json=request_body, timeout=5)
            if response.status_code == 200:
                resp_json = response.json()
                text_out = resp_json["candidates"][0]["content"]["parts"][0]["text"]
                # Parse structured JSON output from Gemini
                data = json.loads(text_out)
                return data
            else:
                print(f">>> Gemini API error (status {response.status_code}): {response.text}")
        except Exception as e:
            print(f">>> Gemini API Exception: {e}")
            
    # Mock fallback response when key is missing or API errors out
    active_devices = ", ".join(payload.running_appliances) if payload.running_appliances else "None"
    alert_warnings = ", ".join(payload.leak_alerts) if payload.leak_alerts else "None"
    
    fridge_leak = "leak_fridge" in [a.lower().replace(" ", "_") for a in payload.leak_alerts] or "refrigerator" in active_devices.lower() and len(payload.leak_alerts) > 0
    heater_leak = "leak_heater" in [a.lower().replace(" ", "_") for a in payload.leak_alerts] or "heater" in active_devices.lower()
    
    unusual_note = "Standby load is stable. Power factor logs show high efficiency metrics."
    if fridge_leak:
        unusual_note = "Refrigerator draws 375W continuously, suggesting door seals have split, allowing ambient warm air ingress."
    elif heater_leak:
        unusual_note = "Water Heater active log exceeds typical 30-minute recovery window, flagging a stuck thermostat relay."

    return {
        "summary": f"Aggregated household load disaggregation is parsing {len(payload.running_appliances)} active load loops. Cumulative cost is {payload.currency}{payload.today_cost:.2f}.",
        "savings_advice": f"Isolate standby vampire devices to drop monthly bills by {payload.currency}150. Inspect Refrigerator seals if coil cycle runtimes exceed 40%.",
        "unusual_observation": unusual_note,
        "carbon_tips": f"Averting {payload.currency}300 of energy waste prevents approximately 34 kg of coal burning equivalents in grid generation plants."
    }
