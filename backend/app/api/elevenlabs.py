from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import requests
import io
from ..config import settings

router = APIRouter()

class SpeakPayload(BaseModel):
    text: str

@router.post("/api/elevenlabs/speak")
def synthesize_speech(payload: SpeakPayload):
    """
    Synthesizes speech using the ElevenLabs API.
    If no key is configured, triggers a 404 error so the client falls back to Web Speech.
    """
    if not settings.ELEVENLABS_API_KEY:
        raise HTTPException(
            status_code=404, 
            detail="ElevenLabs API key is not configured. Falling back to browser text-to-speech."
        )

    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{settings.ELEVENLABS_VOICE_ID}"
        headers = {
            "xi-api-key": settings.ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "accept": "audio/mpeg"
        }
        data = {
            "text": payload.text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=8)
        
        if response.status_code == 200:
            return StreamingResponse(
                io.BytesIO(response.content), 
                media_type="audio/mpeg"
            )
        else:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"ElevenLabs error: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Voice synthesis failed: {str(e)}"
        )
