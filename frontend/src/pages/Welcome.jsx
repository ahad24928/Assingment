import { useEffect, useState } from "react";
import "./Welcome.css";

const QUOTES = [
  {
    text: "A reliable outbound pipeline is invisible when it works—and it should stay that way.",
    author: "SMTP Best Practices",
  },
  {
    text: "Deliverability isn't luck. It's authentication, reputation, and pacing done right.",
    author: "Email Infrastructure Notes",
  },
  {
    text: "Every email you send reflects the reliability of your infrastructure.",
    author: "Professional Communication",
  },
  {
    text: "Good email systems focus on trust before volume.",
    author: "Email Operations",
  },
];

const TIPS = [
  "Warm up new SMTP accounts before high-volume sending.",
  "Always use App Passwords when 2FA is enabled.",
  "Maintain delays to improve deliverability.",
  "Monitor bounce and spam complaint rates.",
  "Use a consistent From Name and Reply-To address.",
];

export default function Welcome({ user }) {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const quote = QUOTES[quoteIndex];

  return (
    <div className="welcome-card">

      {/* Header */}

      <div className="welcome-header">

        <div>

          <h3>
            Welcome back
            {user?.name ? `, ${user.name}` : ""}
          </h3>

          <p>Email campaign management dashboard</p>

        </div>

        <span className="status-badge">
          ● System Ready
        </span>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">
          <h4>SMTP</h4>
          <span>Configured</span>
        </div>

        <div className="stat-card">
          <h4>Security</h4>
          <span>Protected</span>
        </div>

      </div>

      {/* Quote */}

      <div className="quote-box" key={quoteIndex}>

        <div className="quote-mark">"</div>

        <p>{quote.text}</p>

        <span>— {quote.author}</span>

      </div>

      {/* Tips */}

      <div className="tips">

        <h5>Best Practices</h5>

        {TIPS.map((tip, index) => (

          <div className="tip" key={index}>

            <div className="tip-number">
              {index + 1}
            </div>

            <span>{tip}</span>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="welcome-footer">

        <div>

          <strong>Recommendation</strong>

          <p>
            Test your SMTP configuration before launching large campaigns to
            improve reliability and reduce delivery failures.
          </p>

        </div>

      </div>

    </div>
  );
}