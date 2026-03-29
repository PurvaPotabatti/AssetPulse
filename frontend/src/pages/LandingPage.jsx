import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const AssetTrackingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Laptop body */}
    <rect x="6" y="10" width="30" height="20" rx="2" fill="hsl(214,60%,70%)" stroke="hsl(214,80%,40%)" strokeWidth="2"/>
    <rect x="8" y="12" width="26" height="16" rx="1" fill="hsl(210,80%,90%)"/>
    {/* Laptop base */}
    <path d="M2 30h44l-3 4H5L2 30z" fill="hsl(214,60%,60%)" stroke="hsl(214,80%,40%)" strokeWidth="1.5"/>
    {/* Barcode lines on screen */}
    <rect x="11" y="15" width="2" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    <rect x="15" y="15" width="1" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    <rect x="18" y="15" width="3" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    <rect x="23" y="15" width="1" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    <rect x="26" y="15" width="2" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    <rect x="30" y="15" width="1" height="9" rx="0.5" fill="hsl(214,80%,40%)"/>
    {/* Blue checkmark circle */}
    <circle cx="34" cy="28" r="7" fill="hsl(214,80%,51%)"/>
    <path d="M30.5 28l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AssignmentIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clipboard */}
    <rect x="10" y="12" width="24" height="28" rx="2" fill="hsl(210,80%,90%)" stroke="hsl(214,80%,40%)" strokeWidth="2"/>
    <rect x="17" y="8" width="10" height="6" rx="2" fill="hsl(214,60%,70%)" stroke="hsl(214,80%,40%)" strokeWidth="1.5"/>
    {/* Lines */}
    <rect x="14" y="22" width="16" height="2" rx="1" fill="hsl(214,80%,51%)"/>
    <rect x="14" y="27" width="12" height="2" rx="1" fill="hsl(214,60%,75%)"/>
    <rect x="14" y="32" width="14" height="2" rx="1" fill="hsl(214,60%,75%)"/>
    {/* Person head */}
    <circle cx="35" cy="20" r="5" fill="hsl(214,60%,70%)" stroke="hsl(214,80%,40%)" strokeWidth="1.5"/>
    {/* Person body */}
    <path d="M28 36c0-4 3-7 7-7s7 3 7 7" fill="hsl(214,60%,55%)" stroke="hsl(214,80%,40%)" strokeWidth="1.5"/>
    {/* Tie */}
    <path d="M35 25l-1.5 5h3L35 25z" fill="hsl(214,80%,40%)"/>
  </svg>
);

const MaintenanceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wrench */}
    <path d="M10 36l16-16" stroke="hsl(214,80%,51%)" strokeWidth="4" strokeLinecap="round"/>
    <path d="M22 14a6 6 0 0 1 8 8l-4-4-4 4-4-4a6 6 0 0 1 4-4z" fill="hsl(214,80%,51%)" stroke="hsl(214,80%,40%)" strokeWidth="1.5"/>
    <rect x="8" y="32" width="7" height="7" rx="1.5" transform="rotate(-45 11.5 35.5)" fill="hsl(214,80%,51%)"/>
    {/* Gear */}
    <circle cx="33" cy="30" r="7" fill="none" stroke="hsl(214,60%,65%)" strokeWidth="2.5"/>
    <circle cx="33" cy="30" r="3" fill="hsl(214,60%,65%)"/>
    <rect x="31.5" y="21" width="3" height="4" rx="1" fill="hsl(214,60%,65%)"/>
    <rect x="31.5" y="35" width="3" height="4" rx="1" fill="hsl(214,60%,65%)"/>
    <rect x="21" y="28.5" width="4" height="3" rx="1" fill="hsl(214,60%,65%)"/>
    <rect x="35" y="28.5" width="4" height="3" rx="1" fill="hsl(214,60%,65%)"/>
    <rect x="23.5" y="22.5" width="3" height="4" rx="1" transform="rotate(45 25 24.5)" fill="hsl(214,60%,65%)"/>
    <rect x="39" y="32" width="3" height="4" rx="1" transform="rotate(45 40.5 34)" fill="hsl(214,60%,65%)"/>
    <rect x="23.5" y="33.5" width="3" height="4" rx="1" transform="rotate(-45 25 35.5)" fill="hsl(214,60%,65%)"/>
    <rect x="39" y="22" width="3" height="4" rx="1" transform="rotate(-45 40.5 24)" fill="hsl(214,60%,65%)"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bar chart */}
    <rect x="8" y="28" width="8" height="12" rx="1.5" fill="hsl(214,60%,75%)"/>
    <rect x="20" y="20" width="8" height="20" rx="1.5" fill="hsl(214,80%,51%)"/>
    <rect x="32" y="14" width="8" height="26" rx="1.5" fill="hsl(214,60%,65%)"/>
    {/* Trend line */}
    <polyline points="12,26 24,18 36,12" stroke="hsl(214,80%,40%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="36" cy="12" r="2.5" fill="hsl(214,80%,40%)"/>
    {/* X axis */}
    <rect x="6" y="40" width="36" height="2" rx="1" fill="hsl(214,40%,80%)"/>
  </svg>
);

const features = [
  {
    icon: <AssetTrackingIcon />,
    title: "Asset Tracking",
    desc: "Track laptops, medical devices, printers, and more.",
  },
  {
    icon: <AssignmentIcon />,
    title: "Assignment Management",
    desc: "Assign assets to employees and monitor usage.",
  },
  {
    icon: <MaintenanceIcon />,
    title: "Maintenance Tracking",
    desc: "Record repairs and maintenance history.",
  },
  {
    icon: <ReportsIcon />,
    title: "Reports & Insights",
    desc: "View asset statistics and reports.",
  },
];

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      <Header />

      <section className="hero">
        <h1>
          Manage and Track All
          <br />
          Your Assets in One Place
        </h1>
        <div className="hero-divider" />
        <p>
          <strong>AssetPulse</strong> helps organizations track assets, monitor
          maintenance, and manage assignments efficiently.
        </p>
        <div className="hero-buttons">
          <button className="primary-btn">Get Started</button>
          <button className="secondary-btn">Login</button>
        </div>
      </section>

      <section className="features-section">
        <div className="section-line" />
        <h2>Features Section</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="spacer" />
      <Footer />
    </div>
  );
}