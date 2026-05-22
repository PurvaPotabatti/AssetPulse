import React, { useEffect, useState } from 'react';
import {
  Search, ChevronDown, Plus, Eye, AlignJustify,
  Monitor, Smartphone, Printer, Laptop, Server, Pencil
} from 'lucide-react';
import axios from "axios";
import { statusStyles, statusLabels } from "../../utils/statusUtils";
import API from "../../api/axiosConfig";
import { priorityStyles } from "../../utils/priorityUtils";
import {
  successToast,
  errorToast
} from "../../utils/toastUtils";

const statusStyle = {
  Requested: { color: 'hsl(214,80%,46%)', background: 'hsl(214,80%,94%)', border: '1.5px solid hsl(214,70%,80%)' },
  'In Progress': { color: 'hsl(38,90%,35%)',  background: 'hsl(38,90%,93%)',  border: '1.5px solid hsl(38,80%,78%)' },
  Completed:   { color: 'hsl(145,60%,35%)', background: 'hsl(145,55%,93%)', border: '1.5px solid hsl(145,55%,80%)' },
  Approved:    { color: 'hsl(271,60%,45%)', background: 'hsl(271,60%,94%)', border: '1.5px solid hsl(271,55%,80%)' },
};


const STATUSES = [
  "All Status",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED"
];

