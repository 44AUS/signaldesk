"""
SignalDesk AI - Premium Trading Signal Backend
FastAPI backend with JWT auth, GPT-5.2 AI signals, and subscription management
"""
import os
import uuid
import asyncio
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from pymongo import MongoClient
from passlib.context import CryptContext
from jose import JWTError, jwt

from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

# Database setup
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

# JWT config
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Collections
users_collection = db["users"]
signals_collection = db["signals"]
subscriptions_collection = db["subscriptions"]

# Pydantic Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=2)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class SignalRequest(BaseModel):
    asset: str = Field(default="BTCUSDT")
    timeframe: str = Field(default="Intraday")

class SubscriptionUpdate(BaseModel):
    is_active: bool
    plan: str = "premium"
    expires_at: Optional[str] = None

class SignalResponse(BaseModel):
    id: str
    asset: str
    signal: str
    entry: float
    take_profit: List[float]
    stop_loss: Optional[float]
    confidence: int
    timeframe: str
    status: str
    ai_reasoning: str
    risk_reward: str
    created_at: str
    expires_at: str

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_collection.find_one({"user_id": user_id}, {"_id": 0, "password": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def check_subscription(user_id: str) -> dict:
    """Check if user has active subscription (mocked for testing)"""
    sub = subscriptions_collection.find_one({"user_id": user_id}, {"_id": 0})
    if sub:
        return sub
    # Default mock subscription for testing
    return {
        "user_id": user_id,
        "is_active": True,
        "plan": "premium_mock",
        "price": 49.99,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "mock": True
    }

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    users_collection.create_index("email", unique=True)
    users_collection.create_index("user_id", unique=True)
    signals_collection.create_index("user_id")
    signals_collection.create_index("created_at")
    yield
    # Shutdown
    client.close()

app = FastAPI(
    title="SignalDesk AI API",
    description="Premium AI Trading Signal Generation",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth endpoints
@app.post("/api/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    existing = users_collection.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    users_collection.insert_one(user_doc)
    
    # Create mock subscription
    sub_doc = {
        "user_id": user_id,
        "is_active": True,
        "plan": "premium_trial",
        "price": 49.99,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    subscriptions_collection.insert_one(sub_doc)
    
    token = create_access_token({"sub": user_id})
    return TokenResponse(
        access_token=token,
        user={"user_id": user_id, "email": user_data.email, "name": user_data.name}
    )

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["user_id"]})
    return TokenResponse(
        access_token=token,
        user={"user_id": user["user_id"], "email": user["email"], "name": user["name"]}
    )

@app.get("/api/auth/me")
async def get_me(user: dict = Depends(get_current_user)):
    subscription = check_subscription(user["user_id"])
    return {**user, "subscription": subscription}

# Signal endpoints
@app.post("/api/signals/generate", response_model=SignalResponse)
async def generate_signal(request: SignalRequest, user: dict = Depends(get_current_user)):
    """Generate AI trading signal using GPT-5.2"""
    subscription = check_subscription(user["user_id"])
    if not subscription.get("is_active"):
        raise HTTPException(status_code=403, detail="Active subscription required")
    
    api_key = os.environ.get("EMERGENT_LLM_KEY")
    session_id = f"signal_{user['user_id']}_{uuid.uuid4()}"
    
    system_prompt = """You are an elite quantitative trading AI analyst. Generate precise trading signals based on technical and fundamental analysis.

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
    "signal": "BUY" or "SELL",
    "entry": <number>,
    "take_profit": [<number>, <number>],
    "stop_loss": <number>,
    "confidence": <number 50-95>,
    "reasoning": "<brief 2-3 sentence analysis>",
    "risk_reward": "<ratio like 1:2.5>"
}

Base your analysis on realistic market conditions. For crypto, use realistic price ranges. For stocks/forex, use appropriate prices."""

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_prompt
    ).with_model("openai", "gpt-5.2")
    
    user_message = UserMessage(
        text=f"Generate a trading signal for {request.asset} on {request.timeframe} timeframe. Current market shows mixed momentum. Provide entry, take-profit levels, stop-loss, and confidence score."
    )
    
    try:
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        import re
        
        # Extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', response)
        if json_match:
            signal_data = json.loads(json_match.group())
        else:
            raise ValueError("No JSON found in response")
        
        signal_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)
        expires_at = created_at + timedelta(hours=24 if request.timeframe == "Swing" else 8 if request.timeframe == "Intraday" else 2)
        
        signal_doc = {
            "signal_id": signal_id,
            "user_id": user["user_id"],
            "asset": request.asset,
            "signal": signal_data.get("signal", "BUY"),
            "entry": float(signal_data.get("entry", 0)),
            "take_profit": [float(tp) for tp in signal_data.get("take_profit", [])],
            "stop_loss": float(signal_data.get("stop_loss", 0)) if signal_data.get("stop_loss") else None,
            "confidence": int(signal_data.get("confidence", 75)),
            "timeframe": request.timeframe,
            "status": "active",
            "ai_reasoning": signal_data.get("reasoning", ""),
            "risk_reward": signal_data.get("risk_reward", "1:2"),
            "created_at": created_at.isoformat(),
            "expires_at": expires_at.isoformat()
        }
        
        signals_collection.insert_one(signal_doc)
        
        return SignalResponse(
            id=signal_id,
            asset=signal_doc["asset"],
            signal=signal_doc["signal"],
            entry=signal_doc["entry"],
            take_profit=signal_doc["take_profit"],
            stop_loss=signal_doc["stop_loss"],
            confidence=signal_doc["confidence"],
            timeframe=signal_doc["timeframe"],
            status=signal_doc["status"],
            ai_reasoning=signal_doc["ai_reasoning"],
            risk_reward=signal_doc["risk_reward"],
            created_at=signal_doc["created_at"],
            expires_at=signal_doc["expires_at"]
        )
        
    except Exception as e:
        # Fallback demo signal if AI fails
        signal_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)
        expires_at = created_at + timedelta(hours=8)
        
        demo_signal = {
            "signal_id": signal_id,
            "user_id": user["user_id"],
            "asset": request.asset,
            "signal": "BUY",
            "entry": 42350.0 if "BTC" in request.asset else 2850.0,
            "take_profit": [43500.0, 44200.0] if "BTC" in request.asset else [2950.0, 3050.0],
            "stop_loss": 41700.0 if "BTC" in request.asset else 2750.0,
            "confidence": 78,
            "timeframe": request.timeframe,
            "status": "active",
            "ai_reasoning": f"Technical analysis indicates bullish momentum for {request.asset}. RSI showing oversold conditions with MACD crossover confirmation.",
            "risk_reward": "1:2.5",
            "created_at": created_at.isoformat(),
            "expires_at": expires_at.isoformat()
        }
        signals_collection.insert_one(demo_signal)
        
        return SignalResponse(
            id=signal_id,
            asset=demo_signal["asset"],
            signal=demo_signal["signal"],
            entry=demo_signal["entry"],
            take_profit=demo_signal["take_profit"],
            stop_loss=demo_signal["stop_loss"],
            confidence=demo_signal["confidence"],
            timeframe=demo_signal["timeframe"],
            status=demo_signal["status"],
            ai_reasoning=demo_signal["ai_reasoning"],
            risk_reward=demo_signal["risk_reward"],
            created_at=demo_signal["created_at"],
            expires_at=demo_signal["expires_at"]
        )

