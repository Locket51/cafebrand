from pymongo import MongoClient
import time
from .config import settings

# In-Memory Cache Fallback Database
in_memory_db = {
    "telemetry": [],
    "appliances": [
        {"id": "ac", "name": "Air Conditioner", "rated_power": 1500.0, "status": "OFF", "health_score": 91.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "fridge", "name": "Refrigerator", "rated_power": 150.0, "status": "ON", "health_score": 88.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "tv", "name": "Smart TV", "rated_power": 120.0, "status": "OFF", "health_score": 96.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "fan", "name": "Ceiling Fan", "rated_power": 60.0, "status": "OFF", "health_score": 94.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "washing", "name": "Washing Machine", "rated_power": 500.0, "status": "OFF", "health_score": 89.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "microwave", "name": "Microwave Oven", "rated_power": 1200.0, "status": "OFF", "health_score": 95.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "heater", "name": "Water Heater", "rated_power": 2000.0, "status": "OFF", "health_score": 85.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "laptop", "name": "Laptop Charger", "rated_power": 65.0, "status": "OFF", "health_score": 98.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False},
        {"id": "bulb", "name": "LED Bulb", "rated_power": 15.0, "status": "ON", "health_score": 99.0, "runtime": 0.0, "energy_used": 0.0, "cost": 0.0, "leak_status": False}
    ],
    "variables": {
        "cumulative_energy": 0.85,
        "cumulative_cost": 6.38,
        "energy_saved": 18.4,
        "potential_savings": 1450.0,
        "carbon_reduction": 42.6
    }
}

mongo_client = None
db = None
use_mongo = False

if settings.MONGO_URI:
    try:
        # 3 second timeout for quick fallback
        mongo_client = MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=3000)
        # Check connection
        mongo_client.server_info()
        db = mongo_client["voltwise_nilm"]
        use_mongo = True
        print(">>> SUCCESS: Connected to MongoDB Atlas!")
        
        # Initialize default appliances in MongoDB if not present
        if db["appliances"].count_documents({}) == 0:
            db["appliances"].insert_many(in_memory_db["appliances"])
        
        # Initialize variables if not present
        if db["variables"].count_documents({}) == 0:
            db["variables"].insert_one(in_memory_db["variables"])
            
    except Exception as e:
        print(f">>> WARNING: MongoDB Connection Failed ({e}). Falling back to In-Memory store.")
        use_mongo = False
else:
    print(">>> INFO: No MONGO_URI provided. Running in In-Memory Cache Mode.")
    use_mongo = False


# Data Access helpers
def save_telemetry_reading(reading: dict):
    if use_mongo:
        db["telemetry"].insert_one(reading)
    else:
        in_memory_db["telemetry"].append(reading)
        if len(in_memory_db["telemetry"]) > 300:
            in_memory_db["telemetry"].pop(0)

def get_recent_telemetry(limit: int = 100):
    if use_mongo:
        cursor = db["telemetry"].find({}, {"_id": 0}).sort("timestamp", -1).limit(limit)
        return list(cursor)
    else:
        return sorted(in_memory_db["telemetry"], key=lambda x: x.get("timestamp", ""), reverse=True)[:limit]

def get_appliance_states():
    if use_mongo:
        return list(db["appliances"].find({}, {"_id": 0}))
    else:
        return in_memory_db["appliances"]

def update_appliance_state(app_id: str, updates: dict):
    if use_mongo:
        db["appliances"].update_one({"id": app_id}, {"$set": updates})
    else:
        for app in in_memory_db["appliances"]:
            if app["id"] == app_id:
                app.update(updates)
                break

def get_global_variables():
    if use_mongo:
        res = db["variables"].find_one({}, {"_id": 0})
        return res if res else in_memory_db["variables"]
    else:
        return in_memory_db["variables"]

def update_global_variables(updates: dict):
    if use_mongo:
        db["variables"].update_one({}, {"$set": updates})
    else:
        in_memory_db["variables"].update(updates)
