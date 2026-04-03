import React, { useState } from 'react';
import {
  Search, ChevronDown, Plus, Eye, AlignJustify,
  Monitor, Smartphone, Printer, Laptop, Server
} from 'lucide-react';

/* ── Category icon ── */
const CategoryIcon = ({ category }) => {
  const props = { size: 16, strokeWidth: 1.8 };
  const map = {
    Laptop:  <Laptop    {...props} />,
    Phone:   <Smartphone {...props} />,
    Monitor: <Monitor   {...props} />,
    Printer: <Printer   {...props} />,
    Desktop: <Monitor   {...props} />,
    Server:  <Server    {...props} />,
  };
  return <span className="asgn-asset-icon">{map[category] || <Monitor {...props} />}</span>;
};

/* ── Badge styles ── */
const priorityStyle = {
  High:     { color: '#fff',                background: 'hsl(0,75%,55%)',    border: 'none' },
  Critical: { color: '#fff',                background: 'hsl(14,90%,53%)',   border: 'none' },
  Medium:   { color: 'hsl(38,85%,32%)',     background: 'hsl(38,95%,82%)',   border: 'none' },
  Low:      { color: '#fff',                background: 'hsl(215,16%,55%)',  border: 'none' },
  Approved: { color: 'hsl(214,80%,40%)',    background: 'hsl(214,80%,92%)',  border: 'none' },
};

const statusStyle = {
  Requested: { color: 'hsl(214,80%,46%)', background: 'hsl(214,80%,94%)', border: '1.5px solid hsl(214,70%,80%)' },
  'In Progress': { color: 'hsl(38,90%,35%)',  background: 'hsl(38,90%,93%)',  border: '1.5px solid hsl(38,80%,78%)' },
  Completed:   { color: 'hsl(145,60%,35%)', background: 'hsl(145,55%,93%)', border: '1.5px solid hsl(145,55%,80%)' },
  Approved:    { color: 'hsl(271,60%,45%)', background: 'hsl(271,60%,94%)', border: '1.5px solid hsl(271,55%,80%)' },
};

/* ── Seed data ── */
const initialRecords = [
  { id:1, category:'Laptop',  assetName:'Dell XPS',      assetId:'AST001', issue:'Screen flickering frequently', priority:'High',     requestedBy:'Sarah Johnson', assignedTo:'Dell Service Center', cost:2500, status:'In Progress' },
  { id:2, category:'Printer', assetName:'Epson Printer', assetId:'AST004', issue:'Paper jam issues',             priority:'Low',      requestedBy:'John Admin',    assignedTo:'Office Tech',          cost:500,  status:'Completed'   },
  { id:3, category:'Phone',   assetName:'iPhone 12',     assetId:'AST002', issue:'Battery draining quickly',     priority:'High',     requestedBy:'David Smith',   assignedTo:'—',                    cost:null, status:'Requested'   },
  { id:4, category:'Monitor', assetName:'Acer Monitor',  assetId:'AST006', issue:'Display is blurry',            priority:'Medium',   requestedBy:'Lisa Brown',    assignedTo:'Bright Vision',        cost:300,  status:'Completed'   },
  { id:5, category:'Laptop',  assetName:'HP EliteBook',  assetId:'AST007', issue:'Overheating, shuts down',      priority:'Critical', requestedBy:'Emma Davis',    assignedTo:'FreshService',         cost:1800, status:'In Progress' },
  { id:6, category:'Laptop',  assetName:'HP Primier',    assetId:'AST002', issue:'Report issues',                priority:'Critical', requestedBy:'Emma Davis',    assignedTo:'FreshService',         cost:1800, status:'In Progress' },
  { id:7, category:'Monitor', assetName:'HP EliteBook',  assetId:'AST007', issue:'Overheating, shuts down',      priority:'Approved', requestedBy:'Emma Davis',    assignedTo:'—',                    cost:1800, status:'Approved'    },
];

const STATUSES   = ['All Status',   'Requested', 'In Progress', 'Completed', 'Approved'];
const PRIORITIES = ['All Priority', 'High', 'Critical', 'Medium', 'Low', 'Approved'];
const CATEGORIES = ['All Categories', 'Laptop', 'Phone', 'Monitor', 'Printer', 'Desktop', 'Server'];

