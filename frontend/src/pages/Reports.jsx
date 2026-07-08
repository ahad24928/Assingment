import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import "./Reports.css";

const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" />
  </svg>
);

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await api.get("/report");

      setLogs(res.data.data.logs);
      setStats(res.data.data.stats);
    } catch (err) {
      alert("Failed to load reports");
    }
  };

  const clearLogs = async () => {
    if (!window.confirm("Clear all logs?")) return;

    await api.delete("/report/clear");

    loadReports();
  };

  const exportCSV = () => {
    window.open("http://localhost:3000/report/export/csv");
  };

  const exportJSON = () => {
    window.open("http://localhost:3000/report/export/json");
  };

  return (
    <Layout>
      <div className="rp-page">
        <div className="rp-header">
          <div>
            <h1 className="rp-title">Email Reports</h1>
            <p className="rp-subtitle">Track delivery status across every campaign you've sent</p>
          </div>

          <div className="rp-actions">
            <button type="button" className="rp-btn" onClick={exportCSV}>
              <IconDownload /> Export CSV
            </button>
            <button type="button" className="rp-btn" onClick={exportJSON}>
              <IconDownload /> Export JSON
            </button>
            <button type="button" className="rp-btn rp-btn-danger" onClick={clearLogs}>
              <IconTrash /> Clear Logs
            </button>
          </div>
        </div>

        {stats && (
          <div className="rp-stats">
            <div className="rp-stat-card rp-stat-total">
              <span className="rp-stat-label">Total</span>
              <span className="rp-stat-value">{stats.total}</span>
            </div>

            <div className="rp-stat-card rp-stat-sent">
              <span className="rp-stat-label">Sent</span>
              <span className="rp-stat-value">{stats.sent}</span>
            </div>

            <div className="rp-stat-card rp-stat-failed">
              <span className="rp-stat-label">Failed</span>
              <span className="rp-stat-value">{stats.failed}</span>
            </div>
          </div>
        )}

        <div className="rp-table-card">
          <table className="rp-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Message</th>
                <th>Subject</th>
                <th>Company</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="rp-empty">
                    No email logs found
                  </td>
                </tr>
              )}

              {logs.map((log) => (
                <tr key={log.id}>
                  <td>{log.email}</td>

                  <td>
                    <span
                      className={`rp-status-pill ${
                        log.status === "Sent" ? "rp-status-sent" : "rp-status-failed"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="rp-cell-muted">{log.message}</td>
                  <td>{log.subject}</td>
                  <td>{log.company}</td>
                  <td className="rp-cell-muted">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
