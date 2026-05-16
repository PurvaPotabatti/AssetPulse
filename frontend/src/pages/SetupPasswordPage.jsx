import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";

const SetupPasswordPage = () => {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {

    const { id, value } = e.target;

    setForm(prev => ({
      ...prev,
      [id]: value
    }));

    // remove error while typing
    setErrors(prev => ({
      ...prev,
      [id]: ""
    }));
  };

  const validate = () => {

    let newErrors = {};

    if (!form.password)
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      await API.post("/users/activate", {
        token,
        password: form.password
      });

      alert("Account activated successfully");

      navigate("/login");

    } catch (err) {

      console.error(err);

      setErrors({
        general:
          err.response?.data?.message ||
          "This invite link has expired. Please contact your admin for a new invitation."
      });
    }
  };

  return (

    <div className="register-page">

      <div className="register-card">

        <h1 className="register-title">
          Set Your Password
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Password */}
          <div className="field-container">

            <label className="input-label" style={{ fontWeight: "600" }}>
              New Password <span className="required-star">*</span>
            </label>

            <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>

              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className="register-input"
              />

            </div>

            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}

          </div>

          {/* Confirm Password */}
          <div className="field-container">

            <label className="input-label" style={{ fontWeight: "600" }}>
              Confirm Password <span className="required-star">*</span>
            </label>

            <div className={`input-wrap ${errors.confirmPassword ? "input-error" : ""}`}>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="register-input"
              />

            </div>

            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}

          </div>

          {errors.general && (
            <p className="error-text">{errors.general}</p>
          )}

          <button
            className="register-btn"
            disabled={!form.password || !form.confirmPassword}
          >
            Activate Account
          </button>

        </form>

      </div>

    </div>
  );
};

export default SetupPasswordPage;