/* ── Schedule / Edit Modal ── */
const MaintenanceModal = ({ record, onClose, onSave }) => {
  const isEdit = !!record?.id;
  const [form, setForm] = useState(record || {
    category:'Laptop', assetName:'', assetId:'', issue:'',
    priority:'Medium', requestedBy:'', assignedTo:'', cost:'', status:'Requested',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Maintenance' : 'Schedule Maintenance'}</h2>
        <div className="ap-modal-fields">
          {[
            { label:'Asset Name',   key:'assetName',   type:'text' },
            { label:'Asset ID',     key:'assetId',     type:'text' },
            { label:'Issue',        key:'issue',       type:'text' },
            { label:'Requested By', key:'requestedBy', type:'text' },
            { label:'Assigned To',  key:'assignedTo',  type:'text' },
            { label:'Cost (₹)',     key:'cost',        type:'number' },
          ].map(({ label, key, type }) => (
            <div key={key} className="ap-modal-field">
              <label className="ap-modal-label">{label}</label>
              <input className="ap-modal-input" type={type}
                value={form[key] || ''} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
          {[
            { label:'Category', key:'category', opts:['Laptop','Phone','Monitor','Printer','Desktop','Server'] },
            { label:'Priority', key:'priority', opts:['High','Critical','Medium','Low','Approved'] },
            { label:'Status',   key:'status',   opts:['Requested','In Progress','Completed','Approved'] },
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
          ['Category',      record.category],
          ['Issue',         record.issue],
          ['Priority',      record.priority],
          ['Requested By',  record.requestedBy],
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

/* ── Main ── */
const MaintenancePage = () => {
  const [records,  setRecords]  = useState(initialRecords);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('All Status');
  const [priority, setPriority] = useState('All Priority');
  const [category, setCategory] = useState('All Categories');
  const [modal,    setModal]    = useState(null);

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch   = r.assetName.toLowerCase().includes(q) ||
                          r.assetId.toLowerCase().includes(q)   ||
                          r.issue.toLowerCase().includes(q)     ||
                          r.requestedBy.toLowerCase().includes(q);
    const matchStatus   = status   === 'All Status'     || r.status   === status;
    const matchPriority = priority === 'All Priority'   || r.priority === priority;
    const matchCategory = category === 'All Categories' || r.category === category;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const handleSave = (form) => {
    const parsed = { ...form, cost: form.cost ? Number(form.cost) : null };
    if (parsed.id) {
      setRecords(prev => prev.map(r => r.id === parsed.id ? parsed : r));
    } else {
      setRecords(prev => [...prev, { ...parsed, id: Date.now() }]);
    }
    setModal(null);
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
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {[
          { val: status,   set: setStatus,   opts: STATUSES,   placeholder: 'All Status'   },
          { val: priority, set: setPriority, opts: PRIORITIES, placeholder: 'All Priority' },
          { val: category, set: setCategory, opts: CATEGORIES, placeholder: 'All Categories' },
        ].map(({ val, set, opts }) => (
          <div key={opts[0]} className="ap-select-wrap">
            <select className="ap-select" value={val} onChange={e => set(e.target.value)}>
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
            ) : filtered.map((r, i) => (
              <tr key={r.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                {/* Asset Name + icon */}
                <td className="ap-td">
                  <div className="asgn-asset-name-wrap">
                    <CategoryIcon category={r.category} />
                    <span className="ap-td-name">{r.assetName}</span>
                  </div>
                </td>

                <td className="ap-td asgn-id-cell">{r.assetId}</td>

                {/* Issue — wraps */}
                <td className="ap-td mnt-issue-cell">{r.issue}</td>

                {/* Priority badge */}
                <td className="ap-td">
                  <span className="ap-status-badge mnt-priority-badge"
                    style={priorityStyle[r.priority] || {}}>
                    {r.priority}
                  </span>
                </td>

                <td className="ap-td">{r.requestedBy}</td>
                <td className="ap-td mnt-assigned-cell">{r.assignedTo || '—'}</td>

                {/* Cost */}
                <td className="ap-td mnt-cost-cell">
                  {r.cost ? `₹ ${r.cost.toLocaleString()}` : '—'}
                </td>

                {/* Status badge */}
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyle[r.status] || {}}>
                    {r.status}
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
                    <AlignJustify size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {modal?.type === 'add'  && <MaintenanceModal record={null}       onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === 'edit' && <MaintenanceModal record={modal.data} onClose={() => setModal(null)} onSave={handleSave} />}
      {modal?.type === 'view' && <ViewModal        record={modal.data} onClose={() => setModal(null)} />}
    </div>
  );
};

export default MaintenancePage;