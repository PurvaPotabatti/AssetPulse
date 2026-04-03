import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';

const initialAssets = [
  {
    id: 1,
    name: 'Dell XPS 13',
    category: 'Laptop',
    assetId: 'AST001',
    location: 'IT Dept',
    status: 'Available',
    purchaseDate: '12 Feb 2024',
  },
  {
    id: 2,
    name: 'HP LaserJet',
    category: 'Printer',
    assetId: 'AST002',
    location: 'Admin Dept',
    status: 'Assigned',
    purchaseDate: '03 Jan 2024',
  },
  {
    id: 3,
    name: 'MacBook Pro',
    category: 'Laptop',
    assetId: 'AST003',
    location: 'HR Dept',
    status: 'Available',
    purchaseDate: '22 Mar 2024',
  },
  {
    id: 4,
    name: 'Cisco Switch',
    category: 'Networking',
    assetId: 'AST004',
    location: 'IT Dept',
    status: 'Maintenance',
    purchaseDate: '05 Nov 2023',
  },
];

const CATEGORIES = ['All Categories', 'Laptop', 'Printer', 'Networking', 'Monitor'];
const STATUSES = ['All Status', 'Available', 'Assigned', 'Maintenance'];

const statusStyle = {
  Available:   { color: 'hsl(145,60%,35%)',  background: 'hsl(145,55%,93%)', border: '1px solid hsl(145,55%,80%)' },
  Assigned:    { color: 'hsl(214,70%,45%)',  background: 'hsl(214,80%,94%)', border: '1px solid hsl(214,70%,82%)' },
  Maintenance: { color: 'hsl(38,90%,38%)',   background: 'hsl(38,90%,93%)',  border: '1px solid hsl(38,80%,78%)' },
};

/* ── Modal ── */
const AssetModal = ({ asset, onClose, onSave }) => {
  const isEdit = !!asset?.id;
  const [form, setForm] = useState(
    asset || { name: '', category: 'Laptop', assetId: '', location: '', status: 'Available', purchaseDate: '' }
  );

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Asset' : 'Add New Asset'}</h2>

        <div className="ap-modal-fields">
          {[
            { label: 'Asset Name',    key: 'name',         type: 'text' },
            { label: 'Asset ID',      key: 'assetId',      type: 'text' },
            { label: 'Location',      key: 'location',     type: 'text' },
            { label: 'Purchase Date', key: 'purchaseDate', type: 'date' },
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
            { label: 'Category', key: 'category', opts: ['Laptop','Printer','Networking','Monitor'] },
            { label: 'Status',   key: 'status',   opts: ['Available','Assigned','Maintenance'] },
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
            {isEdit ? 'Save Changes' : 'Add Asset'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
const AssetsPage = () => {
  const [assets, setAssets]         = useState(initialAssets);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All Categories');
  const [status, setStatus]         = useState('All Status');
  const [modal, setModal]           = useState(null); // null | 'add' | asset-object

  const filtered = assets.filter(a => {
    const matchSearch   = a.name.toLowerCase().includes(search.toLowerCase()) ||
                          a.assetId.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All Categories' || a.category === category;
    const matchStatus   = status   === 'All Status'     || a.status   === status;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleSave = (form) => {
    if (form.id) {
      setAssets(prev => prev.map(a => a.id === form.id ? form : a));
    } else {
      setAssets(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this asset?')) setAssets(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="ap-page">

      {/* ── Header card ── */}
      <div className="ap-header-card">
        <h1 className="ap-page-title">Assets</h1>
        <button className="ap-add-btn" onClick={() => setModal('add')}>
          <Plus size={17} strokeWidth={2.5} />
          Add Asset
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="ap-filter-card">
        <div className="ap-search-wrap">
          <Search size={16} className="ap-search-icon" />
          <input
            className="ap-search-input"
            placeholder="Search assets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="ap-select-wrap">
          <select className="ap-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
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
        <table className="ap-table assets-table">
          <thead>
            <tr>
              {['Asset Name','Category','Asset ID','Location','Status','Purchase Date','Actions'].map(h => (
                <th key={h} className="ap-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="ap-empty">No assets found.</td>
              </tr>
            ) : filtered.map((a, i) => (
              <tr key={a.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>
                <td className="ap-td ap-td-name">{a.name}</td>
                <td className="ap-td">{a.category}</td>
                <td className="ap-td">{a.assetId}</td>
                <td className="ap-td">{a.location}</td>
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyle[a.status] || {}}>
                    {a.status}
                  </span>
                </td>
                <td className="ap-td">{a.purchaseDate}</td>
                <td className="ap-td ap-td-actions">
                  <button className="ap-action-btn ap-edit-btn" onClick={() => setModal(a)}>
                    <Pencil size={13} />
                    Edit
                  </button>
                  <button className="ap-action-btn ap-delete-btn" onClick={() => handleDelete(a.id)}>
                    <Trash2 size={13} />
                    {/* Delete */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <AssetModal
          asset={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AssetsPage;