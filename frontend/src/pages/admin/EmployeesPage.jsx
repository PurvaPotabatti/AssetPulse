import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import API from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const STATUSES    = ['All Status', 'Invited', 'Active', 'Inactive'];

const statusStyle = {
  Active:   { color: 'hsl(145,60%,35%)', background: 'hsl(145,55%,93%)', border: '1px solid hsl(145,55%,80%)' },
  Inactive: { color: 'hsl(215,16%,45%)', background: 'hsl(214,25%,93%)', border: '1px solid hsl(214,20%,82%)' },
  Invited: {
    color: 'hsl(220,15%,40%)',
    background: 'hsl(220,20%,94%)',
    border: '1px solid hsl(220,15%,85%)'
  },
};

/* ── Truncate email display ── */
const truncateEmail = (email) => {
  const [local, domain] = email.split('@');
  return {
    local: local.length > 9 ? local.slice(0, 9) + '…' : local,
    domain: '@' + (domain?.length > 10 ? domain.slice(0, 10) + '…' : domain),
  };
};

/* ── Modal ── */
const EmployeeModal = ({ employee, onClose, onSave }) => {

  const [errors, setErrors] = useState({});

  const isEdit = !!employee?.id;
  const [form, setForm] = useState(
    employee || {
      name: '',
      employeeId: '',
      department: '',
      role: '',
      email: ''
    }
  );

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {

    let newErrors = {};

    if (!form.name.trim())
      newErrors.name = "Name required";

    if (!form.email.trim())
      newErrors.email = "Email required";

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>

        <div className="ap-modal-fields">


          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Full Name
            </label>

            <input
              className="ap-modal-input"
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />

            {errors.name && (
              <span className="ap-error-text">
                {errors.name}
              </span>
            )}

          </div>


          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Email
            </label>

            <input
              className="ap-modal-input"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />

            {errors.email && (
              <span className="ap-error-text">
                {errors.email}
              </span>
            )}

          </div>

          {[
            { label: 'Department (optional)', key: 'department', type: 'text' },
            { label: 'Designation (optional)', key: 'role', type: 'text' }
          ].map(({ label, key, type }) => (

            <div key={key} className="ap-modal-field">

              <label className="ap-modal-label">{label}</label>

              <input
                className="ap-modal-input"
                type="text"
                value={form[key] || ""}
                onChange={e => set(key, e.target.value)}
              />

            </div>

          ))}

        </div>

        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="ap-save-btn"
            onClick={() => {
              if(!validate()) return;
              onSave(form);
            }}
          >
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch]       = useState('');
  const [status, setStatus]       = useState('All Status');
  const [modal, setModal]         = useState(null);
  const { user } = useAuth();
 
    useEffect(() => {
    fetchEmployees();
  }, []);

const fetchEmployees = async () => {

  try {

    const response = await API.get(`/users/${user.userId}`);

    /*
      map backend fields to UI fields
    */
    const mapped = response.data.map(u => ({
      id: u.id,
      name: u.name,
      employeeId: u.employeeId, // temporary
      department: u.department,
      role: u.designation,
      email: u.email,
      status:u.status === "ACTIVE"
                ? "Active"
                : u.status === "INVITED"
                ? "Invited"
                : "Inactive"
    }));

    setEmployees(mapped);

  }
  catch(err) {

    console.error(err);

  }

};

const filtered = employees.filter(e => {

  const matchSearch =
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase());

  const matchStatus =
    status === 'All Status' || e.status === status;

  return matchSearch && matchStatus;

});

const handleSave = async (form) => {

  try {

    /*
      CREATE employee
    */
    if (!form.id) {

      await API.post("/users", {

        name: form.name,
        email: form.email,
        password: "Welcome@123",
        phone: null,
        department: form.department || null,
        designation: form.role || null,
        adminId: user.userId   // NEW

      });

    }

    /*
      UPDATE employee (later)
    */
    else {

      await API.put(`/users/${form.id}`, {
        name: form.name,
        email: form.email,   
        department: form.department || null,
        designation: form.role || null,
        status: form.status === "Active"
                  ? "ACTIVE"
                  : "INACTIVE"
      });
    }

    fetchEmployees();

    setModal(null);

  }
  catch(err) {

    console.error(err);

    alert("Error saving employee");

  }

};

const handleDelete = async (id) => {

  try {

    await API.delete(`/users/${id}`);

    fetchEmployees();

  }
  catch(err) {

    console.error(err);

  }

};

  return (
    <div className="ap-page">

      {/* ── Header card ── */}
      <div className="ap-header-card">
        <h1 className="ap-page-title">Employees</h1>
        <button className="ap-add-btn" onClick={() => setModal('add')}>
          <Plus size={17} strokeWidth={2.5} />
          Add Employee
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="ap-filter-card">
        <div className="ap-search-wrap">
          <Search size={16} className="ap-search-icon" />
          <input
            className="ap-search-input"
            placeholder="Search employees..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select" value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={15} className="ap-select-icon" />
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="ap-table-card ap-table-wrapper">
        <table className="ap-table emp-table">
          <thead>
            <tr>
              {['Name', 'Employee ID', 'Department', 'Role', 'Email', 'Status', 'Actions'].map(h => (
                <th key={h} className="ap-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="ap-empty">No employees found.</td>
              </tr>
            ) : filtered.map((emp, i) => {
              const { local, domain } = truncateEmail(emp.email);
              return (
                <tr key={emp.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>
                  <td className="ap-td ap-td-name">{emp.name}</td>
                  <td className="ap-td">{emp.employeeId}</td>
                  <td className="ap-td">
                    {emp.department || "—"}
                  </td>

                  <td className="ap-td emp-role-cell">
                    {emp.role || "—"}
                  </td>
                  <td className="ap-td">
                    <div className="emp-email-wrap">
                      <span className="emp-email-local">{local}</span>
                      <span className="emp-email-domain">{domain}</span>
                    </div>
                  </td>
                  <td className="ap-td">
                    <span className="ap-status-badge" style={statusStyle[emp.status] || {}}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="ap-td ap-td-actions">
                    <button className="ap-action-btn ap-edit-btn" onClick={() => setModal(emp)}>
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button className="ap-action-btn ap-delete-icon-btn" onClick={() => handleDelete(emp.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <EmployeeModal
          employee={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EmployeesPage;