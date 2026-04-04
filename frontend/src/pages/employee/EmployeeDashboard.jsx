import React from 'react';
import {
  Layers, Monitor, Wrench, ClipboardList,
  Laptop, Smartphone, Printer, Server,
  ArrowUp, ChevronRight, ChevronsRight, Key
} from 'lucide-react';

/* ── Category icon chip ── */
const CategoryIcon = ({ category }) => {
  const p = { size: 15, strokeWidth: 1.8 };
  const map = {
    Laptop:  <Laptop     {...p} />,
    Phone:   <Smartphone {...p} />,
    Monitor: <Monitor    {...p} />,
    Printer: <Printer    {...p} />,
    Desktop: <Monitor    {...p} />,
    Server:  <Server     {...p} />,
  };
  return <span className="ma-asset-icon ed-asset-icon">{map[category] || <Monitor {...p} />}</span>;
};

/* ── Stat tiles ── */
const statTiles = [
  {
    label: 'My Assets', sub: 'Total assigned', value: 2,
    icon: <Layers size={22} />,
    bg: 'hsl(214,65%,94%)', iconBg: 'hsl(214,60%,83%)', iconColor: 'hsl(214,80%,46%)',
  },
  {
    label: 'Active Assets', sub: 'Currently in use', value: 1,
    icon: <Monitor size={22} />,
    bg: 'hsl(214,30%,96%)', iconBg: 'hsl(214,25%,86%)', iconColor: 'hsl(214,50%,48%)',
  },
  {
    label: 'In Maintenance', sub: 'Currently unavailable', value: 1,
    icon: <Wrench size={22} />,
    bg: 'hsl(38,80%,94%)', iconBg: 'hsl(38,75%,83%)', iconColor: 'hsl(38,80%,42%)',
  },
  {
    label: 'Requests Raised', sub: 'Currently ongoing', value: 1,
    icon: <ClipboardList size={22} />,
    bg: 'hsl(38,60%,95%)', iconBg: 'hsl(38,55%,85%)', iconColor: 'hsl(38,65%,44%)',
  },
];

/* ── Quick actions ── */
const quickActions = [
  { label: 'View My Assets',  icon: <Monitor      size={18} />, key: 'emp-assets',   primary: true  },
  { label: 'Report Issue',    icon: <Key          size={18} />, key: 'emp-report',   primary: false },
  { label: 'View Requests',   icon: <ClipboardList size={18}/>, key: 'emp-requests', primary: false },
  { label: 'View All',        icon: <ChevronsRight size={18}/>, key: null,           primary: false, chevron: true },
];

/* ── Recent assets ── */
const recentAssets = [
  { id:1, category:'Laptop', assetName:'Dell XPS 13', assetId:'AST102', date:'12 Apr 2024', status:'Assigned'        },
  { id:2, category:'Phone',  assetName:'iPhone 12',   assetId:'AST210', date:'3 Mar 2024',  status:'In Maintenance'  },
];

/* ── Recent requests ── */
const recentRequests = [
  { id:1, category:'Laptop', assetName:'Dell XPS 13', assetId:'AST102', issue:'Screen flickering',        status:'In Progress' },
  { id:2, category:'Phone',  assetName:'iPhone 12',   assetId:'AST210', issue:'Battery draining quickly', status:'Requested'   },
];

/* ── Badge styles ── */
const assetStatusStyle = {
  Assigned:        { color:'#fff',             background:'hsl(214,80%,51%)', border:'none' },
  'In Maintenance':{ color:'hsl(38,90%,28%)',  background:'hsl(38,95%,68%)',  border:'none' },
};

const reqStatusStyle = {
  'In Progress': { color:'hsl(38,90%,28%)',  background:'hsl(38,95%,68%)',   border:'none' },
  Requested:     { color:'#fff',             background:'hsl(214,80%,51%)',  border:'none' },
  Completed:     { color:'hsl(145,60%,30%)', background:'hsl(145,55%,88%)',  border:'none' },
};

