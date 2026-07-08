import { Link } from "react-router-dom";
import "./Footer.css";



const IconMail = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
    <path d="M12 21s-7-4.35-9.33-8.28C.64 9.45 2.44 5 6.64 5c2.06 0 3.44 1.22 4.36 2.53C11.92 6.22 13.3 5 15.36 5c4.2 0 6 4.45 3.97 7.72C19 16.65 12 21 12 21z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-inner">

        <div className="ft-top">

          <div className="ft-brand">

            <div className="ft-brand-icon">
              <IconMail />
            </div>

            <div>
              <div className="ft-title">Bulk Email Sender</div>

              <div className="ft-subtitle">
                Professional SMTP Configuration & Email Delivery Platform
              </div>
            </div>

          </div>

          <div className="ft-links">

            <Link to="/">Compose</Link>

            <Link to="/reports">Reports</Link>

            <Link to="/myconfig">My Configs</Link>

            <Link to="/configs">SMTP Config</Link>

          </div>

        </div>

        <div className="ft-divider" />

        <div className="ft-bottom">

          <div className="ft-status">
            <span className="ft-dot"></span>
            System Operational
          </div>

          <div className="ft-copy">
            © {new Date().getFullYear()} Bulk Email Sender • Built with
            <span className="ft-heart">
              <IconHeart />
            </span>
           
          </div>

          <div className="ft-version">
            Version 1.0.0
          </div>

        </div>

      </div>
    </footer>
  );
}