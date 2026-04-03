import React, { useState } from 'react';
import {
  Search, ChevronDown, Plus, Eye, RotateCcw,
  Monitor, Smartphone, Printer, Laptop, Server
} from 'lucide-react';

/* ── Asset category icon map ── */
const CategoryIcon = ({ category }) => {
  const props = { size: 16, strokeWidth: 1.8 };
  const icons = {
    Laptop:   <Laptop   {...props} />,
    Phone:    <Smartphone {...props} />,
    Monitor:  <Monitor  {...props} />,
    Printer:  <Printer  {...props} />,
    Desktop:  <Monitor  {...props} />,
    Server:   <Server   {...props} />,
  };
  return (
    <span className="asgn-asset-icon">
      {icons[category] || <Monitor {...props} />}
    </span>
  );
};

/* ── Seed data ── */
const initialAssignments = [
  {
    id: 1,
    category:     'Laptop',
    assetName:    'Dell XPS',
    assetId:      'AST001',
    employee:     'Sarah Johnson',
    department:   'IT Dept',
    assignedDate: '12 Feb, 2024',
    returnDate:   null,
    status:       'Assigned',
  },
  {
    id: 2,
    category:     'Phone',
    assetName:    'iPhone 12',
    assetId:      'AST002',
    employee:     'David Smith',
    department:   'HR Dept',
    assignedDate: '05 Feb, 2024',
    returnDate:   null,
    status:       'Assigned',
  },
  {
    id: 3,
    category:     'Desktop',
    assetName:    'HP EliteDesk',
    assetId:      'AST003',
    employee:     'Lisa Brown',
    department:   'Sales Dept',
    assignedDate: '20 Jan, 2024',
    returnDate:   '20 Mar, 2024',
    status:       'Returned',
  },
  {
    id: 4,
    category:     'Printer',
    assetName:    'Epson Printer',
    assetId:      'AST004',
    employee:     'Mark Taylor',
    department:   'IT Dept',
    assignedDate: '15 Jan, 2024',
    returnDate:   null,
    status:       'Assigned',
  },
  {
    id: 5,
    category:     'Monitor',
    assetName:    'Samsung Monitor',
    assetId:      'AST005',
    employee:     'James Wilson',
    department:   'IT Dept',
    assignedDate: '10 Jan, 2024',
    returnDate:   '10 Feb, 2024',
    status:       'Returned',
  },
  {
    id: 6,
    category:     'Monitor',
    assetName:    'Samsung Monitor',
    assetId:      'AST005',
    employee:     'James Wilson',
    department:   'IT Dept',
    assignedDate: '10 Jan, 2024',
    returnDate:   '10 Feb, 2024',
    status:       'Returned',
  },
];

const EMPLOYEES  = ['All Employees', 'Sarah Johnson', 'David Smith', 'Lisa Brown', 'Mark Taylor', 'James Wilson'];
const STATUSES   = ['All Status', 'Assigned', 'Returned'];

const statusStyle = {
  Assigned: { color: 'hsl(38,90%,38%)',  background: 'hsl(38,90%,93%)',  border: '1px solid hsl(38,80%,78%)' },
  Returned: { color: 'hsl(145,60%,35%)', background: 'hsl(145,55%,93%)', border: '1px solid hsl(145,55%,80%)' },
};

