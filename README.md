# LifeOS - Personal Digital Life Dashboard

**LifeOS** is a comprehensive personal dashboard designed to bring clarity to your daily life. It unifies task management, habit tracking, mood journaling, and detailed analytics into one calm, beautiful interface.

🌐 **Live Demo**: [life-os-b4d6.vercel.app](https://life-os-b4d6.vercel.app)

## ✨ Key Features

### 🎯 Smart Task Management
- Create, edit, and delete tasks with priorities (High/Medium/Low)
- Categories: Personal, Work, Health, Academic
- Real-time completion tracking

### ⚡ Habit Tracking
- **Streak System**: 7-day visual consistency tracker
- Interactive completion with animated feedback
- Edit habits via three-dots menu

### 😌 Mood & Wellness
- **Daily Check-in**: Track mood on a 5-point emoji scale
- **Dynamic Wellness Score**: Combines tasks (30%), hydration (20%), habits (20%), and mood (30%)
- Score updates **instantly** with every interaction!

### 📊 Dynamic Analytics
- **4 Animated Metric Cards**: Tasks %, Streak, Water, Mood
- Spring animations on value changes
- Smart motivational messages based on your progress:
  - "🌟 Perfect day! You're crushing it!"
  - "💧 Great hydration! Stay refreshed!"
  - "💜 It's okay to have off days."

### 💧 Hydration Tracker
- Track water intake (8 glasses goal)
- Visual progress bar with animated dots
- Directly affects your Wellness Score

### 📱 PWA & Mobile Support
- **Install as App**: Works like a native mobile app
- Responsive design for all screen sizes
- Dark/Light mode theming

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT + BCrypt
- **Email**: Resend API (for password reset)

---

## 🚀 Deployment

### Frontend (Vercel)
- Hosted at: `life-os-b4d6.vercel.app`
- Auto-deploys from GitHub `master` branch

### Backend (Render)
- Hosted at: `lifeos-sygr.onrender.com`
- Environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`

---

## 🏃 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pruthivi13/LifeOS.git
   cd LifeOS
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
LifeOS/
├── client/           # Next.js Frontend
│   ├── src/app/      # Pages & Layouts
│   ├── src/components/
│   │   ├── features/ # TasksCard, HabitsCard, AnalyticsCard, etc.
│   │   ├── ui/       # Button, Card, Modal, Dropdown, etc.
│   │   └── layout/   # Header, DashboardLayout
│   └── src/context/  # AuthContext, ThemeContext
└── server/           # Express Backend
    ├── src/models/   # User, Task, Habit, Mood schemas
    ├── src/routes/   # API endpoints
    └── src/controllers/
```

## 📄 License

MIT License. Built with ❤️ for productivity by [Pruthiviraj Sahu](https://github.com/Pruthivi13)

