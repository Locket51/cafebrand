from fastapi import APIRouter
import pandas as pd
from ..database import get_recent_telemetry
from ..nilm_engine import scan_for_leaks

router = APIRouter()

@router.get("/api/leak-detection")
def run_telemetry_leak_scan():
    """
    Retreives historical log records and runs the rolling anomaly scan rules.
    """
    records = get_recent_telemetry(288)
    if not records:
        return []
        
    df = pd.DataFrame(records)
    alerts = scan_for_leaks(df)
    return alerts
