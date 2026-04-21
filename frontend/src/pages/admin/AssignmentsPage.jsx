import React, { useState } from 'react';
import {
  Search, ChevronDown, Plus, Eye, RotateCcw,
  Monitor, Smartphone, Printer, Laptop, Server
} from 'lucide-react';
import { useEffect } from 'react';
import API from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import {
  statusStyles,
  statusLabels
} from "../../utils/statusUtils";

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



const STATUSES = ['All Status', 'ASSIGNED', 'RETURNED'];


const conditionStyle = {

  GOOD: {
    color: "hsl(145,60%,35%)",
    background: "hsl(145,55%,93%)",
    border: "1px solid hsl(145,55%,80%)"
  },

  DAMAGED: {
    color: "hsl(25,85%,40%)",
    background: "hsl(25,90%,94%)",
    border: "1px solid hsl(25,85%,80%)"
  },

  NEEDS_REPAIR: {
    color: "hsl(0,75%,40%)",
    background: "hsl(0,85%,94%)",
    border: "1px solid hsl(0,70%,80%)"
  },

  LOST: {
    color: "hsl(0,85%,35%)",
    background: "hsl(0,95%,92%)",
    border: "1px solid hsl(0,80%,75%)"
  }

};


const formatStatus = (status) => {

  if(status === "ASSIGNED") return "Assigned";
  if(status === "RETURNED") return "Returned";

  return status;
}

