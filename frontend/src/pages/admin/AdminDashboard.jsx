import React from 'react';
import {
  Layers, Tag, Monitor, Wrench,
  Users, AlertTriangle, Trash2,
  Laptop, Smartphone, Printer, Server
} from 'lucide-react';

/* ── Category icon ── */
const CategoryIcon = ({ category }) => {
  const p = { size: 15, strokeWidth: 1.8 };
  const map = {
    Laptop:  <Laptop    {...p} />,
    Phone:   <Smartphone {...p} />,
    Monitor: <Monitor   {...p} />,
    Printer: <Printer   {...p} />,
    Desktop: <Monitor   {...p} />,
    Server:  <Server    {...p} />,
  };
  return <span className="asgn-asset-icon db-asset-icon">{map[category] || <Monitor {...p} />}</span>;
};

/* ── Stat cards data ── */
const statCards = [
  {
    label: 'Total Assets', sub: '103 A', value: 128,
    icon: <Layers size={22} />,
    bg: 'hsl(258,60%,93%)', iconBg: 'hsl(258,55%,82%)', iconColor: 'hsl(258,55%,48%)',
  },
  {
    label: 'Assigned', sub: 'Assets', value: 87,
    icon: <Tag size={22} />,
    bg: 'hsl(214,70%,93%)', iconBg: 'hsl(214,65%,82%)', iconColor: 'hsl(214,80%,46%)',
  },
  {
    label: 'Available', sub: 'Assets', value: 41,
    icon: <Monitor size={22} />,
    bg: 'hsl(158,50%,91%)', iconBg: 'hsl(158,50%,80%)', iconColor: 'hsl(158,55%,35%)',
  },
  {
    label: 'In', sub: 'Maintenance', value: 5,
    icon: <Wrench size={22} />,
    bg: 'hsl(22,80%,93%)', iconBg: 'hsl(22,75%,82%)', iconColor: 'hsl(22,80%,45%)',
  },
  {
    label: 'In Maintenance', sub: 'Total', value: 5,
    icon: <Wrench size={22} />,
    bg: 'hsl(38,85%,93%)', iconBg: 'hsl(38,80%,82%)', iconColor: 'hsl(38,80%,42%)',
  },
  {
    label: 'Total Employees', sub: 'Sales', value: 22,
    icon: <Users size={22} />,
    bg: 'hsl(214,65%,93%)', iconBg: 'hsl(214,60%,82%)', iconColor: 'hsl(214,75%,46%)',
  },
  {
    label: 'Pending', sub: 'Requests', value: 3,
    icon: <AlertTriangle size={22} />,
    bg: 'hsl(0,70%,94%)', iconBg: 'hsl(0,65%,85%)', iconColor: 'hsl(0,70%,50%)',
  },
  {
    label: 'Trash', sub: '', value: null,
    icon: <Trash2 size={22} />,
    bg: 'hsl(214,20%,94%)', iconBg: 'hsl(214,18%,85%)', iconColor: 'hsl(214,20%,50%)',
  },
];

/* ── Recent Assignments data ── */
const recentAssignments = [
  { id:1, category:'Laptop',  assetName:'Dell XPS',      employee:'Sarah Johnson',    department:'IT',        date:'Apr 12, 2024' },
  { id:2, category:'Laptop',  assetName:'HP EliteBook',  employee:'David Smith',      department:'Sales',     date:'Apr 10, 2024' },
  { id:3, category:'Phone',   assetName:'iPhone 12',     employee:'Emma Davis',       department:'Marketing', date:'Apr 8, 2024'  },
  { id:4, category:'Printer', assetName:'Epson Printer', employee:'Michael Rodriguez',department:'',          date:'Apr 5, 2024'  },
];

/* ── Recent Maintenance data ── */
const recentMaintenance = [
  { id:1, category:'Laptop',  assetName:'Dell XPS',      assetId:'',      issue:'Screen flickering frequently', priority:'High',     status:'In Progress' },
  { id:2, category:'Phone',   assetName:'iPhone 12',     assetId:'',      issue:'Battery draining quickly',     priority:'High',     status:'Requested'   },
  { id:3, category:'Printer', assetName:'Epson Printer', assetId:'',      issue:'Paper jam issues',             priority:'Low',      status:'Completed'   },
  { id:4, category:'Printer', assetName:'Epson Printer', assetId:'AST002',issue:'',                             priority:'Assigned', status:'View'        },
];

