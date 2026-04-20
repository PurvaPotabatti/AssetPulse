import React, { useState, useEffect } from 'react';
import API from "../../api/axiosConfig";
import { Search, ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react';
import {
  statusStyles,
  statusLabels
} from "../../utils/statusUtils";

const STATUSES = [
  'All Status',
  'AVAILABLE',
  'ASSIGNED',
  'IN_MAINTENANCE'
];



/* ── Modal ── */
const AssetModal = ({ asset, onClose, onSave }) => {

  const [errors, setErrors] = useState({});
  const isEdit = !!asset?.id;
  const [form, setForm] = useState(
    asset || { name: '', category: '', location: '', status: 'AVAILABLE', purchaseDate: '' }
  );


  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {

    let newErrors = {};

    if (!form.name.trim())
      newErrors.name = "Asset name required";

    if (!form.category.trim())
      newErrors.category = "Category required";

    if (!form.purchaseDate)
      newErrors.purchaseDate = "Purchase date required";

    else {

      const today = new Date();
      const selected = new Date(form.purchaseDate);

      if (selected > today)
        newErrors.purchaseDate = "Cannot be future date";

    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">{isEdit ? 'Edit Asset' : 'Add New Asset'}</h2>

        <div className="ap-modal-fields">

          <div className="ap-modal-field">
            <label className="ap-modal-label">
              Asset Name
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
              Location
            </label>
            <input
              className="ap-modal-input"
              type="text"
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
          </div>

          <div className="ap-modal-field">
            <label className="ap-modal-label">
              Purchase Date
            </label>
            <input
              className="ap-modal-input"
              type="date"
              value={form.purchaseDate}
              onChange={e => set('purchaseDate', e.target.value)}
            />
            {errors.purchaseDate && (
              <span className="ap-error-text">
                {errors.purchaseDate}
              </span>
            )}
          </div>

          <div className="ap-modal-field">
            <label className="ap-modal-label">
              Category
            </label>
            <input
              className="ap-modal-input"
              value={form.category}
              onChange={e => set('category', e.target.value)}
              placeholder="Eg: Laptop, Tablet, Camera"
            />
            {errors.category && (
              <span className="ap-error-text">
                {errors.category}
              </span>
            )}
          </div>

            <div className="ap-modal-field">
              <label className="ap-modal-label">Status</label>
              <select
                className="ap-modal-input"
                value={form.status}
                onChange={e => set('status', e.target.value)}
              >
                <option>Available</option>
                <option>Assigned</option>
                <option>Maintenance</option>
              </select>
            </div>
          </div>

        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ap-save-btn" onClick={() => {
            if(!validate()) return;
            onSave(form);
          }}>
            {isEdit ? 'Save Changes' : 'Add Asset'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main ── */
const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All Categories');
  const [status, setStatus]         = useState('All Status');
  const [modal, setModal]           = useState(null); // null | 'add' | asset-object
  
  const categories = [
    "All Categories",
    ...new Set(assets.map(a => a.category).filter(Boolean))
  ];

    useEffect(() => {

    fetchAssets();

  }, []);


const fetchAssets = async () => {

  try {

    const response = await API.get("/assets");

    setAssets(response.data);

  }
  catch (error) {

    console.error("Error fetching assets", error);

  }

};

  const filtered = assets.filter(a => {

    const assetStatusUI =
      a.status?.charAt(0) + a.status?.slice(1).toLowerCase();

    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.assetId.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      category === 'All Categories' ||
      a.category === category;

    const matchStatus =
      status === 'All Status' ||
      assetStatusUI === status;

    return matchSearch && matchCategory && matchStatus;

  });

  const handleSave = async (form) => {

    try {

      if (form.id) {

        const res = await API.put(`/assets/${form.id}`, form);

        setAssets(prev =>
          prev.map(a => a.id === form.id ? res.data : a)
        );

      } else {

        const res = await API.post("/assets", form);

        setAssets(prev => [...prev, res.data]);

      }

      setModal(null);

    } catch (err) {

      console.error("Error saving asset", err);

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this asset?")) return;

    try {

      await API.delete(`/assets/${id}`);

      setAssets(prev => prev.filter(a => a.id !== id));

    } catch (err) {

      console.error("Error deleting asset", err);

    }

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
            {categories.map(c => <option key={c}>{c}</option>)}
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
                <td className="ap-td">{a.category || "-"}</td>
                <td className="ap-td">{a.assetId}</td>
                <td className="ap-td">{a.location?.trim() ? a.location : "-"}</td>
                <td className="ap-td">
                  <span className="ap-status-badge" style={statusStyles[a.status] || {}}>
                    {statusLabels[a.status]}
                  </span>
                </td>
                <td className="ap-td"> {a.purchaseDate
                  ? new Date(a.purchaseDate).toLocaleDateString()
                  : "-"}</td>
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