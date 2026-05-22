import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { successToast, errorToast } from "../utils/toastUtils";

const ForgotPasswordPage = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);


  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email.trim()) {

      setError("Email is required");

      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/auth/forgot-password",
        { email }
      );

      successToast(response.data);

    }
    catch (err) {

      console.error(err);

      errorToast(
        err.response?.data?.message ||
        "Something went wrong"
      );

    }
    finally {

      setLoading(false);

    }

  };

  return (

    <div className="register-page">

      <div className="register-card">

        <h1 className="register-title">
          Forgot Password
        </h1>

        <p
          style={{
            marginBottom: "20px",
            color: "#666",
            fontSize: "14px"
          }}
        >
          Enter your registered email address.
          We’ll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="field-container">

            <label className="input-label">
              Email <span className="required-star">*</span>
            </label>

            <div className={`input-wrap ${error ? "input-error" : ""}`}>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="register-input"
              />

            </div>

            {error && (
              <span className="error-text">
                {error}
              </span>
            )}

          </div>

          <button
            className="register-btn"
            disabled={loading || !email}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

          <p className="auth-switch-text">

            Remember your password?

            <span
              className="auth-link"
              onClick={() => navigate("/login")}
            >
              Login
            </span>

          </p>

        </form>

      </div>

    </div>

  );

};

export default ForgotPasswordPage;