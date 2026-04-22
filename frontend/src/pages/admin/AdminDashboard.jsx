import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
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
const statCards = (stats) => [
  {
    label: 'Total Assets',
    value: stats.totalAssets,
    icon: <Layers size={22} />,
    bg: 'hsl(258,60%,93%)',
    iconBg: 'hsl(258,55%,82%)',
    iconColor: 'hsl(258,55%,48%)',
  },
  {
    label: 'Assigned Assets',
    value: stats.assignedAssets,
    icon: <Tag size={22} />,
    bg: 'hsl(214,70%,93%)',
    iconBg: 'hsl(214,65%,82%)',
    iconColor: 'hsl(214,80%,46%)',
  },
  {
    label: 'Available Assets',
    value: stats.availableAssets,
    icon: <Monitor size={22} />,
    bg: 'hsl(158,50%,91%)',
    iconBg: 'hsl(158,50%,80%)',
    iconColor: 'hsl(158,55%,35%)',
  },
  {
    label: 'In Maintenance',
    value: stats.inMaintenance,
    icon: <Wrench size={22} />,
    bg: 'hsl(22,80%,93%)',
    iconBg: 'hsl(22,75%,82%)',
    iconColor: 'hsl(22,80%,45%)',
  },
  {
    label: 'Total Employees',
    value: stats.employees,
    icon: <Users size={22} />,
    bg: 'hsl(214,65%,93%)',
    iconBg: 'hsl(214,60%,82%)',
    iconColor: 'hsl(214,75%,46%)',
  },
  {
    label: 'Open Requests',
    value: stats.openRequests,
    icon: <AlertTriangle size={22} />,
    bg: 'hsl(0,70%,94%)',
    iconBg: 'hsl(0,65%,85%)',
    iconColor: 'hsl(0,70%,50%)',
  }
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
  const name = user?.name || 'Purva';

  /* dashboard state */

  const [stats, setStats] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    availableAssets: 0,
    inMaintenance: 0,
    employees: 0,
    openRequests: 0,
  });

  const [recentAssignments, setRecentAssignments] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);




  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      console.log("dashboard loading...");

      /* fetch assets */
      const assetsRes =
        await API.get("/assets");

      console.log(
        "assets response",
        assetsRes.data
      );

      const assets =
        assetsRes.data;


      /* fetch employees */
      const user = JSON.parse(localStorage.getItem("user"));

      const employeesRes = await API.get(
        `/users/${user.userId}`
      );

      console.log(
        "employees response",
        employeesRes.data
      );

      const employees =
        employeesRes.data;


      /* update stats */
      setStats(prev => ({

        ...prev,

        totalAssets:
          assets.length,

        assignedAssets:
          assets.filter(a =>
            a.status === "ASSIGNED"
          ).length,

        availableAssets:
          assets.filter(a =>
            a.status === "AVAILABLE"
          ).length,

        inMaintenance:
          assets.filter(a =>
            a.status === "IN_MAINTENANCE"
          ).length,

        employees:
          employees.length,

      }));



      /*
   maintenance requests
  */
  const maintenanceRes =
    await API.get("/maintenance");

  console.log(
    "maintenance response",
    maintenanceRes.data
  );

  /*
    count OPEN requests
  */
  const openRequests =
    maintenanceRes.data.filter(
      r =>
        r.status === "OPEN"
    ).length;

  setStats(prev => ({

    ...prev,

    openRequests: openRequests

  }));


  /*
   recent assignments
  */
  const assignmentsRes =
    await API.get("/assignments");

  console.log(
    "assignments response",
    assignmentsRes.data
  );

  /*
    latest 5 assignments
  */
  const latestAssignments =
    assignmentsRes.data
      .sort(
        (a,b)=>
          new Date(b.assignedDate) -
          new Date(a.assignedDate)
      )
      .slice(0,5)
      .map(a => ({

        id: a.id,

        category:
          a.category || "Laptop",

        assetName:
          a.assetName,

        employee:
          a.employeeName,

        department:
          a.department || "-",

        date:
          new Date(a.assignedDate)
            .toLocaleDateString(
              "en-IN",
              {
                day:"2-digit",
                month:"short",
                year:"numeric"
              }
            )

      }));

  setRecentAssignments(
    latestAssignments
  );


  /*
   recent maintenance requests
*/
const latestMaintenance =
  maintenanceRes.data
    .sort(
      (a,b)=>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    )
    .slice(0,5)
    .map(r => ({

      id: r.id,

      category:
        r.assetCategory || "Laptop",

      assetName:
        r.assetName || "Asset",

      assetId:
        r.assetId || "",

      issue:
        r.issueDescription || "-",

      priority:
        r.priority || "Low",

      status:
        r.status === "OPEN"
          ? "Requested"
          : r.status === "IN_PROGRESS"
          ? "In Progress"
          : r.status === "COMPLETED"
          ? "Completed"
          : "Requested"

    }));

setRecentMaintenance(
  latestMaintenance
);


    }
    catch (error) {

      console.error(
        "dashboard error",
        error
      );

    }

  };

  return (
    <div className="db-page">

      {/* Welcome heading */}
      <h1 className="db-welcome">Welcome, {name}</h1>

      {/* ── Stat cards grid ── */}
      <div className="db-stats-card">
        <div className="db-stats-grid">
          {statCards(stats).map((card, i) => (
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
                {['Asset Name','Issue','Priority','Status','Action'].map((h, i) => (
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