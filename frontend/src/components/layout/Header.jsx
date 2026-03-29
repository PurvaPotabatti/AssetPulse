export default function Header() {
  return (
    <header className="header">
      <div className="logo">
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
        AssetPulse
      </div>
      <div className="nav-buttons">
        <button className="login-btn">Login</button>
        <button className="primary-btn">Get Started</button>
      </div>
    </header>
  );
}