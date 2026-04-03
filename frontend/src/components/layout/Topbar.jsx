import React from 'react';
import { Menu } from 'lucide-react';

const Topbar = ({ title = 'Dashboard', user, onLogout, onMenuToggle }) => {
  return (
    <header className="topbar">

      <div className="topbar-left">
        {/* Hamburger — only visible on mobile via CSS */}
        <button
          className="topbar-hamburger"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <img
          className="topbar-avatar"
          src={user?.avatar || 'https://i.pravatar.cc/80?img=12'}
          alt="user avatar"
        />
      </div>

    </header>
  );
};

export default Topbar;