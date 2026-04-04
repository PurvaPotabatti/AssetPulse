import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Laptop, Smartphone, Printer, Monitor, Server, ArrowUp
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
const allRequests = [
  { id:1, category:'Laptop',  assetName:'Dell XPS 13',  assetId:'AST102', issue:'Screen flickering',         priority:'High',   statusBadge:'In Progress', statusText:'In Progress', requestedDate:'12 Apr 2024' },
  { id:2, category:'Phone',   assetName:'iPhone 12',    assetId:'AST210', issue:'Battery draining quickly',  priority:'Medium', statusBadge:'Requested',   statusText:'Requested',   requestedDate:'5 Apr 2024'  },
  { id:3, category:'Monitor', assetName:'Acer Monitor', assetId:'AST306', issue:'Display flickering',        priority:'Low',    statusBadge:'Completed',   statusText:'Completed',   requestedDate:'1 Apr 2024'  },
  { id:4, category:'Laptop',  assetName:'MacBook Pro',  assetId:'AST401', issue:'Overheating issues',        priority:'High',   statusBadge:'In Progress', statusText:'In Progress', requestedDate:'28 Mar 2024' },
  { id:5, category:'Printer', assetName:'HP LaserJet',  assetId:'AST512', issue:'Paper jam',                 priority:'Low',    statusBadge:'Completed',   statusText:'Completed',   requestedDate:'22 Mar 2024' },
];

const STATUSES = ['All Status', 'In Progress', 'Requested', 'Completed'];
const PAGE_SIZE = 2;

/* Priority text colour only (no background) */
const priorityColor = {
  High:     'hsl(0,72%,50%)',
  Medium:   'hsl(28,90%,48%)',
  Low:      'hsl(215,16%,52%)',
  Critical: 'hsl(14,90%,50%)',
};

/* Status badge full styles */
const statusBadgeStyle = {
  'In Progress': { color:'hsl(38,90%,30%)',  background:'hsl(38,95%,70%)',   border:'none' },
  Requested:     { color:'#fff',              background:'hsl(214,80%,51%)',  border:'none' },
  Completed:     { color:'hsl(145,60%,30%)',  background:'hsl(145,55%,88%)',  border:'none' },
};

/* Status text (plain) colour */
const statusTextColor = {
  'In Progress': 'hsl(38,80%,35%)',
  Requested:     'hsl(214,80%,44%)',
  Completed:     'hsl(145,55%,32%)',
};

/* ── View / Detail Modal ── */
const ViewModal = ({ req, onClose }) => (
  <div className="ap-modal-overlay" onClick={onClose}>
    <div className="ap-modal" onClick={e => e.stopPropagation()}>
      <h2 className="ap-modal-title">Request Details</h2>
      <div className="asgn-view-grid">
        {[
          ['Asset',          `${req.assetName} (${req.assetId})`],
          ['Category',        req.category],
          ['Issue',           req.issue],
          ['Priority',        req.priority],
          ['Status',          req.statusText],
          ['Requested Date',  req.requestedDate],
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
const MyRequestPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [page,   setPage]   = useState(1);
  const [modal,  setModal]  = useState(null);

  /* Filter */
  const filtered = allRequests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.assetName.toLowerCase().includes(q) ||
                        r.assetId.toLowerCase().includes(q)   ||
                        r.issue.toLowerCase().includes(q);
    const matchStatus = status === 'All Status' || r.statusBadge === status;
    return matchSearch && matchStatus;
  });

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="ma-page">

      {/* Subtitle */}
      <p className="ma-subtitle">Track maintenance requests submitted by you</p>

      {/* ── Main white container ── */}
      <div className="ma-container">

        {/* Filter row */}
        <div className="ma-filter-row">
          <div className="ap-search-wrap ma-search-wrap">
            <Search size={16} className="ap-search-icon" />
            <input className="ap-search-input" placeholder="Search requests..."
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

        {/* ── Table ── */}
        <div className="ma-table-wrap">
          <table className="ap-table mrp-table">
            <thead>
              <tr>
                <th className="ap-th">
                  <span className="ma-th-sort">Asset <ArrowUp size={12} /></span>
                </th>
                <th className="ap-th">Issue</th>
                <th className="ap-th">Priority</th>
                <th className="ap-th">Status</th>
                <th className="ap-th">Status</th>
                <th className="ap-th">Requested Date</th>
                <th className="ap-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="ap-empty">No requests found.</td></tr>
              ) : paginated.map((r, i) => (
                <tr key={r.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                  {/* Asset: icon + name + sub-id */}
                  <td className="ap-td">
                    <div className="ma-asset-cell">
                      <CategoryIcon category={r.category} />
                      <div className="ma-asset-text">
                        <span className="ma-asset-name">{r.assetName}</span>
                        <span className="ma-asset-sub-id">{r.assetId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Issue */}
                  <td className="ap-td mrp-issue-cell">{r.issue}</td>

                  {/* Priority — coloured text only */}
                  <td className="ap-td">
                    <span className="mrp-priority-text"
                      style={{ color: priorityColor[r.priority] || 'inherit' }}>
                      {r.priority}
                    </span>
                  </td>

                  {/* Status badge (pill) */}
                  <td className="ap-td">
                    <span className="ap-status-badge mrp-status-badge"
                      style={statusBadgeStyle[r.statusBadge] || {}}>
                      {r.statusBadge}
                    </span>
                  </td>

                  {/* Status text (plain) */}
                  <td className="ap-td">
                    <span className="mrp-status-text"
                      style={{ color: statusTextColor[r.statusText] || 'inherit' }}>
                      {r.statusText}
                    </span>
                  </td>

                  {/* Requested Date */}
                  <td className="ap-td mrp-date-cell">{r.requestedDate}</td>

                  {/* View button */}
                  <td className="ap-td">
                    <button className="mrp-view-btn"
                      onClick={() => setModal(r)}>
                      View <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="ma-pagination">
          {/* Left: page input + dot + total + arrows */}
          <div className="ma-pag-left">
            <button className="ma-pag-arrow" disabled={safePage === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </button>
            <input
              className="mrp-pag-input"
              type="number" min={1} max={totalPages}
              value={safePage}
              onChange={e => {
                const v = Number(e.target.value);
                if (v >= 1 && v <= totalPages) setPage(v);
              }}
            />
            <span className="ma-pag-dot">•</span>
            <span className="ma-pag-total">{filtered.length}</span>
            <button className="ma-pag-arrow" disabled={safePage === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Right: prev + info + dropdown + next */}
          <div className="ma-pag-right">
            <button className="ma-pag-arrow" disabled={safePage === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft size={15} />
            </button>
            <span className="ma-pag-info">{safePage} – of {totalPages}</span>
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

      {/* ── Empty state card ── */}
      <div className="mrp-empty-card">
        <p className="mrp-empty-title">No maintenance requests yet</p>
        <p className="mrp-empty-sub">Report an issue from My Assets page</p>
      </div>

      {/* ── Modal ── */}
      {modal && <ViewModal req={modal} onClose={() => setModal(null)} />}
    </div>
  );
};

export default MyRequestPage;