/* ── EmployeeDashboard ── */
const EmployeeDashboard = ({ user, onNavChange }) => {
  const name = user?.name?.split(' ')[0] || 'Purva';

  return (
    <div className="ed-page">

      {/* Welcome */}
      <div className="ed-welcome-block">
        <h1 className="ed-welcome-heading">Welcome back, {name} 👋</h1>
        <p className="ed-welcome-sub">Here is an overview of your assigned assets and requests</p>
      </div>

      {/* ── Stat tiles ── */}
      <div className="ed-stat-grid">
        {statTiles.map((t, i) => (
          <div key={i} className="ed-stat-tile" style={{ background: t.bg }}>
            <div className="ed-stat-icon" style={{ background: t.iconBg, color: t.iconColor }}>
              {t.icon}
            </div>
            <div className="ed-stat-info">
              <span className="ed-stat-label">{t.label}</span>
              <div className="ed-stat-bottom">
                <span className="ed-stat-value">{t.value}</span>
                <span className="ed-stat-sub">{t.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick action buttons ── */}
      <div className="ed-quick-actions">
        {quickActions.map((a, i) => (
          <button
            key={i}
            className={`ed-quick-btn ${a.primary ? 'ed-quick-btn--primary' : 'ed-quick-btn--outline'} ${a.chevron ? 'ed-quick-btn--chevron' : ''}`}
            onClick={() => a.key && onNavChange?.(a.key)}
          >
            <span className="ed-quick-icon">{a.icon}</span>
            <span className="ed-quick-label">{a.label}</span>
            {a.chevron && <ChevronRight size={16} className="ed-quick-chevron-right" />}
          </button>
        ))}
      </div>

      {/* ── Two bottom panels ── */}
      <div className="ed-panels">

        {/* Recent Assets */}
        <div className="db-panel-card">
          <div className="db-panel-header">
            <span className="db-panel-title">Recent Assets</span>
          </div>
          <table className="db-mini-table">
            <thead>
              <tr>
                <th className="db-mini-th">
                  <span className="ma-th-sort">Asset <ArrowUp size={11} /></span>
                </th>
                <th className="db-mini-th">Assigned Date</th>
                <th className="db-mini-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssets.map((a, i) => (
                <tr key={a.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <CategoryIcon category={a.category} />
                      <div className="ma-asset-text">
                        <span className="db-mini-asset-name">{a.assetName}</span>
                        <span className="ma-asset-sub-id">{a.assetId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="db-mini-td ed-date-cell">{a.date}</td>
                  <td className="db-mini-td">
                    <span className="ap-status-badge ed-badge"
                      style={assetStatusStyle[a.status] || {}}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* View All footer */}
          <div className="ed-panel-footer">
            <button className="ed-view-all-link" onClick={() => onNavChange?.('emp-assets')}>
              View All <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="db-panel-card">
          <div className="db-panel-header">
            <span className="db-panel-title">Recent Requests</span>
          </div>
          <table className="db-mini-table">
            <thead>
              <tr>
                <th className="db-mini-th">
                  <span className="ma-th-sort">Asset <ArrowUp size={11} /></span>
                </th>
                <th className="db-mini-th">Issue</th>
                <th className="db-mini-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r, i) => (
                <tr key={r.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <CategoryIcon category={r.category} />
                      <div className="ma-asset-text">
                        <span className="db-mini-asset-name">{r.assetName}</span>
                        <span className="ma-asset-sub-id">{r.assetId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="db-mini-td ed-issue-cell">{r.issue}</td>
                  <td className="db-mini-td">
                    <span className="ap-status-badge ed-badge"
                      style={reqStatusStyle[r.status] || {}}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* View All footer */}
          <div className="ed-panel-footer">
            <button className="ed-view-all-link" onClick={() => onNavChange?.('emp-requests')}>
              View All <ChevronRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;