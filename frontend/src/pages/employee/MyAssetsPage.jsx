import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Layers, Wrench, Monitor, User,
  Laptop, Smartphone, Printer, Server,
  ArrowUp, AlertCircle
} from 'lucide-react';

/* ── Category icon chip ── */
const CategoryIcon = ({ category }) => {
  const p = { size: 16, strokeWidth: 1.8 };
  const map = {
    Laptop:  <Laptop     {...p} />,
    Phone:   <Smartphone {...p} />,
    Monitor: <Monitor    {...p} />,
    Printer: <Printer    {...p} />,
    Desktop: <Monitor    {...p} />,
    Server:  <Server     {...p} />,
  };
  return <span className="ma-asset-icon">{map[category] || <Monitor {...p} />}</span>;
};

/* ── Seed data ── */
const allAssets = [
  { id:1, category:'Laptop',  assetName:'Dell XPS 13',  assetId:'AST102', assignedDate:'12 Apr 2024', status:'Assigned'       },
  { id:2, category:'Phone',   assetName:'iPhone 12',    assetId:'AST210', assignedDate:'3 Mar 2024',  status:'In Maintenance' },
  { id:3, category:'Monitor', assetName:'LG UltraWide', assetId:'AST305', assignedDate:'8 Feb 2024',  status:'Assigned'       },
  { id:4, category:'Laptop',  assetName:'MacBook Pro',  assetId:'AST401', assignedDate:'1 Jan 2024',  status:'Assigned'       },
  { id:5, category:'Printer', assetName:'HP LaserJet',  assetId:'AST512', assignedDate:'20 Dec 2023', status:'In Maintenance' },
];

const STATUSES = ['All Status', 'Assigned', 'In Maintenance'];
const PAGE_SIZE = 2;

const statusStyle = {
  Assigned:        { color: '#fff',              background: 'hsl(214,80%,51%)',  border: 'none' },
  'In Maintenance':{ color: 'hsl(38,90%,28%)',   background: 'hsl(38,95%,68%)',   border: 'none' },
};