/* ── Assign Modal ── */
const AssignModal = ({ assignment, assets, employees, onClose, onSave }) => {
  const isEdit = !!assignment?.id;
const today = new Date();

const defaultReturnDate = new Date();

defaultReturnDate.setDate(today.getDate() + 30);

const [form, setForm] = useState({

    assetId: '',

    employeeId: '',

    expectedReturnDate:
      defaultReturnDate.toISOString().split('T')[0],

    condition: 'GOOD',

    notes: ''

  });

  const [errors, setErrors] = useState({});

  const set = (k, v) => {

    setForm(f => ({
      ...f,
      [k]: v
    }));

    /*
      remove error when user updates field
    */

    setErrors(prev => ({
      ...prev,
      [k]: ""
    }));

  };


  const validate = () => {

    let newErrors = {};

    if (!form.assetId)
      newErrors.assetId = "Asset required";

    if (!form.employeeId)
      newErrors.employeeId = "Employee required";

    if (!form.expectedReturnDate)
      newErrors.expectedReturnDate = "Return date required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Assignment' : 'Assign Asset'}</h2>
        <div className="ap-modal-fields">

          {/* Asset dropdown */}
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Asset
            </label>

            <select
              className="ap-modal-input"
              value={form.assetId}
              onChange={e => set('assetId', e.target.value)}
            >
              <option value="">Select Asset</option>

              {assets.map(a => (

                <option key={a.id} value={a.id}>

                 {a.name} ({a.assetId})

                </option>

              ))}

            </select>
            {errors.assetId && (
              <span className="ap-error-text">
                {errors.assetId}
              </span>
            )}

          </div>


          {/* Employee dropdown */}
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Employee
            </label>

            <select
              className="ap-modal-input"
              value={form.employeeId}
              onChange={e => set('employeeId', e.target.value)}
            >
           

              <option value="">Select Employee</option>

              {employees.map(e => (

                <option key={e.id} value={e.id}>

                  {e.name} ({e.department})

                </option>

              ))}

            </select>
            {errors.employeeId && (
              <span className="ap-error-text">
                {errors.employeeId}
              </span>
            )} 
          </div>


          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Expected Return Date
            </label>

            <input
              type="date"
              className="ap-modal-input"
              value={form.expectedReturnDate}
              onChange={e => set('expectedReturnDate', e.target.value)}
            />
            {errors.expectedReturnDate && (
              <span className="ap-error-text">
                {errors.expectedReturnDate}
              </span>
            )}
          </div>


          {/* Condition */}
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Condition
            </label>

            <select
              className="ap-modal-input"
              value={form.condition}
              onChange={e => set('condition', e.target.value)}
            >

              <option>GOOD</option>
              <option>DAMAGED</option>
              <option>NEEDS_REPAIR</option>
              <option>LOST</option>

            </select>

          </div>


          {/* Notes */}
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Notes (optional)
            </label>

            <textarea
              className="ap-modal-input"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />

          </div>

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
  const [assignments, setAssignments] = useState([]);
  const [search,      setSearch]      = useState('');
  const [employee,    setEmployee]    = useState('All Employees');
  const [status,      setStatus]      = useState('All Status');
  const [modal,       setModal]       = useState(null); // null | 'add' | { type:'view'|'edit', data }
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { user } = useAuth();


  useEffect(() => {

    fetchAssignments();
    fetchAssets();
    fetchEmployees();

  }, []);

  const fetchAssignments = async () => {

    try {

      const response = await API.get("/assignments");

      /*
        convert backend format → UI format
      */

      const mapped = response.data.map(a => ({

        id: a.id,

        assetName: a.assetName,
        assetId: a.assetId || "—",

        employee: a.employeeName,
        department: a.department || "—",
        condition: a.condition || "—",

        assignedDate: a.assignedDate
          ? new Date(a.assignedDate).toLocaleDateString()
          : "—",

        expectedReturnDate: a.expectedReturnDate
        ? new Date(a.expectedReturnDate).toLocaleDateString()
        : "—",  

        returnDate: a.returnDate
          ? new Date(a.returnDate).toLocaleDateString()
          : "—",

        status: a.status, 

        category: "Laptop" // temporary placeholder
      }));

      setAssignments(mapped);

    }
    catch(err) {

      console.error("Error fetching assignments", err);

    }

  };

  const fetchAssets = async () => {

    try {

      const response = await API.get("/assets");

      /*
        only available assets
      */

      const availableAssets = response.data.filter(
        a => a.status?.toUpperCase() === "AVAILABLE"
      );

      setAssets(availableAssets);

    }
    catch(err) {

      console.error("Error fetching assets", err);

    }

  };  

  const fetchEmployees = async () => {

    try {

      const response = await API.get(`/users/${user.userId}`);

      const mapped = response.data.map(e => ({

        id: e.id,
        name: e.name,
        department: e.department || "—"

      }));

      setEmployees(mapped);

    }
    catch(err) {

      console.error("Error fetching employees", err);

    }

  };  

  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch  = a.assetName.toLowerCase().includes(q) ||
                         a.assetId.toLowerCase().includes(q)   ||
                         a.employee.toLowerCase().includes(q);
    const matchEmp     = employee === 'All Employees' || a.employee === employee;
    const matchStatus  = status   === 'All Status'    || a.status   === status;
    return matchSearch && matchEmp && matchStatus;
  });

  const handleSave = async (form) => {

    try {

      /*
        find selected asset
      */

      const selectedAsset = assets.find(
        a => a.id === form.assetId
      );

      /*
        find selected employee
      */

      const selectedEmployee = employees.find(
        e => e.id === form.employeeId
      );

      /*
        send to backend
      */

      await API.post("/assignments", {

        assetMongoId: selectedAsset.id,   // Mongo _id

        assetId: selectedAsset.assetId,   // readable ID

        assetName: selectedAsset.name,

        employeeId: selectedEmployee.id,

        employeeName: selectedEmployee.name,

        department: selectedEmployee.department,

        expectedReturnDate: form.expectedReturnDate,

        condition: form.condition,

        notes: form.notes

      });

      /*
        refresh table
      */

      fetchAssignments();

      /*
        refresh assets list
        because asset becomes ASSIGNED
      */

      fetchAssets();

      setModal(null);

    }
    catch(err) {

      console.error("Assignment failed", err);

    }

  };

  const handleReturn = async (id) => {

    try {

      await API.put(`/assignments/${id}/return`);

      fetchAssignments();

      fetchAssets(); // asset becomes available again

    }
    catch(err) {

      console.error("Return failed", err);

    }

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
            <option>All Employees</option>

            {employees.map(e => (

              <option key={e.id}>

                {e.name}

              </option>

            ))}
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
              {['Asset Name','Asset ID','Employee','Department','Condition','Assigned Date','Expected Return','Return Date','Status','Actions'].map(h => (
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
                <td className="ap-td ap-td-name">{a.assetName}</td>
                <td className="ap-td asgn-id-cell">{a.assetId}</td>
                <td className="ap-td">{a.employee}</td>
                <td className="ap-td">{a.department}</td>
                <td className="ap-td">
                  <span
                    className="ap-status-badge"
                    style={conditionStyle[a.condition] || {}}
                  >
                    {a.condition}
                  </span>
                </td>
                <td className="ap-td">{a.assignedDate}</td>
                <td className="ap-td">
                  {a.expectedReturnDate || "—"}
                </td>
                {/* Return date — shows arrow + date if returned */}
                <td className="ap-td">
                  {a.returnDate ? (
                    <div className="asgn-return-date">
                      <span className="asgn-return-arrow"> {a.returnDate}</span>
                    </div>
                  ) : <span className="asgn-no-return">—</span>}
                </td>

                {/* Status badge */}
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyles[a.status] || {}}>
                    {statusLabels[a.status]}
                  </span>
                </td>

                {/* Actions */}
                <td className="ap-td ap-td-actions">
                  <button className="ap-action-btn ap-edit-btn"
                    onClick={() => setModal({ type: 'view', data: a })}>
                    <Eye size={13} />
                    View
                  </button>
                  {a.status === 'ASSIGNED' && (
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
        <AssignModal
          assignment={null}
          assets={assets}
          employees={employees}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal?.type === 'edit' && (
        <AssignModal
          assignment={modal.data}
          assets={assets}
          employees={employees}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal?.type === 'view' && (
        <ViewModal assignment={modal.data} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default AssignmentsPage;