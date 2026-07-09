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
const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0 1 15.4-6.3L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.4 6.3L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
const IconInboxEmpty = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5.5 5h13l2.5 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2.5-7Z" />
  </svg>
);

export default function Reports() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/report");

      setLogs(res.data.data.logs);
      setStats(res.data.data.stats);
    } catch (err) {
      alert("Failed to load reports");
    } finally {
      setIsLoading(false);
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

  const successRate =
    stats && stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : null;

  const filteredLogs = logs.filter((log) => {
    if (statusFilter !== "all" && log.status !== statusFilter) return false;

    const q = query.trim().toLowerCase();
    if (!q) return true;

    return (
      log.email?.toLowerCase().includes(q) ||
      log.subject?.toLowerCase().includes(q) ||
      log.company?.toLowerCase().includes(q)
    );
  });

  return (
    <Layout>
      <div className="rp-page">
        {/* ---------- Banner ---------- */}
        <div className="rp-banner">
          <div className="rp-banner-glow" />

          <div className="rp-banner-top">
            <div>
              <h1 className="rp-title">Email Reports</h1>
              <p className="rp-subtitle">Track delivery status across every campaign you've sent</p>
            </div>

            <div className="rp-actions">
              <button type="button" className="rp-btn rp-btn-ghost" onClick={loadReports}>
                <IconRefresh /> Refresh
              </button>
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

          {successRate !== null && (
            <div className="rp-banner-bottom">
              <div className="rp-rate-block">
                <span className="rp-rate-value">{successRate}%</span>
                <span className="rp-rate-label">delivered successfully</span>
              </div>
              <div className="rp-rate-track">
                <div className="rp-rate-fill" style={{ width: `${successRate}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* ---------- Stats ---------- */}
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

            <div className="rp-stat-card rp-stat-rate">
              <span className="rp-stat-label">Success rate</span>
              <span className="rp-stat-value">{successRate !== null ? `${successRate}%` : "—"}</span>
            </div>
          </div>
        )}

        {/* ---------- Table ---------- */}
        <div className="rp-table-card">
          <div className="rp-table-toolbar">
            <div className="rp-search-box">
              <IconSearch />
              <input
                type="text"
                placeholder="Search by email, subject, or company…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="rp-filter-tabs">
              {["all", "Sent", "Failed"].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`rp-filter-tab ${statusFilter === f ? "rp-filter-tab-active" : ""}`}
                  onClick={() => setStatusFilter(f)}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          {/* NEW: scroll wrapper so table scrolls horizontally on small screens
              instead of being clipped by rp-table-card's overflow:hidden */}
          <div className="rp-table-scroll">
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
                {isLoading && (
                  <tr>
                    <td colSpan="6" className="rp-empty">
                      Loading reports…
                    </td>
                  </tr>
                )}

                {!isLoading && logs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="rp-empty">
                      <div className="rp-empty-block">
                        <span className="rp-empty-icon">
                          <IconInboxEmpty />
                        </span>
                        <div className="rp-empty-title">No email logs found</div>
                        <div className="rp-empty-text">Sent campaigns will show up here as delivery events come in.</div>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading && logs.length > 0 && filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="6" className="rp-empty">
                      No logs match your search.
                    </td>
                  </tr>
                )}

                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="rp-cell-mono">{log.email}</td>

                    <td>
                      <span
                        className={`rp-status-pill ${
                          log.status === "Sent" ? "rp-status-sent" : "rp-status-failed"
                        }`}
                      >
                        <span className="rp-status-dot" />
                        {log.status}
                      </span>
                    </td>

                    <td className="rp-cell-muted">{log.message}</td>
                    <td>{log.subject}</td>
                    <td>{log.company}</td>
                    <td className="rp-cell-muted rp-cell-mono">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoading && logs.length > 0 && (
            <div className="rp-table-footer">
              Showing {filteredLogs.length} of {logs.length} log{logs.length === 1 ? "" : "s"}
              {query ? ` for "${query}"` : ""}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}