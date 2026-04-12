import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

/* SVG icons */
const Icon = {
  mail: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m2 7 10 7 10-7"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="10" rx="2"/>
      <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  )
};

const LoginPage = () => {

  const navigate = useNavigate();

  const { login } = useAuth(); 

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});

    const handleChange = (e) => {

    const { id, value } = e.target;

    setForm(prev => ({
        ...prev,
        [id]: value
    }));

    /* remove error while typing */
    setErrors(prev => ({
        ...prev,
        [id]: ""
    }));

    };

    const validate = () => {

    let newErrors = {};

    /* email validation */
    if (!form.email.trim())
        newErrors.email = "Email is required";

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Enter valid email address";


    /* password validation */
    if (!form.password)
        newErrors.password = "Password is required";

    else if (form.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

    };

const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validate()) return;

  try {

    const response = await API.post("/auth/login", form);

    console.log("Login success:", response.data);

    const user = {

      userId: response.data.userId,

      name: response.data.name,

      email: response.data.email,

      role: response.data.role,

      token: response.data.token

    };


    login(user);

    alert("Login successful");

    /*
      redirect based on role
    */
    if(user.role === "ADMIN") {

      navigate("/admin");

    }
    else {

      navigate("/employee");

    }

  }
  catch(error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Invalid email or password"
    );

  }

};

  return (

    <div className="register-page">

      <div className="register-card">

        <h1 className="register-title">
          Login to AssetPulse
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="field-container">

            <label className="input-label">
              Email <span className="required-star">*</span>
            </label>

            <div className={`input-wrap ${errors.email ? "input-error" : ""}`}>

              <span className="input-icon">
                {Icon.mail}
              </span>

              <input
                id="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="register-input"
              />

            </div>

            {errors.email && (
              <span className="error-text">
                {errors.email}
              </span>
            )}

          </div>


          {/* Password */}
          <div className="field-container">

            <label className="input-label">
              Password <span className="required-star">*</span>
            </label>

            <div className={`input-wrap ${errors.password ? "input-error" : ""}`}>

              <span className="input-icon">
                {Icon.lock}
              </span>

              <input
                id="password"
                type="password"
                placeholder="Password"
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

            
            <button
            className="register-btn"
            disabled={!form.email || !form.password}
            >
            Login
            </button>


          <p className="auth-switch-text">

            Don’t have an account ?

            <span
              className="auth-link"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>

          </p>

        </form>

      </div>

    </div>

  );

};

export default LoginPage;