/* ── Assign Modal ── */
const AssignModal = ({ assignment, onClose, onSave }) => {
  const isEdit = !!assignment?.id;
  const [form, setForm] = useState(assignment || {
    category: 'Laptop', assetName: '', assetId: '',
    employee: '', department: '', assignedDate: '', returnDate: '', status: 'Assigned',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Assignment' : 'Assign Asset'}</h2>
        <div className="ap-modal-fields">
          {[
            { label: 'Asset Name',     key: 'assetName',    type: 'text'  },
            { label: 'Asset ID',       key: 'assetId',      type: 'text'  },
            { label: 'Employee',       key: 'employee',     type: 'text'  },
            { label: 'Department',     key: 'department',   type: 'text'  },
            { label: 'Assigned Date',  key: 'assignedDate', type: 'date'  },
            { label: 'Return Date',    key: 'returnDate',   type: 'date'  },
          ].map(({ label, key, type }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>
              <input className="ap-modal-input" type={type}
                value={form[key] || ''} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
          {[
            { label: 'Category', key: 'category', opts: ['Laptop','Phone','Monitor','Printer','Desktop','Server'] },
            { label: 'Status',   key: 'status',   opts: ['Assigned','Returned'] },
          ].map(({ label, key, opts }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>
              <select className="ap-modal-input" value={form[key]}
                onChange={e => set(key, e.target.value)}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ap-save-btn" onClick={() => onSave(form)}>
            {isEdit ? 'Save Changes' : 'Assign Asset'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── View Modal ── */
const ViewModal = ({ assignment, onClose }) => (
  <div className="ap-modal-overlay" onClick={onClose}>
    <div className="ap-modal" onClick={e => e.stopPropagation()}>
      <h2 className="ap-modal-title">Assignment Details</h2>
      <div className="asgn-view-grid">
        {[
          ['Asset',        `${assignment.assetName} (${assignment.assetId})`],
          ['Category',     assignment.category],
          ['Employee',     assignment.employee],
          ['Department',   assignment.department],
          ['Assigned Date',assignment.assignedDate],
          ['Return Date',  assignment.returnDate || '—'],
          ['Status',       assignment.status],
        ].map(([label, val]) => (
          <div key={label} className="asgn-view-row">
            <span className="asgn-view-label">{label}</span>
            <span className="asgn-view-value">{val}</span>
          </div>
        ))}
      </div>
      <div className="ap-modal-actions">
        <button className="ap-save-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

/* ── Main ── */
const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [search,      setSearch]      = useState('');
  const [employee,    setEmployee]    = useState('All Employees');
  const [status,      setStatus]      = useState('All Status');
  const [modal,       setModal]       = useState(null); // null | 'add' | { type:'view'|'edit', data }

  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch  = a.assetName.toLowerCase().includes(q) ||
                         a.assetId.toLowerCase().includes(q)   ||
                         a.employee.toLowerCase().includes(q);
    const matchEmp     = employee === 'All Employees' || a.employee === employee;
    const matchStatus  = status   === 'All Status'    || a.status   === status;
    return matchSearch && matchEmp && matchStatus;
  });

  const handleSave = (form) => {
    if (form.id) {
      setAssignments(prev => prev.map(a => a.id === form.id ? form : a));
    } else {
      setAssignments(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const handleReturn = (id) => {
    const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
      .replace(/ /g, ' ');
    setAssignments(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'Returned', returnDate: today } : a
    ));
  };

  return (
    <div className="ap-page">

      {/* Header */}
      <div className="ap-header-card">
        <h1 className="ap-page-title">Assignments</h1>
        <button className="ap-add-btn" onClick={() => setModal({ type: 'add' })}>
          <Plus size={17} strokeWidth={2.5} />
          Assign Asset
        </button>
      </div>

      {/* Filters */}
      <div className="ap-filter-card">
        <div className="ap-search-wrap">
          <Search size={16} className="ap-search-icon" />
          <input className="ap-search-input" placeholder="Search assignments..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ap-select-wrap">
          <select className="ap-select" value={employee} onChange={e => setEmployee(e.target.value)}>
            {EMPLOYEES.map(emp => <option key={emp}>{emp}</option>)}
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

      {/* Table */}
      <div className="ap-table-card ap-table-wrapper">
        <table className="ap-table asgn-table">
          <thead>
            <tr>
              {['Asset Name','Asset ID','Employee','Department','Assigned Date','Return Date','Status','Actions'].map(h => (
                <th key={h} className="ap-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="ap-empty">No assignments found.</td></tr>
            ) : filtered.map((a, i) => (
              <tr key={a.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                {/* Asset Name with icon */}
                <td className="ap-td">
                  <div className="asgn-asset-name-wrap">
                    <CategoryIcon category={a.category} />
                    <span className="ap-td-name">{a.assetName}</span>
                  </div>
                </td>

                <td className="ap-td asgn-id-cell">{a.assetId}</td>
                <td className="ap-td">{a.employee}</td>
                <td className="ap-td">{a.department}</td>
                <td className="ap-td">{a.assignedDate}</td>

                {/* Return date — shows arrow + date if returned */}
                <td className="ap-td">
                  {a.returnDate ? (
                    <div className="asgn-return-date">
                      <span className="asgn-return-arrow">→ {a.returnDate}</span>
                    </div>
                  ) : <span className="asgn-no-return">—</span>}
                </td>

                {/* Status badge */}
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyle[a.status] || {}}>
                    {a.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="ap-td ap-td-actions">
                  <button className="ap-action-btn ap-edit-btn"
                    onClick={() => setModal({ type: 'view', data: a })}>
                    <Eye size={13} />
                    View
                  </button>
                  {a.status === 'Assigned' && (
                    <button className="ap-action-btn asgn-return-btn"
                      onClick={() => handleReturn(a.id)}>
                      <RotateCcw size={13} />
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal?.type === 'add'  && (
        <AssignModal assignment={null} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === 'edit' && (
        <AssignModal assignment={modal.data} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {modal?.type === 'view' && (
        <ViewModal assignment={modal.data} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default AssignmentsPage;