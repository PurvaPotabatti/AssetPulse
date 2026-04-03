import React, { useState, useEffect } from 'react';
import {
  adminNavItems,
  employeeNavItems
} from "./Sidebar";
import Topbar from './Topbar';
import AssetsPage from "../../pages/admin/AssetsPage";
import EmployeesPage from '../../pages/admin/EmployeesPage';
import AssignmentsPage from '../../pages/admin/AssignmentsPage';
import MaintenancePage from '../../pages/admin/MaintenancePage';  
import AdminDashboard from '../../pages/admin/AdminDashboard';
import EmployeeDashboard from "../../pages/employee/EmployeeDashboard";
import MyAssetsPage from "../../pages/employee/MyAssetsPage";
import ReportsIssuepage from "../../pages/employee/ReportIssuepage";
import ProfilePage from "../../pages/employee/ProfilePage";
import Sidebar from "./Sidebar";
import { Tag, ChevronDown } from 'lucide-react';

const pageTitles = {

  // admin
  dashboard:   'Dashboard',
  assets:      'Assets',
  employees:   'Employees',
  assignments: 'Assignments',
  maintenance: 'Maintenance',

  // employee
  'emp-dashboard': 'Dashboard',
  'emp-assets': 'My Assets',
  'emp-report': 'Report Issue',
  'emp-requests': 'My Requests',
  'emp-profile': 'Profile',
};
 
const user = {
  name:   'Purva Potabatti',
  role:   'Administrator',
  avatar: 'https://i.pravatar.cc/80?img=12',
};

// const role = "admin"; // later this will come from login
// const role = "employee"; // later this will come from login

 
const DashboardLayout = ({ role = "admin" }) => {

  const navItems =
  role === "admin"
    ? adminNavItems
    : employeeNavItems;

  const [activeNav, setActiveNav] = useState(
  role === "admin" ? "dashboard" : "emp-dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  const handleNavChange = (key) => { setActiveNav(key); setSidebarOpen(false); };
  const handleLogout    = () => alert('Logging out…');

 
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
 
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);
 
  // const pages = ['dashboard','assets','employees','assignments','maintenance'];
 
  return (
    <div className="dashboard-layout">
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
 
    <Sidebar
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={handleNavChange}
      onLogout={handleLogout}
      user={user}
      isOpen={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />
 
      <div className="dashboard-main">
        <Topbar
          title={pageTitles[activeNav] || 'Dashboard'}
          user={user} onLogout={handleLogout}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
 
        <main className="dashboard-content">
          {activeNav === 'dashboard'   && <AdminDashboard user={user} onNavChange={handleNavChange} />}
          {/* {activeNav === 'dashboard'      && <AdminDashboard />} */}
          {activeNav === 'assets'      && <AssetsPage />}
          {activeNav === 'employees'   && <EmployeesPage />}
          {activeNav === 'assignments' && <AssignmentsPage />}
          {activeNav === 'maintenance' && <MaintenancePage />}
 

          {role === "employee" && activeNav === "emp-dashboard" && (
            <EmployeeDashboard />
          )}

          {role === "employee" && activeNav === "emp-assets" && (
            <MyAssetsPage />
          )}

          {role === "employee" && activeNav === "emp-report" && (
            <ReportsIssuepage />
          )}

          {role === "employee" && activeNav === "emp-profile" && (
            <ProfilePage />
          )}
        </main>
      </div>
    </div>
  );
};
 
export default DashboardLayout;