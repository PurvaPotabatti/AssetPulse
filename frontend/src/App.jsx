
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MyAssetsPage from "./pages/employee/MyAssetsPage";
import SetupPasswordPage from "./pages/SetupPasswordPage";
import MyRequestsPage from "./pages/employee/MyRequestsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {

  return (

    <Router>

      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/setup-password" element={<SetupPasswordPage />} />



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
        <Route path="/employee/my-assets" element={<Navigate to="/employee" />} />
        <Route path="/employee/my-requests" element={<Navigate to="/employee" />} />


      </Routes>

    </Router>

  );

}

export default App;