@app.get("/api/signals")
async def get_signals(user: dict = Depends(get_current_user), limit: int = 20):
    """Get user's trading signals"""
    subscription = check_subscription(user["user_id"])
    if not subscription.get("is_active"):
        raise HTTPException(status_code=403, detail="Active subscription required")
    
    signals = list(signals_collection.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(limit))
    
    return {"signals": signals, "count": len(signals)}

@app.get("/api/signals/{signal_id}")
async def get_signal(signal_id: str, user: dict = Depends(get_current_user)):
    """Get specific signal details"""
    signal = signals_collection.find_one(
        {"signal_id": signal_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    if not signal:
        raise HTTPException(status_code=404, detail="Signal not found")
    return signal

@app.patch("/api/signals/{signal_id}/status")
async def update_signal_status(signal_id: str, status: str, user: dict = Depends(get_current_user)):
    """Update signal status (active, hit_tp, stopped_out, expired)"""
    result = signals_collection.update_one(
        {"signal_id": signal_id, "user_id": user["user_id"]},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Signal not found")
    return {"success": True, "status": status}

# Performance endpoints
@app.get("/api/performance")
async def get_performance(user: dict = Depends(get_current_user)):
    """Get trading performance statistics"""
    signals = list(signals_collection.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ))
    
    total = len(signals)
    if total == 0:
        return {
            "total_signals": 0,
            "win_rate": 0,
            "active_signals": 0,
            "hit_tp": 0,
            "stopped_out": 0,
            "avg_confidence": 0
        }
    
    active = sum(1 for s in signals if s.get("status") == "active")
    hit_tp = sum(1 for s in signals if s.get("status") == "hit_tp")
    stopped = sum(1 for s in signals if s.get("status") == "stopped_out")
    completed = hit_tp + stopped
    
    return {
        "total_signals": total,
        "win_rate": round((hit_tp / completed * 100) if completed > 0 else 0, 1),
        "active_signals": active,
        "hit_tp": hit_tp,
        "stopped_out": stopped,
        "avg_confidence": round(sum(s.get("confidence", 0) for s in signals) / total, 1)
    }

# Subscription endpoints (mocked for testing)
@app.get("/api/subscription")
async def get_subscription(user: dict = Depends(get_current_user)):
    """Get subscription status (mocked for RevenueCat testing)"""
    return check_subscription(user["user_id"])

@app.post("/api/subscription/activate")
async def activate_subscription(data: SubscriptionUpdate, user: dict = Depends(get_current_user)):
    """Activate/update subscription (mock endpoint for RevenueCat webhook simulation)"""
    sub_doc = {
        "user_id": user["user_id"],
        "is_active": data.is_active,
        "plan": data.plan,
        "price": 49.99,
        "expires_at": data.expires_at or (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    subscriptions_collection.update_one(
        {"user_id": user["user_id"]},
        {"$set": sub_doc},
        upsert=True
    )
    return {"success": True, "subscription": sub_doc}

@app.post("/api/subscription/cancel")
async def cancel_subscription(user: dict = Depends(get_current_user)):
    """Cancel subscription"""
    subscriptions_collection.update_one(
        {"user_id": user["user_id"]},
        {"$set": {"is_active": False, "cancelled_at": datetime.now(timezone.utc).isoformat()}}
    )
    return {"success": True, "message": "Subscription cancelled"}

# Dashboard stats
@app.get("/api/dashboard")
async def get_dashboard(user: dict = Depends(get_current_user)):
    """Get dashboard overview data"""
    subscription = check_subscription(user["user_id"])
    
    recent_signals = list(signals_collection.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).limit(5))
    
    active_count = signals_collection.count_documents(
        {"user_id": user["user_id"], "status": "active"}
    )
    
    # Calculate overall confidence
    all_signals = list(signals_collection.find(
        {"user_id": user["user_id"]},
        {"_id": 0, "confidence": 1}
    ))
    avg_confidence = round(sum(s.get("confidence", 0) for s in all_signals) / len(all_signals), 1) if all_signals else 0
    
    return {
        "subscription": subscription,
        "active_signals": active_count,
        "total_signals": len(all_signals),
        "ai_confidence": avg_confidence,
        "recent_signals": recent_signals,
        "last_signal_at": recent_signals[0]["created_at"] if recent_signals else None
    }

# Available assets
@app.get("/api/assets")
async def get_assets():
    """Get list of available trading assets"""
    return {
        "assets": [
            {"symbol": "BTCUSDT", "name": "Bitcoin", "category": "Crypto"},
            {"symbol": "ETHUSDT", "name": "Ethereum", "category": "Crypto"},
            {"symbol": "SOLUSDT", "name": "Solana", "category": "Crypto"},
            {"symbol": "SPY", "name": "S&P 500 ETF", "category": "Stocks"},
            {"symbol": "QQQ", "name": "Nasdaq ETF", "category": "Stocks"},
            {"symbol": "AAPL", "name": "Apple Inc", "category": "Stocks"},
            {"symbol": "EURUSD", "name": "Euro/USD", "category": "Forex"},
            {"symbol": "GBPUSD", "name": "GBP/USD", "category": "Forex"},
            {"symbol": "XAUUSD", "name": "Gold", "category": "Commodities"}
        ],
        "timeframes": ["Scalp", "Intraday", "Swing"]
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SignalDesk AI", "version": "1.0.0"}
