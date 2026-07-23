from fastapi import APIRouter, UploadFile, File, HTTPException
import json
import pandas as pd
import io
import datetime
import random
from ..database import save_telemetry_reading

router = APIRouter()

@router.post("/api/upload")
async def upload_telemetry_file(file: UploadFile = File(...)):
    """
    Parses and stores CSV/JSON meter log files.
    """
    contents = await file.read()
    filename = file.filename.lower()
    
    try:
        if filename.endswith(".json"):
            data = json.loads(contents.decode("utf-8"))
            if not isinstance(data, list):
                raise HTTPException(status_code=400, detail="JSON must be an array of records.")
            df = pd.DataFrame(data)
        elif filename.endswith(".csv"):
            df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        else:
            raise HTTPException(status_code=400, detail="Invalid file type. Upload CSV or JSON.")
            
        # Headers validation
        required_cols = ["timestamp", "power"]
        missing_cols = [c for c in required_cols if c not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {', '.join(missing_cols)}"
            )

        # Parse and save
        records = []
        for _, row in df.iterrows():
            record = {
                "timestamp": str(row["timestamp"]),
                "power": float(row["power"]),
                "voltage": float(row.get("voltage", 230.0)),
                "current": float(row.get("current", round(float(row["power"])/230.0, 2)))
            }
            save_telemetry_reading(record)
            records.append(record)

        return {
            "success": True,
            "filename": file.filename,
            "records_parsed": len(records),
            "preview": records[:10]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

@router.get("/api/upload/demo")
def load_demo_timeline():
    """
    Generates a 24-hour smart-meter load timeline for demo purposes.
    """
    demo_records = []
    base_time = datetime.datetime.utcnow() - datetime.timedelta(days=1)
    
    # 288 points (every 5 mins)
    for i in range(288):
        current_time = base_time + datetime.timedelta(minutes=i*5)
        hour = current_time.hour
        
        # Base house load
        power = 30.0 + random.uniform(-5, 5)
        
        # Fridge cycle
        if (i % 8) < 3:
            power += 150.0
            
        # TV (Evening)
        if 18 <= hour <= 23:
            power += 120.0
            
        # Water Heater (Morning)
        if 7 <= hour <= 8:
            if (i % 6) < 2:
                power += 2000.0
                
        # AC (Afternoon)
        if 12 <= hour <= 18:
            if (i % 12) < 8:
                power += 1500.0

        record = {
            "timestamp": current_time.isoformat(),
            "power": round(power, 1),
            "voltage": 230.0,
            "current": round(power/230.0, 2)
        }
        save_telemetry_reading(record)
        demo_records.append(record)

    return {
        "success": True,
        "records_parsed": len(demo_records),
        "preview": demo_records[:10]
    }
