import React from 'react';
import {
  ClipboardList, ChevronRight,
  Laptop, Smartphone, Printer, Monitor, Server,
  ArrowUp
} from 'lucide-react';

/* ── Category icon ── */
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
  return <span className="ma-asset-icon ed-asset-icon pf-asset-icon">{map[category] || <Monitor {...p} />}</span>;
};

/* ── Static profile data ── */
const profile = {
  name:       'Purva Potabatti',
  role:       'Software Engineer',
  employeeId: 'EMP102',
  avatar:     'https://i.pravatar.cc/160?img=47',
  personal: [
    { label: 'Full Name',    value: 'Purva Potabatti'  },
    { label: 'Email',        value: 'purva@email.com'  },
    { label: 'Phone',        value: '+91 9876543210'   },
    { label: 'Department',   value: 'IT'               },
    { label: 'Role',         value: 'Software Engineer'},
    { label: 'Employee ID',  value: 'EMP102'           },
  ],
  account: [
    { label: 'Username',         value: 'purva.p'      },
    { label: 'Account Created',  value: '12 Jan 2024'  },
    { label: 'Last Login',       value: '2 Apr 2026'   },
  ],
};

/* ── Recent requests ── */
const recentRequests = [
  { id:1, category:'Laptop', assetName:'Dell XPS 13', assetId:'AST102', issue:'Screen flickering',        status:'In Progress' },
  { id:2, category:'Phone',  assetName:'iPhone 12',   assetId:'AST210', issue:'Battery draining quickly', status:'Requested'   },
];

const reqStatusStyle = {
  'In Progress': { color:'hsl(38,90%,28%)',  background:'hsl(38,95%,68%)',  border:'none' },
  Requested:     { color:'#fff',             background:'hsl(214,80%,51%)', border:'none' },
  Completed:     { color:'hsl(145,60%,30%)', background:'hsl(145,55%,88%)', border:'none' },
};

/* ── ProfilePage ── */
const ProfilePage = ({ user }) => {
  const name       = user?.name       || profile.name;
  const roleLabel  = user?.role       || profile.role;
  const avatar     = user?.avatar     || profile.avatar;

  return (
    <div className="pf-page">

      {/* ── Header card ── */}
      <div className="pf-header-card">
        <img className="pf-avatar" src={avatar} alt={name} />
        <div className="pf-header-info">
          <h2 className="pf-name">{name}</h2>
          <p className="pf-role-text">{roleLabel}</p>
          <button className="pf-id-badge">
            <ClipboardList size={14} />
            {profile.employeeId}
            <ChevronRight size={14} className="pf-id-chevron" />
          </button>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div className="pf-body">

        {/* Left: Personal Information */}
        <div className="pf-card">
          <h3 className="pf-card-title">Personal Information</h3>
          <table className="pf-info-table">
            <tbody>
              {profile.personal.map(({ label, value }) => (
                <tr key={label} className="pf-info-row">
                  <td className="pf-info-label">{label}</td>
                  <td className="pf-info-value">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column: Account Info + Recent Requests stacked */}
        <div className="pf-right-col">

          {/* Account Information */}
          <div className="pf-card">
            <h3 className="pf-card-title">Account Information</h3>
            <table className="pf-info-table">
              <tbody>
                {profile.account.map(({ label, value }) => (
                  <tr key={label} className="pf-info-row">
                    <td className="pf-info-label">{label}</td>
                    <td className="pf-info-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Requests */}
          <div className="pf-card pf-requests-card">
            <h3 className="pf-card-title pf-requests-title">Recent Requests</h3>
            <table className="db-mini-table pf-req-table">
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
                    <td className="db-mini-td pf-issue-cell">{r.issue}</td>
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
          </div>

        </div>{/* /pf-right-col */}
      </div>{/* /pf-body */}
    </div>
  );
};

export default ProfilePage;