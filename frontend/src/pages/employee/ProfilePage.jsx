import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axiosConfig";
import {
  successToast,
  errorToast
} from "../../utils/toastUtils";

const ProfilePage = () => {

  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: ""
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      const response = await API.get("/users/profile");

      setProfile(response.data);

      setEditForm({
        name: response.data.name || "",
        phone: response.data.phone || ""
      });

    } catch (err) {

      console.error("Error loading profile", err);

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

  const { name, value } = e.target;

    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handlePasswordChange = (e) => {

    const { name, value } = e.target;

    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

  }; 

  const handleSave = async () => {

    if (!editForm.name.trim()) {

      errorToast("Full name is required");

      return;

    }

    if (editForm.name.trim().length < 3) {

      errorToast("Full name must be at least 3 characters");

      return;

    }

    if (!/^[A-Za-z\s]+$/.test(editForm.name.trim())) {

      errorToast("Full name can contain only letters and spaces");

      return;

    }

    if (
      editForm.phone.trim() &&
      !/^[0-9]{10}$/.test(editForm.phone.trim())
    ) {

      errorToast("Phone number must be 10 digits");

      return;

    }

    try {

      const response = await API.put(
        "/users/profile",
        editForm
      );

      setProfile(response.data);

      updateUser({
        name: response.data.name,
        phone: response.data.phone
      });

      setIsEditing(false);

      successToast("Profile updated successfully");

    } catch (err) {

      console.error(err);

      errorToast("Failed to update profile");

    }

  };

  const handlePasswordSave = async () => {

    /*
      Basic validation
    */

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {

      errorToast("All password fields are required");

      return;

    }

    if (passwordForm.newPassword.length < 6) {

      errorToast("New password must be at least 6 characters");

      return;

    }

    if (
      passwordForm.currentPassword ===
      passwordForm.newPassword
    ) {

      errorToast(
        "New password must be different from current password"
      );

      return;

    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {

      errorToast("New passwords do not match");

      return;

    }

    try {

      const response = await API.put(

        "/users/change-password",

        passwordForm

      );

      successToast(response.data);

      /*
        Reset form
      */

      setPasswordForm({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

      });

      setShowPasswordForm(false);

    } catch (err) {

      console.error(err);

      errorToast(

        err.response?.data ||
        "Failed to update password"

      );

    }

  };  

  
  if (loading) {

    return (
      <div className="pf-page">
        <p>Loading profile...</p>
      </div>
    );

  }

  const name = profile?.name || "User";

  const roleLabel = profile?.role || "Employee";

  const initial = name?.charAt(0)?.toUpperCase() || "U";

  const personal = [

    { label: 'Full Name', value: profile?.name || '—' },

    { label: 'Email', value: profile?.email || '—' },

    { label: 'Phone', value: profile?.phone || '—' },

    { label: 'Department', value: profile?.department || '—' },

    { label: 'Role', value: profile?.role || '—' },

    { label: 'Employee ID', value: profile?.employeeId || '—' },

  ];

  const account = [

    {
      label: 'Account Created',
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString()
        : '—'
    },

    {
      label: 'Status',
      value: profile?.status || '—'
    }

  ];

  return (

    <div className="pf-page">

      {/* Header */}
      <div className="pf-header-card">

        {/* Initial Avatar */}
        <div
          className="pf-avatar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(214,80%,51%)",
            color: "white",
            fontSize: "28px",
            fontWeight: "600"
          }}
        >
          {initial}
        </div>

        <div className="pf-header-info">

          <h2 className="pf-name">
            {name}
          </h2>

          <p className="pf-role-text">
            {roleLabel}
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "12px"
            }}
          >

            {!isEditing ? (

              <button
                className="ap-btn ap-btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

            ) : (

              <>
                <button
                  className="ap-btn ap-btn-primary"
                  onClick={handleSave}
                >
                  Save
                </button>

                <button
                  className="ap-btn ap-btn-secondary"
                  onClick={() => {

                    setEditForm({
                      name: profile?.name || "",
                      phone: profile?.phone || ""
                    });

                    setIsEditing(false);

                  }}
                >
                  Cancel
                </button>
              </>

            )}

          </div>

        </div>

      </div>

      {/* Body */}
      <div className="pf-body">

        {/* Personal Info */}
        <div className="pf-card">

          <h3 className="pf-card-title">
            Personal Information
          </h3>

          <table className="pf-info-table">

            <tbody>

              {personal.map(({ label, value }) => (

                <tr key={label} className="pf-info-row">

                  <td className="pf-info-label">
                    {label}
                  </td>

                  <td className="pf-info-value">

                    {isEditing && label === "Full Name" ? (

                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleChange}
                        className="pf-edit-input"
                        style={{ maxWidth: "220px" }}
                      />

                    ) : isEditing && label === "Phone" ? (

                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleChange}
                        className="pf-edit-input"
                        style={{ maxWidth: "220px" }}
                      />

                    ) : (

                      value

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Right Column */}
        <div className="pf-right-col">

          <div className="pf-card">

            <h3 className="pf-card-title">
              Account Information
            </h3>

            <table className="pf-info-table">

              <tbody>

                {account.map(({ label, value }) => (

                  <tr key={label} className="pf-info-row">

                    <td className="pf-info-label">
                      {label}
                    </td>

                    <td className="pf-info-value">
                      {value}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        <div className="pf-card">

    <div className="pf-security-header">

    <h3 className="pf-card-title">
      Security Settings
    </h3>

    {!showPasswordForm && (

      <button
        className="ap-btn ap-btn-primary"
        onClick={() => setShowPasswordForm(true)}
      >
        Change Password
      </button>

    )}

  </div>

  {showPasswordForm && (

    <div className="pf-password-form">

      <input
        type="password"
        name="currentPassword"
        placeholder="Current Password"
        value={passwordForm.currentPassword}
        onChange={handlePasswordChange}
        className="pf-edit-input"
      />

      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={passwordForm.newPassword}
        onChange={handlePasswordChange}
        className="pf-edit-input"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm New Password"
        value={passwordForm.confirmPassword}
        onChange={handlePasswordChange}
        className="pf-edit-input"
      />

    <div className="pf-password-actions">

        <button
          className="ap-btn ap-btn-primary"
          onClick={handlePasswordSave}
        >
          Update Password
        </button>

        <button
          className="ap-btn ap-btn-secondary"
          onClick={() => {

            setPasswordForm({

              currentPassword: "",

              newPassword: "",

              confirmPassword: ""

            });

            setShowPasswordForm(false);

          }}
        >
          Cancel
        </button>

      </div>

    </div>

  )}

</div>        
        </div>

      </div>

    </div>

  );

};

export default ProfilePage;