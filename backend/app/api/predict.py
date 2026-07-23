from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from ..nilm_engine import run_nilm_inference

router = APIRouter()

@router.get("/api/predict")
def predict_nilm_state(
    power: float = Query(..., description="Current aggregate power (Watts)"),
    prev_power: float = Query(0.0, description="Previous aggregate power (Watts)")
):
    """
    Evaluates power transient deltas to isolate device events.
    """
    result = run_nilm_inference(power, prev_power)
    return result
