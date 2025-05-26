# Personal Health Tracker - VS Code Project

A beautiful, modern health tracking application built with React and Vite.

## Features

✅ **Dashboard Overview**
- Real-time health metrics (weight, steps, heart rate, water intake)
- Interactive weight progress charts
- Quick action buttons for logging data

✅ **Health Logging**
- Log weight measurements
- Track daily activities and exercises
- Record vital signs (heart rate, blood pressure)
- Monitor water intake

✅ **Goal Tracking**
- Set and monitor health goals
- Visual progress indicators
- Achievement tracking

✅ **Modern UI**
- Responsive design for desktop and mobile
- Clean, healthcare-focused interface
- Interactive charts and visualizations

## Quick Start

1. **Download all the files:**
   - `vscode-package.json` → rename to `package.json`
   - `vscode-vite.config.js` → rename to `vite.config.js`
   - `vscode-index.html` → rename to `index.html`
   - `vscode-main.jsx` → create `src/main.jsx`
   - `vscode-App.jsx` → create `src/App.jsx`
   - `vscode-index.css` → create `src/index.css`

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Start tracking your health journey!

## Project Structure

```
health-tracker/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Recharts** - Beautiful charts and graphs
- **Lucide React** - Modern icon library
- **CSS Variables** - Theming and responsive design

## Data Storage

This version uses local state management. To add persistent storage, you can integrate:
- LocalStorage for client-side persistence
- Firebase for cloud storage
- Your own backend API

Ready to start your health tracking journey! 🏃‍♂️💪