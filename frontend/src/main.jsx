import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";

import './index.css'
import "./styles/global.css";

import App from './App.jsx'

import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(

  <StrictMode>

    <AuthProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
            padding: "14px 16px",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },

          error: {
            duration: 4000,
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <App />

    </AuthProvider>

  </StrictMode>

)