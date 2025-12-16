# LifeOS - Personal Digital Life Dashboard

**LifeOS** is a comprehensive personal dashboard designed to bring clarity to your daily life. It unifies task management, habit tracking, mood journaling, and detailed analytics into one calm, beautiful interface.

🌐 **Live Demo**: [life-os-b4d6.vercel.app](https://life-os-b4d6.vercel.app)

---

## ✨ Key Features

### 🎯 Smart Task Management
- Create, edit, and delete tasks with priorities (High/Medium/Low)
- Categories: Personal, Work, Health, Academic
- Real-time completion tracking with animations

### ⚡ Habit Tracking
- **7-Day Streak System**: Visual consistency tracker
- Interactive completion with animated feedback
- Quick access via three-dots dropdown menu

### 😌 Mood & Wellness
- **Daily Check-in**: Track mood on a 5-point emoji scale
- **Dynamic Wellness Score**: Combines tasks (30%), hydration (20%), habits (20%), and mood (30%)
- Score updates **instantly** with every interaction!

### 📊 Dynamic Analytics
- **4 Animated Metric Cards**: Tasks %, Streak, Water, Mood
- Spring animations on value changes
- Smart motivational messages based on your progress

### 💧 Hydration Tracker
- Track water intake (8 glasses goal)
- Visual progress bar with animated dots
- Directly affects your Wellness Score

### 👤 Avatar Picker
- **18 Predefined Avatars** (Male, Female, Fun categories)
- Powered by DiceBear API for reliable loading
- **Syncs across all devices** automatically

### 📱 PWA & Mobile Support
- **Install as App**: Works like a native mobile app
- Responsive design for all screen sizes
- Dark/Light mode theming

---

## 📖 How to Use

### Getting Started
1. **Register** with your email and password
2. **Choose an avatar** from Profile Settings
3. Start tracking your daily life!

### Daily Workflow
1. ✅ **Add Tasks** → Click "+ Add task" or use the dropdown menu
2. 🔥 **Complete Habits** → Tap habit circles to mark as done
3. 💧 **Track Hydration** → Use +/- buttons to log water intake
4. 😊 **Log Mood** → Select your mood emoji for the day
5. 📈 **Check Progress** → View your Wellness Score and analytics

### Profile & Avatar
1. Click your avatar in the header → Go to Profile
2. Choose from **Male**, **Female**, or **Fun** avatar categories
3. Click "Save Changes" → Avatar syncs to all your devices!

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | Node.js, Express.js, MongoDB Atlas |
| **Auth** | JWT + BCrypt |
| **Avatars** | DiceBear API |
| **Hosting** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Deployment

| Service | URL |
|---------|-----|
| **Frontend** | [life-os-b4d6.vercel.app](https://life-os-b4d6.vercel.app) |
| **Backend** | lifeos-sygr.onrender.com |

---

## 🏃 Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Quick Start

```bash
# Clone repository
git clone https://github.com/Pruthivi13/LifeOS.git
cd LifeOS

# Backend setup
cd server
npm install
cp .env.example .env  # Configure your environment variables
npm run dev

# Frontend setup (new terminal)
cd client
npm install
npm run dev
```

### Environment Variables

**Server (.env)**
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
RESEND_API_KEY=your_resend_key  # Optional, for password reset emails
```

**Client (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📂 Project Structure

```
LifeOS/
├── client/                 # Next.js Frontend
│   ├── src/app/           # Pages & Layouts
│   ├── src/components/
│   │   ├── features/      # TasksCard, HabitsCard, AnalyticsCard
│   │   └── ui/            # Button, Card, Modal, Avatar, Dropdown
│   ├── src/context/       # AuthContext, ThemeContext
│   └── src/lib/           # API config, avatar definitions
└── server/                 # Express Backend
    ├── src/models/        # User, Task, Habit, Mood schemas
    ├── src/routes/        # API endpoints
    └── src/controllers/   # Business logic
```

---

## 📄 License

MIT License. Built with ❤️ by [Pruthiviraj Sahu](https://github.com/Pruthivi13)


