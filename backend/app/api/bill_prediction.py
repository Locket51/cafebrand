from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/api/bill-prediction")
def predict_bill(
    current_cost: float = Query(..., description="Today's accumulated cost")
):
    """
    Computes forecasted utility values.
    """
    projected = max(1200.0, current_cost * 30.0)
    potential_savings = projected * 0.15 # estimated 15% savings potential
    
    return {
        "today_cost": round(current_cost, 2),
        "projected_monthly_bill": round(projected, 2),
        "potential_savings_monthly": round(potential_savings, 2)
    }
