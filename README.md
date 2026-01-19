# SignalDesk AI

Premium React Native mobile app for AI-powered trading signals. Built with institutional-grade UI/UX design.

## Features

- 🤖 **AI-Powered Signals** - GPT-5.2 generates real-time trading signals
- 📈 **Multi-Asset Support** - Crypto, stocks, forex, and commodities
- 💰 **$49.99/month Subscription** - RevenueCat integration (mocked for testing)
- 🔐 **JWT Authentication** - Secure login with email/password
- 📊 **Performance Tracking** - Win rate and trading history
- 🎨 **Premium Dark UI** - Bloomberg/TradingView aesthetic

## Tech Stack

### Mobile App (React Native + Expo)
- React Native with Expo
- React Navigation
- RevenueCat (mocked)
- Expo SecureStore
- Linear Gradient & Blur effects

### Backend (FastAPI)
- FastAPI + Python
- MongoDB
- JWT Authentication
- GPT-5.2 via Emergent LLM Key

## Project Structure

```
/app
├── backend/                  # FastAPI backend
│   ├── server.py            # Main API server
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
└── mobile/                   # React Native app
    ├── App.js               # Entry point
    ├── app.json             # Expo config
    ├── package.json         # Dependencies
    └── src/
        ├── screens/         # App screens
        ├── navigation/      # Navigation setup
        ├── context/         # Auth & Subscription context
        ├── services/        # API service
        └── utils/           # Theme & utilities
```

## Getting Started

### Backend Setup

```bash
cd /app/backend
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Mobile App Setup

```bash
cd /app/mobile
npm install  # or yarn
npx expo start
```

Then scan the QR code with Expo Go app on your device.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user |
| `/api/signals/generate` | POST | Generate AI signal |
| `/api/signals` | GET | Get user signals |
| `/api/performance` | GET | Get trading stats |
| `/api/subscription` | GET | Get subscription status |
| `/api/dashboard` | GET | Get dashboard data |

## Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=signaldesk
JWT_SECRET=your_secret_key
EMERGENT_LLM_KEY=your_key
```

### Mobile (update in api.js)
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## RevenueCat Integration

Currently mocked for testing. To enable real payments:

1. Create RevenueCat account
2. Configure products in RevenueCat dashboard
3. Install `react-native-purchases`
4. Replace mock implementation in `SubscriptionContext.js`

## Screens

1. **Onboarding** - Premium intro with feature slides
2. **Login/Register** - JWT authentication
3. **Dashboard** - Market overview and stats
4. **Signals** - AI signal generation and list
5. **Signal Detail** - Expanded signal breakdown
6. **Performance** - Win rate and history
7. **Account** - Profile and subscription
8. **Paywall** - Subscription modal

## Design System

- **Colors**: Matte black, emerald green (buy), crimson red (sell), gold accents
- **Typography**: SF Pro style with monospace for prices
- **Animations**: Smooth micro-interactions
- **Style**: Bloomberg/TradingView institutional aesthetic

## Disclaimer

This app is for demonstration purposes. Trading involves substantial risk of loss. Not financial advice.

---

Built with ❤️ using React Native + FastAPI + GPT-5.2
