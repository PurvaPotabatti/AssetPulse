import React from 'react';
import {
  LayoutDashboard,
  Tag,
  Users,
  ClipboardList,
  Wrench,
  FolderOpen,
  LogOut,
  X
} from 'lucide-react';

export const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: Tag, label: 'Assets', key: 'assets' },
  { icon: Users, label: 'Employees', key: 'employees' },
  { icon: ClipboardList, label: 'Assignments', key: 'assignments' },
  { icon: Wrench, label: 'Maintenance', key: 'maintenance' },
];

export const employeeNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'emp-dashboard' },
  { icon: Tag, label: 'My Assets', key: 'emp-assets' },
  // { icon: Wrench, label: 'Report Issue', key: 'emp-report' },
  { icon: ClipboardList, label: 'My Requests', key: 'emp-requests' },
  { icon: FolderOpen, label: 'Profile', key: 'emp-profile' },
];

const Sidebar = ({ activeNav = 'dashboard', onNavChange, onLogout, user, isOpen, onClose, navItems }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>

      {/* Logo row — with close button on mobile */}
      <div className="sidebar-logo">
        <svg
          className="logo-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            points="2,12 5,12 7,5 9,19 11,9 13,15 15,12 22,12"
            stroke="hsl(214,80%,51%)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span style={{ color: 'black' }}>
          Asset<span style={{ color: 'hsl(214,80%,51%)' }}>Pulse</span>
        </span>

        {/* Close button — only visible on mobile */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Profile */}
      <div className="sidebar-profile">
        <img
          className="sidebar-avatar"
          src={user?.avatar || 'https://i.pravatar.cc/80?img=12'}
          alt="avatar"
        />
        <div className="sidebar-profile-info">
          <span className="sidebar-profile-name">{user?.name || 'John Admin'}</span>
          <span className="sidebar-profile-role">{user?.role || 'Administrator'}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, key }) => (
          <button
            key={key}
            className={`sidebar-nav-item ${activeNav === key ? 'active' : ''}`}
            onClick={() => onNavChange?.(key)}
          >
            <Icon size={18} className="sidebar-nav-icon" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom logout */}
      <div className="sidebar-logout-section">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOut size={18} style={{ color: 'hsl(0,72%,45%)' }} />
          Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;