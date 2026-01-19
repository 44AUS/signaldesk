# SignalDesk AI - Product Requirements Document

## Project Overview
Premium React Native mobile app for AI-powered trading signals with institutional-grade UI/UX design.

## Original Problem Statement
Build a premium React Native mobile app (iOS & Android) with a luxury trading / institutional desk vibe where AI generates real-time trading signals including Buy/Sell entries, Take-Profit targets, and Stop-Loss levels.

## User Choices
- **Platform**: React Native (Expo) - exportable code
- **Subscription**: $49.99/month via RevenueCat (MOCKED for testing)
- **AI Model**: GPT-5.2 via Emergent LLM Key
- **Authentication**: JWT-based custom auth

## User Personas

### Primary: Active Trader
- Age: 25-45
- Trades crypto, stocks, forex
- Wants AI-assisted decision making
- Values professional, premium tools
- Willing to pay for quality signals

### Secondary: Crypto Enthusiast
- New to trading
- Looking for guidance
- Attracted by AI-powered analysis
- Mobile-first user

## Core Requirements

### Functional Requirements
1. ✅ User authentication (register/login with JWT)
2. ✅ AI signal generation using GPT-5.2
3. ✅ Multi-asset support (crypto, stocks, forex, commodities)
4. ✅ Signal details (entry, TP, SL, confidence, reasoning)
5. ✅ Performance tracking (win rate, total signals)
6. ✅ Subscription management (mocked RevenueCat)
7. ✅ Dashboard overview
8. ✅ Signal history

### Non-Functional Requirements
1. ✅ Dark mode first design
2. ✅ Bloomberg/TradingView aesthetic
3. ✅ Smooth animations and micro-interactions
4. ✅ Secure JWT authentication
5. ✅ Responsive across devices

## Architecture

### Backend (FastAPI + MongoDB)
```
/app/backend/
├── server.py          # Main API with all endpoints
├── requirements.txt   # Python dependencies
└── .env              # Environment variables
```

**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/signals/generate` - Generate AI signal
- `GET /api/signals` - Get user signals
- `GET /api/signals/:id` - Get signal details
- `GET /api/performance` - Get trading stats
- `GET /api/subscription` - Get subscription status
- `GET /api/dashboard` - Get dashboard data
- `GET /api/assets` - Get available assets

### Mobile App (React Native + Expo)
```
/app/mobile/
├── App.js                    # Entry point
├── src/
│   ├── screens/             # 8 screens
│   ├── navigation/          # Stack + Tab navigators
│   ├── context/             # Auth + Subscription context
│   ├── services/            # API service
│   └── utils/               # Theme constants
```

**Screens:**
1. OnboardingScreen - Premium intro
2. LoginScreen - Email/password login
3. RegisterScreen - User registration
4. DashboardScreen - Market overview
5. SignalsScreen - Signal list + generation
6. SignalDetailScreen - Expanded breakdown
7. PerformanceScreen - Trading stats
8. AccountScreen - Profile + subscription
9. PaywallScreen - Subscription modal

## What's Been Implemented ✅

### January 19, 2026
- [x] Complete FastAPI backend with 10 endpoints
- [x] JWT authentication system
- [x] GPT-5.2 AI signal generation (working)
- [x] MongoDB data persistence
- [x] Full React Native Expo app structure
- [x] All 9 screens implemented
- [x] Dark mode premium UI design
- [x] RevenueCat subscription (MOCKED)
- [x] Navigation (Stack + Bottom Tabs)
- [x] Context providers (Auth + Subscription)
- [x] Theme system with trading colors
- [x] Backend API tested - 100% pass rate

## Prioritized Backlog

### P0 - Critical (for production)
- [ ] Replace RevenueCat mock with real integration
- [ ] Add push notifications for signal alerts
- [ ] Implement biometric authentication (Face ID/Fingerprint)

### P1 - Important
- [ ] Add real-time price charts (native, not TradingView embed)
- [ ] Signal status updates (hit TP, stopped out)
- [ ] Historical performance charts
- [ ] Alert center for notifications

### P2 - Nice to Have
- [ ] Multiple currency support
- [ ] Customizable timeframe preferences
- [ ] Signal sharing functionality
- [ ] Dark/light mode toggle
- [ ] Watchlist feature

## Technical Debt
- Mobile app needs to be run in separate Expo environment (Emergent platform supports React web, not React Native)
- API URL in mobile app needs to be updated to production backend URL

## Notes
- RevenueCat is **MOCKED** for testing - no real charges
- Subscription auto-grants `premium_trial` on user registration
- GPT-5.2 generates real AI signals via Emergent LLM Key
- App designed for iOS & Android deployment

---
Last Updated: January 19, 2026
