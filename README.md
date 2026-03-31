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

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/thanmayi0707/smartbuilding.git
cd smartbuilding

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

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
