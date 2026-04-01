# 🏠 SmartBuild — AI-Powered Construction Planner

SmartBuild is a modern web application that helps Indian homeowners plan their dream home using AI-powered construction planning. Get detailed project summaries, cost estimates, interior design suggestions, Vastu-compliant layouts, and construction timelines — all tailored to your specific requirements.

![SmartBuild](https://img.shields.io/badge/SmartBuild-AI%20Powered-10B981?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)

## ✨ Features

- 🤖 **AI-Generated Plans** — Get comprehensive construction plans powered by Google Gemini AI with smart fallback
- 📋 **Project Summary** — BHK recommendations, space planning, regulatory considerations
- 💰 **Cost Estimation** — Material-wise and phase-wise cost breakdown at current Indian market rates
- 🎨 **Interior Design** — Style suggestions, color palettes, room-wise interior plans
- 🧭 **Vastu Layout** — Room placement as per Vastu Shastra with remedies
- 📅 **Construction Timeline** — Phase-by-phase schedule with seasonal considerations
- 🔐 **Firebase Authentication** — Email/password and Google sign-in
- 📱 **Responsive Design** — Premium glassmorphism UI that works on all devices

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Frontend UI framework |
| **Vite 8** | Build tool & dev server |
| **Firebase** | Authentication (Email + Google) |
| **Google Gemini API** | AI plan generation |
| **React Router v7** | Client-side routing |
| **React Icons** | UI icons (Heroicons v2) |
| **Vanilla CSS** | Premium glassmorphism styling |

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** 18+ and **npm**
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))
- **OpenRouter API Key** (Optional, for fallback models)
- **Firebase Project** (For authentication)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/thanmayi0707/smartbuilding.git
cd smartbuilding

# Install frontend & serverless dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your credentials:

```env
# AI API Keys
VITE_GEMINI_API_KEY="your_gemini_key"
OPENROUTER_API_KEY="your_openrouter_key"

# Firebase Config
VITE_FIREBASE_API_KEY="..."
VITE_FIREBASE_AUTH_DOMAIN="..."
VITE_FIREBASE_PROJECT_ID="..."
VITE_FIREBASE_STORAGE_BUCKET="..."
VITE_FIREBASE_MESSAGING_SENDER_ID="..."
VITE_FIREBASE_APP_ID="..."
```

### 4. Running Locally

#### Option A: Full-Stack (Frontend + Serverless Functions)
This mimics the Vercel production environment:
```bash
# Start the Vite frontend
npm run dev
```

#### Option B: Separate Backend (Express)
If you prefer running the logic via the `backend/` folder:
```bash
# In one terminal, start the backend
cd backend
npm install
npm run dev

# In another terminal, start the frontend
cd ..
npm run dev
```

The app will be running at `http://localhost:5173`.

## ☁️ Deployment (Vercel)

The project is pre-configured for **Vercel Serverless Functions**.

1.  **Install Vercel CLI**: `npm i -g vercel`
2.  **Add Environment Variables**: Go to Vercel Dashboard Settings and add your API keys.
3.  **Deploy**: Run `vercel --prod`

## 📁 Project Structure

```
smartbuilding/
├── src/
│   ├── components/
│   │   ├── ProjectForm.jsx      # Construction project input form
│   │   ├── AIResults.jsx        # AI results display component
│   │   └── Sidebar.jsx          # Sidebar navigation
│   ├── contexts/
│   │   └── AuthContext.jsx      # Firebase authentication context
│   ├── pages/
│   │   ├── LandingPage.jsx      # Homepage with features & CTA
│   │   ├── AuthPage.jsx         # Login / Sign-up page
│   │   ├── Dashboard.jsx        # Project form & user dashboard
│   │   └── ResultsPage.jsx      # AI-generated results (accordion)
│   ├── services/
│   │   └── aiService.js         # Gemini API + fallback data engine
│   ├── firebase.js              # Firebase configuration
│   ├── App.jsx                  # Root component with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Complete design system (CSS)
├── backend/                     # Express backend (optional)
├── index.html                   # HTML entry
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## 📸 Pages

1. **Landing Page** — Premium SaaS-style homepage with hero, features, and how-it-works sections
2. **Auth Page** — Login/signup with email or Google authentication
3. **Dashboard** — Enter project details (plot size, budget, location, floors, direction, etc.)
4. **Results Page** — View AI-generated plans in an accordion layout with 5 detailed sections

## 🔑 How the AI Works

SmartBuild uses a **dual-engine approach**:

1. **Primary**: Google Gemini 2.0 Flash API for dynamic, context-aware responses
2. **Fallback**: Built-in Smart Data Engine with comprehensive Indian construction datasets

This ensures the app **always works** — even when the AI API is unavailable, rate-limited, or offline.

## 👥 Team

Built for Indian homeowners who want smart, data-driven construction planning.

## 📄 License

ISC License

---

*Built with ❤️ using React + AI for Indian homeowners*
