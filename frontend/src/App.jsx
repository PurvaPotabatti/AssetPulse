import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import DashboardLayout from "./components/layout/DashboardLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />



        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={

            <ProtectedRoute allowedRole="ADMIN">

              <DashboardLayout role="admin" />

            </ProtectedRoute>

          }
        />



        {/* EMPLOYEE ROUTES */}
        <Route
          path="/employee/*"
          element={

            <ProtectedRoute allowedRole="EMPLOYEE">

              <DashboardLayout role="employee" />

            </ProtectedRoute>

          }
        />



      </Routes>

    </Router>

  );

}

export default App;