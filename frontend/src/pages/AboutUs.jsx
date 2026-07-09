import "./AboutUs.css";

const features = [
  {
    title: "Secure SMTP",
    text: "Connect Gmail, Outlook, Zoho or any custom SMTP server using your own credentials.",
    icon: "📧",
  },
  {
    title: "Bulk Campaigns",
    text: "Upload Excel contact lists and send personalized emails using dynamic placeholders.",
    icon: "🚀",
  },
  {
    title: "Scheduling",
    text: "Schedule campaigns, configure batch sending, and control email delivery rates.",
    icon: "⏰",
  },
  {
    title: "Reports",
    text: "Monitor delivery status, view campaign history, and export email logs.",
    icon: "📊",
  },
];

export default function AboutUs() {
  return (
    <div className="au-page">
      <section className="au-section">
        <div className="au-mission">
          <span className="au-mission-eyebrow">
            Bulk Email Sender Platform
          </span>

          <h2 className="au-mission-title">
            Powerful email campaigns with complete control.
          </h2>

          <p className="au-mission-text">
            Bulk Email Sender is designed for businesses and teams that want to
            send professional email campaigns using their own SMTP provider.
            Upload contacts, compose rich HTML emails, schedule campaigns,
            monitor delivery progress, and manage everything from one dashboard.
          </p>

          <div className="au-highlight">
            ✔ Your SMTP credentials remain under your control.
            <br />
            ✔ Every campaign is logged for tracking and reporting.
            <br />
            ✔ Supports immediate, batch, and scheduled email delivery.
          </div>
        </div>
      </section>

      <section className="au-section">
        <div className="au-feature-grid">
          {features.map((item) => (
            <div className="au-feature-card" key={item.title}>
              <div className="au-feature-icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="au-section">
        <div className="au-mission">
          <span className="au-mission-eyebrow">Usage Policy</span>

          <h2 className="au-mission-title">
            Responsible email communication.
          </h2>

          <ul className="au-policy-list">
            <li>Send emails only to recipients who have given permission.</li>

            <li>
              Comply with applicable privacy and anti-spam regulations.
            </li>

            <li>
              SMTP credentials are securely stored and associated only with your
              account.
            </li>

            <li>
              Campaign logs can be reviewed, exported, or cleared whenever
              required.
            </li>

            <li>
              Spam, phishing, or abusive email activity is strictly prohibited.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}