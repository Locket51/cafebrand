from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.simulation import router as simulation_router
from .api.predict import router as predict_router
from .api.leak_detection import router as leak_router
from .api.bill_prediction import router as bill_router
from .api.gemini import router as gemini_router
from .api.elevenlabs import router as elevenlabs_router
from .api.upload import router as upload_router

app = FastAPI(
    title="VoltWise AI - NILM Core Engine", 
    version="1.1.0",
    description="FastAPI backend for disaggregating house telemetry data."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Router Modules
app.include_router(simulation_router)
app.include_router(predict_router)
app.include_router(leak_router)
app.include_router(bill_router)
app.include_router(gemini_router)
app.include_router(elevenlabs_router)
app.include_router(upload_router)

@app.get("/api/health")
def get_health_status():
    return {
        "status": "ok",
        "service": "VoltWise NILM Core",
        "database": "Online"
    }