/* ── Badge styles ── */
const priorityStyle = {
  High:     { color:'#fff',               background:'hsl(0,72%,52%)',   border:'none' },
  Low:      { color:'#fff',               background:'hsl(215,16%,55%)', border:'none' },
  Medium:   { color:'hsl(38,85%,32%)',    background:'hsl(38,95%,82%)',  border:'none' },
  Critical: { color:'#fff',               background:'hsl(14,90%,53%)',  border:'none' },
  Assigned: { color:'hsl(214,80%,40%)',   background:'hsl(214,80%,90%)', border:'none' },
};

const statusStyle = {
  'In Progress': { color:'hsl(38,90%,35%)',  background:'hsl(38,90%,93%)',  border:'1px solid hsl(38,80%,78%)' },
  Requested:     { color:'hsl(214,80%,46%)', background:'hsl(214,80%,94%)', border:'1px solid hsl(214,70%,82%)' },
  Completed:     { color:'hsl(145,60%,35%)', background:'hsl(145,55%,93%)', border:'1px solid hsl(145,55%,80%)' },
  View:          { color:'hsl(220,15%,35%)', background:'hsl(214,25%,94%)', border:'1px solid hsl(214,20%,84%)' },
};

/* ── AdminDashboard ── */
const AdminDashboard = ({ user, onNavChange }) => {
  const name = user?.name || 'John Admin';

  return (
    <div className="db-page">

      {/* Welcome heading */}
      <h1 className="db-welcome">Welcome, {name}</h1>

      {/* ── Stat cards grid ── */}
      <div className="db-stats-card">
        <div className="db-stats-grid">
          {statCards.map((card, i) => (
            <div key={i} className="db-stat-tile" style={{ background: card.bg }}>
              <div className="db-stat-icon" style={{ background: card.iconBg, color: card.iconColor }}>
                {card.icon}
              </div>
              <div className="db-stat-info">
                <div className="db-stat-label">{card.label}</div>
                {card.sub && <div className="db-stat-sub">{card.sub}</div>}
              </div>
              {card.value !== null && (
                <div className="db-stat-value">{card.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Two bottom panels ── */}
      <div className="db-panels">

        {/* Recent Assignments */}
        <div className="db-panel-card">
          <div className="db-panel-header">
            <span className="db-panel-title">Recent Assignments</span>
            <button className="db-view-all-btn" onClick={() => onNavChange?.('assignments')}>
              View All
            </button>
          </div>

          <div className = "ap-table-wrapper">
          <table className="db-mini-table">
            <thead>
              <tr>
                {['Asset Name','Employee','Department','Assigned Date'].map(h => (
                  <th key={h} className="db-mini-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAssignments.map((a, i) => (
                <tr key={a.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <CategoryIcon category={a.category} />
                      <span className="db-mini-asset-name">{a.assetName}</span>
                    </div>
                  </td>
                  <td className="db-mini-td">{a.employee}</td>
                  <td className="db-mini-td">{a.department}</td>
                  <td className="db-mini-td db-mini-date">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="db-panel-card ap-table-wrapper">
          <div className="db-panel-header">
            <span className="db-panel-title">Recent Maintenance Requests</span>
            <button className="db-view-all-btn" onClick={() => onNavChange?.('maintenance')}>
              View All
            </button>
          </div>

          <div className = "ap-table-wrapper">
          <table className="db-mini-table">
            <thead>
              <tr>
                {['Asset Name','Issue','Priority','Status','Status'].map((h, i) => (
                  <th key={i} className="db-mini-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentMaintenance.map((r, i) => (
                <tr key={r.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <CategoryIcon category={r.category} />
                      <span className="db-mini-asset-name">
                        {r.assetName}
                        {r.assetId && <span className="db-mini-asset-id"> {r.assetId}</span>}
                      </span>
                    </div>
                  </td>
                  <td className="db-mini-td db-mini-issue">{r.issue}</td>
                  <td className="db-mini-td">
                    {r.priority && (
                      <span className="ap-status-badge db-priority-badge"
                        style={priorityStyle[r.priority] || {}}>
                        {r.priority}
                      </span>
                    )}
                  </td>
                  <td className="db-mini-td">
                    <span className="ap-status-badge"
                      style={statusStyle[r.status] || {}}>
                      {r.status}
                    </span>
                  </td>
                  <td className="db-mini-td">
                    {r.status !== 'View' && (
                      <span className="ap-status-badge"
                        style={statusStyle[r.status] || {}}>
                        {r.status}
                      </span>
                    )}
                    {r.status === 'View' && (
                      <button className="ap-action-btn ap-edit-btn db-view-btn">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;