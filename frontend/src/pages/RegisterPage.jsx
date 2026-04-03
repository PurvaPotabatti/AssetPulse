import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

/* SVG icons (inline, no deps) */
const Icon = {
  user: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  mail: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V17a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1L6.6 10.8z"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  ),
  dept: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/>
    </svg>
  ),
  badge: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
}

const fields = [
  { id: 'name',        label: 'Full Name',    type: 'text',     icon: Icon.user,  required: true  },
  { id: 'email',       label: 'Email',        type: 'email',    icon: Icon.mail,  required: true  },
  { id: 'phone',       label: 'Phone Number', type: 'tel',      icon: Icon.phone, required: true  },
  { id: 'password',    label: 'Password',     type: 'password', icon: Icon.lock,  required: true  },
  { id: 'department',  label: 'Department',   type: 'text',     icon: Icon.dept,  required: false },
  { id: 'designation', label: 'Designation',  type: 'text',     icon: Icon.badge, required: false },
]

const RegisterPage = () => {
  const [form, setForm]   = useState({ name:'', email:'', phone:'', password:'', department:'', designation:'' })
  const [focus, setFocus] = useState(null)
  const [hover, setHover] = useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))

    const validate = () => {

    let newErrors = {};

    if (!form.name.trim())
    newErrors.name = "Name is required";

    if (!form.email)
    newErrors.email = "Email is required";

    else if (!/\S+@\S+\.\S+/.test(form.email))
    newErrors.email = "Enter valid email";

    if (!form.phone)
    newErrors.phone = "Phone number required";

    else if (!/^\d{10}$/.test(form.phone))
    newErrors.phone = "Enter 10 digit phone number";

    if (!form.password)
    newErrors.password = "Password required";

    else if (form.password.length < 6)
    newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate())
        return;

    console.log("Valid form:", form);

    };

    return (

    <div className="register-page">
        <div className="register-card">
        <h1 className="register-title">
            Create Admin Account
        </h1>


        <form onSubmit={handleSubmit}>
            
            <div className="register-field-group">
            {fields.map(({ id, label, type, icon, required }) => (

            <div key={id} className="field-container">

            <label className="input-label">

                {label}

                {required && <span className="required-star">*</span>}

            </label>


            <div className={`input-wrap ${errors[id] ? "input-error" : ""}`}>

                <span className="input-icon">{icon}</span>

                <input
                id={id}
                type={type}
                placeholder={label}
                value={form[id]}
                onChange={handleChange}
                className="register-input"
                />

            </div>


            {errors[id] && (

                <span className="error-text">

                {errors[id]}

                </span>

            )}

            </div>

            ))}

            </div>


            <button className="register-btn">

            Register

            </button>

            <p className="auth-switch-text">

            Already have an account ?

            <span
                className="auth-link"
                onClick={() => navigate("/login")}
            >
                Sign in
            </span>

            </p>

        </form>

        </div>

    </div>

    )
}

export default RegisterPage