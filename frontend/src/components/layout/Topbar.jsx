import React, { useRef } from 'react';
import {
  Menu,
  Bell
} from 'lucide-react';

import {
  getNotifications,
  markAllNotificationsRead
} from "../../api/notificationApi";

const Topbar = ({ title = 'Dashboard', user, onLogout, onMenuToggle }) => {

  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const notificationRef = useRef(null);

  React.useEffect(() => {

    fetchNotifications();
  }, []);

  React.useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {

        setShowNotifications(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);  


  const fetchNotifications = async () => {

    try {

      const data = await getNotifications();

      setNotifications(data);

    }
    catch(err) {

      console.error(
        "Error fetching notifications",
        err
      );

    }

  };  

  const unreadCount = notifications.filter(
    n => !n.isRead
  ).length;

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

        {/* Notification Bell */}
        <div
          className="topbar-notification-wrapper"
          ref={notificationRef}
        >

          <button
            className="topbar-bell-btn"
            onClick={async () => {

              const nextState = !showNotifications;

              setShowNotifications(nextState);

              /*
                when opening dropdown,
                mark notifications read
              */
              if(nextState) {

                try {

                  await markAllNotificationsRead();

                  setNotifications(prev =>
                    prev.map(n => ({
                      ...n,
                      isRead: true
                    }))
                  );

                }
                catch(err) {

                  console.error(
                    "Error marking notifications read",
                    err
                  );

                }

              }

            }}
          >

            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="topbar-notification-badge">
                {unreadCount}
              </span>
            )}

          </button>

          {showNotifications && (

            <div className="topbar-notification-dropdown">

              <div className="topbar-notification-header">

                <span>Notifications</span>

              </div>

              <div className="topbar-notification-list">

                {notifications.length === 0 ? (

                  <div className="topbar-notification-empty">
                    No notifications
                  </div>

                ) : (

                  notifications.map(notification => (

                    <div
                      key={notification._id}
                      className={`topbar-notification-item ${
                        !notification.isRead
                          ? "unread"
                          : ""
                      }`}
                    >

                      <div className="topbar-notification-title">
                        {notification.title}
                      </div>

                      <div className="topbar-notification-message">
                        {notification.message}
                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          )}

        </div>

        {/* Avatar */}
        <div
          className="topbar-avatar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(214,80%,51%)",
            color: "white",
            fontWeight: "600",
            fontSize: "16px"
          }}
        >
          {(user?.name?.charAt(0) || "U").toUpperCase()}
        </div>

      </div>

    </header>
  );
};

export default Topbar;