import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load env vars from .env for local dev
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_ai import Agent
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Schema
class RequestBody(BaseModel):
    ingredients: str

# Response Schema
class RecipeResponse(BaseModel):
    roast: str
    recipe_name: str
    ingredients_list: list[str]
    instructions: list[str]

# Global variables for lazy initialization
_model = None
_agent = None
_initialization_error = None

def get_agent():
    """Lazy initialization of model and agent"""
    global _model, _agent, _initialization_error
    
    if _agent is not None:
        return _agent
    
    if _initialization_error is not None:
        raise _initialization_error
    
    try:
        # Load API key from environment
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            logger.error("GEMINI_API_KEY not found in environment!")
            _initialization_error = RuntimeError("GEMINI_API_KEY not set in environment")
            raise _initialization_error
        
        logger.info(f"✓ API Key loaded: {api_key[:10]}...")
        
        # Import and initialize model
        from pydantic_ai.models.gemini import GeminiModel
        _model = GeminiModel('gemini-2.5-flash')
        logger.info("✓ Model initialized successfully")
        
        # Initialize agent
        _agent = Agent(
            _model,
            output_type=RecipeResponse,
            system_prompt=(
                "You are a harsh, sarcastic, funny, roast-master food critic. "
                "The user will give you a list of ingredients. "
                "1. ROAST THEM: Mock their choices, call them lazy, question their sanity. Be creative and mean but funny. "
                "2. RECIPE: Despite the roast, provide a genuinely delicious recipe using those ingredients (and maybe a few basic staples like oil, salt, etc). "
                "Format the output strictly as the requested JSON structure."
            )
        )
        logger.info("✓ Agent initialized successfully")
        return _agent
        
    except Exception as e:
        logger.error(f"Error initializing model/agent: {e}", exc_info=True)
        _initialization_error = e
        raise

@app.get("/")
async def root():
    return {"status": "ok", "message": "Roast My Fridge API"}

@app.get("/api/health")
async def health():
    try:
        agent = get_agent()
        return {"status": "ok", "model_loaded": True}
    except Exception as e:
        return {"status": "error", "model_loaded": False, "error": str(e)}

@app.post("/api/generate")
async def generate_roast(body: RequestBody):
    logger.info(f"Received request with ingredients: {body.ingredients}")
    
    try:
        # Get agent (lazy initialization)
        agent = get_agent()
    except Exception as e:
        logger.error(f"Failed to initialize agent: {e}")
        raise HTTPException(status_code=500, detail=f"Model initialization failed: {str(e)}")
    
    try:
        logger.info("Running agent...")
        # Run the agent
        result = await agent.run(f"My ingredients are: {body.ingredients}")
        logger.info("Agent run successful")
        logger.info(f"Result: {result}")
        # Access output instead of data
        return result.output
    except Exception as e:
        logger.error(f"Agent Run Error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
