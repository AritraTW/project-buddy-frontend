// src/main.tsx (or similar entry point)
import React from 'react'
import ReactDOM from 'react-dom/client'
import RetroBuddyDashboard from './App.tsx' // Import the component
import "react-big-calendar/lib/css/react-big-calendar.css"; // <-- Add this line
import './index.css' // Main CSS file

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RetroBuddyDashboard /> {/* Render the component */}
    </React.StrictMode>,
)