import React, { useEffect, useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Laptop, Smartphone, Printer, Monitor, Server, ArrowUp
} from 'lucide-react';
import API from "../../api/axiosConfig";
import {
  statusStyles,
  statusLabels
} from "../../utils/statusUtils";


const STATUSES = [
  "All Status",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED"
];
const PAGE_SIZE = 2;


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
          ['Status', statusLabels[req.status]],
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
  const [requests, setRequests] = useState([]);


  useEffect(() => {
    fetchRequests();
  }, []);  

  const fetchRequests = async () => {

    try {

      const res = await API.get("/maintenance/my");

      const mapped = res.data.map(r => ({

        id: r.id,

        assetName: r.assetName,

        assetId: r.assetId,

        issue: r.issueDescription,

        status: r.status,

        requestedDate: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : "—"

      }));

      setRequests(mapped);

    } catch(err) {

      console.error("error loading requests", err);

    }

  };  

  /* Filter */
  const filtered = requests.filter(r => {

    const q = search.toLowerCase();

    return (
      r.assetName.toLowerCase().includes(q) ||
      r.assetId.toLowerCase().includes(q) ||
      r.issue.toLowerCase().includes(q)
    )

    && (status === 'All Status' || r.status === status);

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
                <th className="ap-th">Asset</th>
                <th className="ap-th">Issue</th>
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
                      <div className="ma-asset-text">
                        <span className="ma-asset-name">{r.assetName}</span>
                        <span className="ma-asset-sub-id">{r.assetId}</span>
                      </div>
                    </div>
                  </td>

                  {/* Issue */}
                  <td className="ap-td mrp-issue-cell">{r.issue}</td>

                  {/* Status badge (pill) */}
                  <td className="ap-td">
                    <span className="ap-status-badge mrp-status-badge"
                      style={statusStyles[r.status] || {}}>
                      {statusLabels[r.status]}
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
      {requests.length === 0 && (
      <div className="mrp-empty-card">
        <p className="mrp-empty-title">No maintenance requests yet</p>
        <p className="mrp-empty-sub">Report an issue from My Assets page</p>
      </div>)}

      {/* ── Modal ── */}
      {modal && <ViewModal req={modal} onClose={() => setModal(null)} />}
    </div>
  );
};

export default MyRequestPage;