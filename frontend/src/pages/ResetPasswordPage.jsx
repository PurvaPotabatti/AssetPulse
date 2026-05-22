import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { successToast, errorToast } from "../utils/toastUtils";

const ResetPasswordPage = () => {

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { id, value } = e.target;

    setForm(prev => ({
      ...prev,
      [id]: value
    }));

    /*
      remove error while typing
    */
    setErrors(prev => ({
      ...prev,
      [id]: ""
    }));

  };

  const validate = () => {

    let newErrors = {};

    if (!form.password) {

      newErrors.password = "Password is required";

    }
    else if (form.password.length < 6) {

      newErrors.password =
        "Password must be at least 6 characters";

    }

    if (!form.confirmPassword) {

      newErrors.confirmPassword =
        "Confirm password is required";

    }
    else if (
      form.password !== form.confirmPassword
    ) {

      newErrors.confirmPassword =
        "Passwords do not match";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    try {

      setLoading(true);

      await API.post(
        "/auth/reset-password",
        {
          token,
          password: form.password
        }
      );

      successToast("Password reset successful");

      navigate("/login");

    }
    catch (err) {

      console.error(err);

      errorToast(
        err.response?.data?.message ||
        "Reset link is invalid or expired"
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
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Password */}
          <div className="field-container">

            <label className="input-label">

              New Password
              <span className="required-star">*</span>

            </label>

            <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>

              <input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                className="register-input"
              />

            </div>

            {errors.password && (

              <span className="error-text">
                {errors.password}
              </span>

            )}

          </div>

          {/* Confirm Password */}
          <div className="field-container">

            <label className="input-label">

              Confirm Password
              <span className="required-star">*</span>

            </label>

            <div className={`input-wrap ${errors.confirmPassword ? "input-error" : ""}`}>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="register-input"
              />

            </div>

            {errors.confirmPassword && (

              <span className="error-text">
                {errors.confirmPassword}
              </span>

            )}

          </div>

          <button
            className="register-btn"
            disabled={
              loading ||
              !form.password ||
              !form.confirmPassword
            }
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

      </div>

    </div>

  );

};

export default ResetPasswordPage;