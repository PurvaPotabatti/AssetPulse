import React, { useEffect, useState } from 'react';
import API from '../../api/axiosConfig'; // adjust path if needed
import {
  Layers, Monitor, Wrench, ClipboardList,
  Laptop, Smartphone, Printer, Server,
  ArrowUp, ChevronRight, ChevronsRight, Key
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  statusStyles,
  statusLabels
} from "../../utils/statusUtils";


/* ── EmployeeDashboard ── */
const EmployeeDashboard = ({ user, onNavChange }) => {
  const name = user?.name?.split(' ')[0] || 'Employee';
  const [myAssets, setMyAssets] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [stats, setStats] = useState({
    totalAssets: 0,
    requests: 0
  });
  const navigate = useNavigate(); 

  const statTiles = [
  {
    label: 'My Assets',
    value: stats.totalAssets,
    icon: <Layers size={22} />,
    bg: 'hsl(214,65%,94%)',
    iconBg: 'hsl(214,60%,83%)',
    iconColor: 'hsl(214,80%,46%)',
  },
  // {
  //   label: 'In Maintenance',
  //   value: stats.inMaintenance,
  //   icon: <Wrench size={22} />,
  //   bg: 'hsl(38,80%,94%)',
  //   iconBg: 'hsl(38,75%,83%)',
  //   iconColor: 'hsl(38,80%,42%)',
  // },
  {
    label: 'Active Requests',
    value: stats.requests,
    icon: <ClipboardList size={22} />,
    bg: 'hsl(38,60%,95%)',
    iconBg: 'hsl(38,55%,85%)',
    iconColor: 'hsl(38,65%,44%)',
  },
];

  useEffect(() => {
    loadEmployeeDashboard();
  }, []);

  const loadEmployeeDashboard = async () => {

  try {


    const assetsRes =
      await API.get("/employee/my-assets");

    const latestAssets =
      assetsRes.data
        .sort(
          (a, b) =>
            new Date(b.assignedDate) -
            new Date(a.assignedDate)
        )
        .slice(0, 5)
        .map(a => ({

          id: a.id || a._id,

          category:
            a.category || "Laptop",

          assetName:
            a.assetName,

          assetId:
            a.assetId,

          date:
            new Date(a.assignedDate)
              .toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              ),

          status:
            a.status

        }));

    setMyAssets(latestAssets);

    /*
   fetch my maintenance requests
    */
    const requestsRes =
      await API.get("/maintenance/my");

    const latestRequests =
      requestsRes.data
        .sort(
          (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 5)
        .map(r => ({

          id: r.id || r._id,

          category:
            r.assetCategory || "Laptop",

          assetName:
            r.assetName || "Asset",

          assetId:
            r.assetId || "",

          issue:
            r.issueDescription || "-",

          status: r.status 
        }));

    setMyRequests(latestRequests);

        /*
          calculate stats
        */
        const totalAssets =
          assetsRes.data.length;


        const requests = requestsRes.data.filter(
          r => r.status === "OPEN" || r.status === "IN_PROGRESS"
        ).length;

        setStats({
          totalAssets,
          requests
        });

  } catch (error) {

    console.error(
      "employee dashboard error",
      error
    );

  }
};

  return (
    <div className="ed-page">

      {/* Welcome */}
      <div className="ed-welcome-block">
        <h1 className="ed-welcome-heading">Welcome back, {name}</h1>
        <p className="ed-welcome-sub">Here is an overview of your assigned assets and requests</p>
      </div>

      {/* ── Stat tiles ── */}
      <div className="ed-container">
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
              </div>
            </div>
          </div>
        ))}
      </div>
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
                <th className="db-mini-th">Asset</th>
                <th className="db-mini-th">Assigned Date</th>
                <th className="db-mini-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {myAssets.map((a, i) => (
                <tr key={a.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <div className="ma-asset-text">
                        <span className="db-mini-asset-name">{a.assetName}</span>
                        <span className="ma-asset-sub-id">{a.assetId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="db-mini-td ed-date-cell">{a.date}</td>
                  <td className="db-mini-td">
                    <span className="ap-status-badge ed-badge"
                      style={statusStyles[a.status] || {}}>
                      {statusLabels[a.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* View All footer */}
          <div className="ed-panel-footer">
            <button className="ed-view-all-link" onClick={() => onNavChange("emp-assets")}>
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
                <th className="db-mini-th">Asset</th>
                <th className="db-mini-th">Issue</th>
                <th className="db-mini-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r, i) => (
                <tr key={r.id} className={`db-mini-tr ${i % 2 === 1 ? 'db-mini-tr-alt' : ''}`}>
                  <td className="db-mini-td">
                    <div className="db-mini-asset-wrap">
                      <div className="ma-asset-text">
                        <span className="db-mini-asset-name">{r.assetName}</span>
                        <span className="ma-asset-sub-id">{r.assetId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="db-mini-td ed-issue-cell">{r.issue}</td>
                  <td className="db-mini-td">
                    <span className="ap-status-badge ed-badge"
                      style={statusStyles[r.status] || {}}>
                      {statusLabels[r.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* View All footer */}
          <div className="ed-panel-footer">
            <button className="ed-view-all-link" onClick={() => onNavChange("emp-requests")}>
              View All <ChevronRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;