/* ── Report Issue Modal ── */
const ReportModal = ({ asset, onClose, onSubmit }) => {
  const [issue,    setIssue]    = useState('');
  const [priority, setPriority] = useState('Medium');
  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ap-modal-title">Report Issue</h2>
        <div className="ap-modal-fields">
          <div className="ap-modal-field">
            <label className="ap-modal-label">Asset</label>
            <input className="ap-modal-input" readOnly
              value={`${asset.assetName} (${asset.assetId})`} />
          </div>
          <div className="ap-modal-field">
            <label className="ap-modal-label">Issue Description</label>
            <textarea className="ap-modal-input ma-textarea" rows={3}
              placeholder="Describe the issue…"
              value={issue} onChange={e => setIssue(e.target.value)} />
          </div>
          <div className="ap-modal-field">
            <label className="ap-modal-label">Priority</label>
            <select className="ap-modal-input" value={priority}
              onChange={e => setPriority(e.target.value)}>
              {['Low','Medium','High','Critical'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="ap-modal-actions">
          <button className="ap-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="ap-save-btn"
            onClick={() => { onSubmit({ asset, issue, priority }); onClose(); }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Detail Modal ── */
const DetailModal = ({ asset, onClose }) => (
  <div className="ap-modal-overlay" onClick={onClose}>
    <div className="ap-modal" onClick={e => e.stopPropagation()}>
      <h2 className="ap-modal-title">Asset Details</h2>
      <div className="asgn-view-grid">
        {[
          ['Asset Name',    asset.assetName],
          ['Asset ID',      asset.assetId],
          ['Category',      asset.category],
          ['Assigned Date', asset.assignedDate],
          ['Status',        asset.status],
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
const MyAssetsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [page,   setPage]   = useState(1);
  const [modal,  setModal]  = useState(null);

  /* Stats */
  const total    = allAssets.length;
  const inMaint  = allAssets.filter(a => a.status === 'In Maintenance').length;
  const active   = allAssets.filter(a => a.status === 'Assigned').length;

  const statTiles = [
    { label:'Total Assets',   value: total,   icon:<Layers  size={22}/>, bg:'hsl(214,65%,93%)', iconBg:'hsl(214,60%,82%)', iconColor:'hsl(214,80%,46%)' },
    { label:'In Maintenance', value: inMaint, icon:<Wrench  size={22}/>, bg:'hsl(38,80%,93%)',  iconBg:'hsl(38,75%,82%)',  iconColor:'hsl(38,80%,42%)'  },
    { label:'Active Assets',  value: active,  icon:<Monitor size={22}/>, bg:'hsl(158,45%,92%)', iconBg:'hsl(158,45%,80%)', iconColor:'hsl(158,55%,35%)' },
    { label:'Profile',        value: 1,       icon:<User    size={22}/>, bg:'hsl(214,20%,94%)', iconBg:'hsl(214,18%,84%)', iconColor:'hsl(214,20%,48%)' },
  ];

  /* Filter */
  const filtered = allAssets.filter(a => {
    const q = search.toLowerCase();
    return (a.assetName.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q))
      && (status === 'All Status' || a.status === status);
  });

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="ma-page">

      {/* Subtitle */}
      <p className="ma-subtitle">View and manage assets assigned to you</p>

      {/* ── White container card ── */}
      <div className="ma-container">

        {/* Search + Status filter */}
        <div className="ma-filter-row">
          <div className="ap-search-wrap ma-search-wrap">
            <Search size={16} className="ap-search-icon" />
            <input className="ap-search-input" placeholder="Search assets..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="ap-select-wrap">
            <select className="ap-select ma-status-select" value={status}
              onChange={e => { setStatus(e.target.value); setPage(1); }}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={15} className="ap-select-icon" />
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div className="ma-stat-row">
          {statTiles.map((t, i) => (
            <div key={i} className="ma-stat-tile" style={{ background: t.bg }}>
              <div className="ma-stat-icon" style={{ background: t.iconBg, color: t.iconColor }}>
                {t.icon}
              </div>
              <div className="ma-stat-info">
                <span className="ma-stat-label">{t.label}</span>
                <span className="ma-stat-value">{t.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="ma-table-wrap">
          <table className="ap-table ma-table">
            <thead>
              <tr>
                <th className="ap-th">
                  <span className="ma-th-sort">Asset <ArrowUp size={12} /></span>
                </th>
                <th className="ap-th">Asset ID</th>
                <th className="ap-th">Category</th>
                <th className="ap-th">Assigned Date</th>
                <th className="ap-th">Status</th>
                <th className="ap-th">Action</th>
                <th className="ap-th"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="ap-empty">No assets found.</td></tr>
              ) : paginated.map((a, i) => (
                <tr key={a.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                  {/* Asset: icon + name + sub-id */}
                  <td className="ap-td">
                    <div className="ma-asset-cell">
                      <CategoryIcon category={a.category} />
                      <div className="ma-asset-text">
                        <span className="ma-asset-name">{a.assetName}</span>
                        <span className="ma-asset-sub-id">{a.assetId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="ap-td ma-id-cell">{a.assetId}</td>
                  <td className="ap-td">{a.category}</td>
                  <td className="ap-td ma-date-cell">{a.assignedDate}</td>

                  {/* Status badge */}
                  <td className="ap-td">
                    <span className="ap-status-badge ma-status-badge"
                      style={statusStyle[a.status] || {}}>
                      {a.status}
                    </span>
                  </td>

                  {/* Report Issue */}
                  <td className="ap-td">
                    <button className="ma-report-btn"
                      onClick={() => setModal({ type:'report', data: a })}>
                      <AlertCircle size={13} />
                      Report Issue
                    </button>
                  </td>

                  {/* Chevron */}
                  <td className="ap-td ma-chevron-cell">
                    <button className="ma-chevron-btn"
                      onClick={() => setModal({ type:'detail', data: a })}>
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="ma-pagination">
          {/* Left: arrows + total count */}
          <div className="ma-pag-left">
            <button className="ma-pag-arrow" disabled={safePage === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </button>
            <span className="ma-pag-dot">•</span>
            <span className="ma-pag-total">{filtered.length}</span>
            <button className="ma-pag-arrow" disabled={safePage === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Right: page selector */}
          <div className="ma-pag-right">
            <button className="ma-pag-arrow" disabled={safePage === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </button>
            <span className="ma-pag-info">{safePage}-of-{totalPages}</span>
            <div className="ap-select-wrap ma-pag-select-wrap">
              <select className="ap-select ma-pag-select"
                value={safePage}
                onChange={e => setPage(Number(e.target.value))}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
              <ChevronDown size={13} className="ap-select-icon" />
            </div>
            <button className="ma-pag-arrow" disabled={safePage === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

      </div>{/* /ma-container */}

      {/* ── Empty state ── */}
      <div className="ma-empty-state">
        <p className="ma-empty-line">No assets assigned yet</p>
        <p className="ma-empty-contact">Contact admin</p>
      </div>

      {/* ── Modals ── */}
      {modal?.type === 'report' && (
        <ReportModal asset={modal.data} onClose={() => setModal(null)}
          onSubmit={data => console.log('Issue reported:', data)} />
      )}
      {modal?.type === 'detail' && (
        <DetailModal asset={modal.data} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default MyAssetsPage;