/* ── Schedule / Edit Modal ── */
const MaintenanceModal = ({ record, assets, onClose, onSave }) => {
  const isEdit = !!record?.id;
  const [form, setForm] = useState(record || {

    assetMongoId:'',
    assetName:'',
    assetId:'',

    issueDescription:'',

    employeeName: localStorage.getItem("name") || "ADMIN",

    assignedTo:'',
    cost:null,

    priority:'NOT_ASSIGNED',
    status:'OPEN'

  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const statusOptions = !form.assignedTo

  ? ["OPEN"]

  : ["IN_PROGRESS","RESOLVED","REJECTED"];

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Maintenance' : 'Schedule Maintenance'}</h2>
        <div className="ap-modal-fields">
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Asset
            </label>

            {isEdit ? (

              <input
                className="ap-modal-input ap-readonly"
                value={`${form.assetName} (${form.assetId})`}
                readOnly
              />

            ) : (

              <select
                className="ap-modal-input"
                value={form.assetMongoId || ""}
                onChange={(e) => {

                  const selected = assets.find(
                    a => a.id === e.target.value
                  );

                  setForm(f => ({
                    ...f,

                    assetMongoId: selected.id,

                    assetName: selected.name,

                    assetId: selected.assetId

                  }));

                }}
              >

                <option value="">
                  Select Asset
                </option>

                {assets.map(a => (

                  <option key={a.id} value={a.id}>

                    {a.name} ({a.assetId})

                  </option>

                ))}

              </select>

            )}

          </div> 
          <div className="ap-modal-field">

            <label className="ap-modal-label">
              Asset ID
            </label>

            <input
              className="ap-modal-input ap-readonly"
              value={form.assetId || ""}
              readOnly
            />

          </div>                  
          {[
            { label:'Issue',        key:'issueDescription', type:'text', readOnly:isEdit },
            { label:'Requested By', key:'employeeName', type:'text', readOnly:true },

            { label:'Assigned To',  key:'assignedTo',  type:'text' },
            { label:'Cost (₹)',     key:'cost',        type:'number' },
          ].map(({ label, key, type, readOnly }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>

              <input
                className={`ap-modal-input ${readOnly ? "ap-readonly" : ""}`}
                type={type || "text"}
                value={form[key] || ""}
                readOnly={readOnly}
                onChange={e => {
                if(readOnly) return;

                const value = e.target.value;

                set(key, value);

                if(key === "assignedTo"){

                  if(value && form.status === "OPEN"){

                    set("status","IN_PROGRESS");

                  }

                  if(!value){

                    set("status","OPEN");

                  }

                }

              }}
              />

            </div>
          ))}
          {[
              {
                label:'Priority',
                key:'priority',
                opts:['NOT_ASSIGNED','LOW','MEDIUM','HIGH','CRITICAL']
              },

              {
                label:'Status',
                key:'status',
                opts:statusOptions
              },
            ].map(({ label, key, opts }) => (

              <div key={key} className="ap-modal-field">

                <label className="ap-modal-label">{label}</label>

                <select
                  className="ap-modal-input"
                  disabled={key === "status" && !form.assignedTo}
                  value={form[key] || opts[0]}
                  onChange={e => set(key, e.target.value)}
                >

                  {opts.map(o => (
                    <option key={o} value={o}>
                      {o.replace("_"," ")}
                    </option>
                  ))}

                </select>

              </div>

            ))}
        </div>
        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ap-save-btn" onClick={() => onSave(form)}>
            {isEdit ? 'Save Changes' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── View Modal ── */
const ViewModal = ({ record, onClose }) => (
  <div className="ap-modal-overlay" onClick={onClose}>
    <div className="ap-modal" onClick={e => e.stopPropagation()}>
      <h2 className="ap-modal-title">Maintenance Details</h2>
      <div className="asgn-view-grid">
        {[
          ['Asset',        `${record.assetName} (${record.assetId})`],
          ['Issue',         record.issueDescription],
          ['Priority',      record.priority],
          ['Requested By',  record.employeeName],
          ['Assigned To',   record.assignedTo || '—'],
          ['Cost',          record.cost ? `₹ ${record.cost.toLocaleString()}` : '—'],
          ['Status',        record.status],
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

const PAGE_SIZE = 5;

const PRIORITIES = [
  "All Priority",
  "NOT_ASSIGNED",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL"
];


/* ── Main ── */
const MaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('All Status');
  const [priority, setPriority] = useState('All Priority');
  const [modal,    setModal]    = useState(null);
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {

    const fetchData = async () => {

      try {

        /*
          fetch maintenance records
        */
        const maintenanceRes = await API.get("/maintenance");

        setRecords(maintenanceRes.data);

        /*
          fetch assets
        */
        const assetsRes = await API.get("/assets");

        setAssets(assetsRes.data);

      }
      catch(err){

        console.error(err);
        errorToast("Failed to load maintenance records");

      }

    };

    fetchData();

  }, []); 

  const sortedRecords = [...records].reverse();

  const filtered = sortedRecords.filter(r => {

    const q = search.toLowerCase();

    const matchSearch =
        r.assetName.toLowerCase().includes(q) ||
        r.assetId.toLowerCase().includes(q) ||
        r.issueDescription.toLowerCase().includes(q) ||
        r.employeeName.toLowerCase().includes(q);

    const matchStatus =
        status === "All Status" ||
        r.status === status;

    const matchPriority =
        priority === "All Priority" ||
        r.priority === priority;

    return matchSearch && matchStatus && matchPriority;

  });

  /* Pagination */
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

const activeMaintenanceAssetIds = records
  .filter(r =>
    r.status === "OPEN" ||
    r.status === "IN_PROGRESS"
  )
  .map(r => r.assetId);


  const availableAssetsForMaintenance = assets.filter(a => {

    /*
      exclude assets already under maintenance
    */

    if(activeMaintenanceAssetIds.includes(a.assetId))
      return false;

    /*
      exclude lifecycle statuses
    */

    if(
      a.status === "IN_MAINTENANCE" ||
      a.status === "RETIRED" ||
      a.status === "LOST"
    )
      return false;

    return true;

  });  

  const handleSave = async (form) => {

    try {

      const payload = {

        id: form.id || null,

        assetMongoId: form.assetMongoId || null,
        assignmentId: form.assignmentId || null,

        employeeMongoId: form.employeeMongoId || null,
        employeeName: form.employeeName,

        assetName: form.assetName,
        assetId: form.assetId,

        issueDescription: form.issueDescription,

        assignedTo: form.assignedTo || null,

        cost: form.cost ? Number(form.cost) : null,

        priority: form.priority || null,

        status: form.status || "OPEN"

      };

      await API.post("/maintenance/schedule", payload);
      successToast(
        form.id
          ? "Maintenance updated successfully"
          : "Maintenance scheduled successfully"
      );

      setModal(null);

      const maintenanceRes = await API.get("/maintenance");

      setRecords(maintenanceRes.data);

      const assetsRes = await API.get("/assets");

      setAssets(assetsRes.data);

    }
    catch(err){

      console.error("error saving maintenance", err);

      errorToast(
        err.response?.data?.message ||
        "Failed to save maintenance record"
      );

    }

  };

  return (
    <div className="ap-page">

      {/* Header */}
      <div className="ap-header-card">
        <h1 className="ap-page-title">Maintenance</h1>
        <button className="ap-add-btn" onClick={() => setModal({ type:'add' })}>
          <Plus size={17} strokeWidth={2.5} />
          Schedule Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="ap-filter-card">
        <div className="ap-search-wrap">
          <Search size={16} className="ap-search-icon" />
          <input className="ap-search-input" placeholder="Search maintenance..."
            value={search} onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }} />
        </div>
        {[
          { val: status,   set: setStatus,   opts: STATUSES,   placeholder: 'All Status'   },
          { val: priority, set: setPriority, opts: PRIORITIES, placeholder: 'All Priority' },
        ].map(({ val, set, opts }) => (
          <div key={opts[0]} className="ap-select-wrap">
            <select className="ap-select" value={val} onChange={e => {
              set(e.target.value);
              setPage(1);
            }}>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={15} className="ap-select-icon" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="ap-table-card ap-table-wrapper">
        <table className="ap-table mnt-table">
          <thead>
            <tr>
              {['Asset Name','Asset ID','Issue','Priority','Requested By','Assigned To','Cost','Status','Actions'].map(h => (
                <th key={h} className="ap-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="ap-empty">No maintenance records found.</td></tr>
            ) : paginated.map((r, i) => (
              <tr key={r.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                {/* Asset Name + icon */}
                <td className="ap-td">{r.assetName}</td>

                <td className="ap-td asgn-id-cell">{r.assetId}</td>

                {/* Issue — wraps */}
                <td className="ap-td mnt-issue-cell">{r.issueDescription}</td>

                {/* Priority badge */}
                <td className="ap-td">
                  <span className="ap-status-badge mnt-priority-badge"
                    style={priorityStyles[r.priority] || {}}>
                    {r.priority || "NOT_ASSIGNED"}
                  </span>
                </td>

                <td className="ap-td">{r.employeeName}</td>
                <td className="ap-td mnt-assigned-cell">{r.assignedTo || '—'}</td>

                {/* Cost */}
                <td className="ap-td mnt-cost-cell">
                  {r.cost ? `₹ ${r.cost.toLocaleString()}` : '—'}
                </td>

                {/* Status badge */}
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyles[r.status] || {}}>
                    {statusLabels[r.status]}
                  </span>
                </td>

                {/* Actions */}
                <td className="ap-td ap-td-actions">
                  <button className="ap-action-btn ap-edit-btn"
                    onClick={() => setModal({ type:'view', data:r })}>
                    <Eye size={13} />
                    View
                  </button>
                  <button className="ap-action-btn mnt-edit-action-btn"
                    onClick={() => setModal({ type:'edit', data:r })}>
                    <Pencil size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="ma-pagination">

        {/* Left */}
        <div className="ma-pag-left">

          <button
            className="ma-pag-arrow"
            disabled={safePage === 1}
            onClick={() =>
              setPage(p => Math.max(1, p - 1))
            }
          >
            ←
          </button>

          <span className="ma-pag-dot">•</span>

          <span className="ma-pag-total">
            {filtered.length}
          </span>

          <button
            className="ma-pag-arrow"
            disabled={safePage === totalPages}
            onClick={() =>
              setPage(p => Math.min(totalPages, p + 1))
            }
          >
            →
          </button>

        </div>

        {/* Right */}
        <div className="ma-pag-right">

          <span className="ma-pag-info">
            {safePage} of {totalPages}
          </span>

        </div>

      </div>

      {/* Modals */}
      {modal?.type === 'add'  &&
        <MaintenanceModal
          record={null}
          assets={availableAssetsForMaintenance}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      }
      {modal?.type === 'edit' &&
        <MaintenanceModal
          record={modal.data}
          assets={availableAssetsForMaintenance}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      }
      {modal?.type === 'view' && <ViewModal        record={modal.data} onClose={() => setModal(null)} />}
    </div>
  );
};

export default MaintenancePage;