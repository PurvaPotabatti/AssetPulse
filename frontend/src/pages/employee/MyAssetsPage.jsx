import React, { useEffect, useState } from 'react';
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Layers, Wrench, Monitor, User,
  Laptop, Smartphone, Printer, Server,
  ArrowUp, AlertCircle
} from 'lucide-react';
import API from "../../api/axiosConfig";
import {
  statusStyles,
  statusLabels
} from "../../utils/statusUtils";


const STATUSES = ['All Status', 'ASSIGNED', 'IN_MAINTENANCE'];
const PAGE_SIZE = 2;




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
  const [assets, setAssets] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [issueText, setIssueText] = useState("");
  const [reportedAssets, setReportedAssets] = useState([]);


    useEffect(() => {
    fetchMyAssets();
    fetchMyRequests();
  }, []);

  const fetchMyAssets = async () => {

    try {

      const response = await API.get("/employee/my-assets");

      const mapped = response.data.map(a => ({

        id: a.id,

        assetName: a.assetName,

        assetId: a.assetId,

        assignedDate: a.assignedDate
          ? new Date(a.assignedDate).toLocaleDateString()
          : "—",

        status: a.status

      }));

      setAssets(mapped);

    }
    catch(err) {

      console.error("Error loading assets", err);

    }

  };

  const fetchMyRequests = async () => {

    try {

      const res = await API.get("/maintenance/my");

      // store assignmentIds which already have OPEN request
      const openRequests = res.data
        .filter(r => r.status === "OPEN" || r.status === "IN_PROGRESS")
        .map(r => r.assignmentId);

      setReportedAssets(openRequests);

    } catch(err) {

      console.error("error loading requests", err);

    }

  };  

  /* Stats */
  const total   = assets.length;

  const inMaint = assets.filter(
    a => a.status === "IN_MAINTENANCE"
  ).length;

  const active = assets.filter(
    a => a.status === "ASSIGNED"
  ).length;

const statTiles = [

  {
    label: "Total Assets",
    value: total,
    icon: <Layers size={22}/>,
    bg: "hsl(214,65%,93%)",
    iconBg: "hsl(214,60%,82%)",
    iconColor: "hsl(214,80%,46%)"
  },

  {
    label: "Active Assets",
    value: active,
    icon: <Monitor size={22}/>,
    bg: "hsl(158,45%,92%)",
    iconBg: "hsl(158,45%,80%)",
    iconColor: "hsl(158,55%,35%)"
  },

  {
    label: "In Maintenance",
    value: inMaint,
    icon: <Wrench size={22}/>,
    bg: "hsl(38,80%,93%)",
    iconBg: "hsl(38,75%,82%)",
    iconColor: "hsl(38,80%,42%)"
  }

];

  /* Filter */
  const filtered = assets.filter(a => {
    const q = search.toLowerCase();
    return (a.assetName.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q))
      && (status === 'All Status' || a.status === status);
  });

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);


  const submitIssue = async () => {

    if(!issueText.trim()) {
      alert("Please describe the issue");
      return;
    }

    try {

      await API.post("/maintenance", {

        assignmentId: selectedAssignmentId,
        issueDescription: issueText

      });

      alert("Issue reported successfully");

      setShowIssueModal(false);
      setIssueText("");

      // ADD THIS LINE
      fetchMyRequests();

    } catch(err){

      console.error(err);
      alert("Error submitting issue");

    }

  };

  return (
    <div className="ma-page">

      {/* Subtitle */}
      <p className="ma-subtitle">View and manage assets assigned to you</p>

      {/* ── White container card ── */}
      <div className="ma-container">


                {/* ── Stat tiles ── */}
        <div className="ma-stat-row">
          {statTiles.map((t, i) => (
            <div key={i} className="ma-stat-tile" style={{ background: t.bg }}>
              <div className="ma-stat-info">
                <span className="ma-stat-label">{t.label}</span>
                <span className="ma-stat-value">{t.value}</span>
              </div>
            </div>
          ))}
        </div>

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



        {/* ── Table ── */}
        <div className="ma-table-wrap">
          <table className="ap-table ma-table">
            <thead>
              <tr>
                <th className="ap-th">Asset </th>
                <th className="ap-th">Asset ID</th>
                <th className="ap-th">Assigned Date</th>
                <th className="ap-th">Status</th>
                <th className="ap-th">Action</th>
                <th className="ap-th"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="ap-empty">No assets found.</td></tr>
              ) : paginated.map((a, i) => (
                <tr key={a.id} className={`ap-tr ${i % 2 === 1 ? 'ap-tr-alt' : ''}`}>

                  {/* Asset: icon + name + sub-id */}
                  <td className="ap-td">
                    <div className="ma-asset-cell">
                      <div className="ma-asset-text">
                        <span className="ma-asset-name">{a.assetName}</span>
                      </div>
                    </div>
                  </td>

                  <td className="ap-td ma-id-cell">{a.assetId}</td>
                  <td className="ap-td ma-date-cell">{a.assignedDate}</td>

                  {/* Status badge */}
                  <td className="ap-td">
                    <span className="ap-status-badge ma-status-badge"
                      style={statusStyles[a.status] || {}}>
                       {statusLabels[a.status]}
                    </span>
                  </td>

                  {/* Report Issue */}
                  <td className="ap-td">
                    <button
                      className="ma-report-btn"
                      disabled={reportedAssets.includes(a.id)}
                      onClick={() => {
                        setSelectedAssignmentId(a.id);
                        setShowIssueModal(true);
                      }}
                    >
                      {reportedAssets.includes(a.id) ? "Issue Reported" : "Report Issue"}
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
      {assets.length === 0 && (

      <div className="ma-empty-state">
        <p className="ma-empty-line">No assets assigned yet</p>
        <p className="ma-empty-contact">Contact admin</p>
      </div>

      )}

      {/* ── Modals ── */}
      {modal?.type === 'detail' && (
        <DetailModal asset={modal.data} onClose={() => setModal(null)} />
      )}
      {
      showIssueModal && (

      <div className="modal-overlay">

        <div className="modal-box">

          <h3>Report Issue</h3>

          <textarea

            placeholder="Describe the issue..."

            value={issueText}

            onChange={(e)=>setIssueText(e.target.value)}

            rows={4}

          />

          <div className="modal-actions">

            <button
              onClick={()=>setShowIssueModal(false)}
              className="ap-cancel-btn"
            >
              Cancel
            </button>

            <button
              onClick={submitIssue}
              className="ap-save-btn"
              disabled={!issueText.trim()}
            >
              Submit
            </button>

          </div>

        </div>

      </div>

      )
      }
    
    </div>
  );
};

export default MyAssetsPage;