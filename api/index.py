from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import logging
import httpx
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngredientsRequest(BaseModel):
    ingredients: str

@app.get("/api/health")
def health_check():
    return {"status": "ok", "model": "gemini-via-rest"}

@app.get("/")
def read_root():
    return {"status": "ok", "service": "Roast My Fridge API"}

@app.post("/api/generate")
async def generate_roast_and_recipe(body: IngredientsRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not found")

    # Construct the prompt
    prompt = f"""
    You are a sarcastic, Gordon Ramsay-style chef. 
    User ingredients: {body.ingredients}
    
    1. ROAST them brutally for these ingredients. Be funny and mean.
    2. Then give a REAL, TASTY recipe using them (and basic pantry items).
    
    Return ONLY raw JSON with this exact structure:
    {{
        "roast": "The roast text here",
        "recipe_name": "Name of the dish",
        "ingredients_list": ["item 1", "item 2"],
        "instructions": ["step 1", "step 2"]
    }}
    """
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "response_mime_type": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload, timeout=30.0)
            
        if response.status_code != 200:
            logger.error(f"Gemini API Error: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Gemini API Error: {response.text}")
            
        data = response.json()
        
        # Extract the JSON text from the response
        try:
            text_content = data['candidates'][0]['content']['parts'][0]['text']
            parsed_result = json.loads(text_content)
            return parsed_result
        except (KeyError, json.JSONDecodeError, IndexError) as parse_error:
            logger.error(f"Parsing Error: {parse_error}. Response: {data}")
            raise HTTPException(status_code=500, detail="Failed to parse AI response")
            
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
