import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';

const initialEmployees = [
  {
    id: 1,
    name: 'Sarah Johnson',
    employeeId: 'EMP001',
    department: 'IT Dept',
    role: 'Software Engineer',
    email: 'sarah.johnson@example.com',
    status: 'Active',
  },
  {
    id: 2,
    name: 'David Smith',
    employeeId: 'EMP002',
    department: 'HR Dept',
    role: 'HR Manager',
    email: 'david.smith@example.com',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Lisa Brown',
    employeeId: 'EMP004',
    department: 'Sales',
    role: 'Sales Executive',
    email: 'lisa.brown@example.com',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Mark Taylor',
    employeeId: 'EMP003',
    department: 'IT Dept',
    role: 'System Administrator',
    email: 'mark.taylor@example.com',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Emma Wilson',
    employeeId: 'EMP005',
    department: 'Finance',
    role: 'Accountant',
    email: 'emma.wilson@example.com',
    status: 'Inactive',
  },
];

const DEPARTMENTS = ['All Departments', 'IT Dept', 'HR Dept', 'Sales', 'Finance'];
const STATUSES    = ['All Status', 'Active', 'Inactive'];

const statusStyle = {
  Active:   { color: 'hsl(145,60%,35%)', background: 'hsl(145,55%,93%)', border: '1px solid hsl(145,55%,80%)' },
  Inactive: { color: 'hsl(215,16%,45%)', background: 'hsl(214,25%,93%)', border: '1px solid hsl(214,20%,82%)' },
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
  const isEdit = !!employee?.id;
  const [form, setForm] = useState(
    employee || { name: '', employeeId: '', department: 'IT Dept', role: '', email: '', status: 'Active' }
  );

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>

        <div className="ap-modal-fields">
          {[
            { label: 'Full Name',    key: 'name',       type: 'text' },
            { label: 'Employee ID',  key: 'employeeId', type: 'text' },
            { label: 'Role',         key: 'role',       type: 'text' },
            { label: 'Email',        key: 'email',      type: 'email' },
          ].map(({ label, key, type }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>
              <input
                className="ap-modal-input"
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}

          {[
            { label: 'Department', key: 'department', opts: ['IT Dept', 'HR Dept', 'Sales', 'Finance'] },
            { label: 'Status',     key: 'status',     opts: ['Active', 'Inactive'] },
          ].map(({ label, key, opts }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>
              <select className="ap-modal-input" value={form[key]} onChange={e => set(key, e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ap-save-btn" onClick={() => onSave(form)}>
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
const EmployeesPage = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch]       = useState('');
  const [department, setDept]     = useState('All Departments');
  const [status, setStatus]       = useState('All Status');
  const [modal, setModal]         = useState(null);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.employeeId.toLowerCase().includes(search.toLowerCase()) ||
                        e.email.toLowerCase().includes(search.toLowerCase());
    const matchDept   = department === 'All Departments' || e.department === department;
    const matchStatus = status     === 'All Status'      || e.status     === status;
    return matchSearch && matchDept && matchStatus;
  });

  const handleSave = (form) => {
    if (form.id) {
      setEmployees(prev => prev.map(e => e.id === form.id ? form : e));
    } else {
      setEmployees(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) setEmployees(prev => prev.filter(e => e.id !== id));
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
          <select className="ap-select" value={department} onChange={e => setDept(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          <ChevronDown size={15} className="ap-select-icon" />
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
                  <td className="ap-td">{emp.department}</td>
                  <td className="ap-td emp-role-cell">{emp.role}</td>
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