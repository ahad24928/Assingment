import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

const IconGear = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconStar = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
  </svg>
);

const IconPencil = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const IconInbox = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5.5 5h13l2.5 7v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2.5-7Z" />
  </svg>
);

const IconServer = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01" />
  </svg>
);

const emptyForm = {
  name: "",
  host: "",
  port: "",
  secure: false,
  user: "",
  password: "",
  fromEmail: "",
  fromName: "",
};

export default function Config() {
  const navigate = useNavigate();

  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");

  // Edit modal state
  const [editing, setEditing] = useState(null); // the config object being edited, or null
  const [editForm, setEditForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/config/smtp");
      setConfigs(res.data.userConfigs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load SMTP configurations.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    navigate("/");
  };

  // Opens the edit popup and preloads the form with the config's current values
  const handleEdit = (config) => {
    setSaveError(null);
    setEditForm({
      name: config.name || "",
      host: config.host || "",
      port: config.port || "",
      secure: !!config.secure,
      user: config.user || "",
      password: "", // never prefill password
      fromEmail: config.fromEmail || "",
      fromName: config.fromName || "",
    });
    setEditing(config);
  };

  const closeEditModal = () => {
    if (isSaving) return;
    setEditing(null);
    setEditForm(emptyForm);
    setSaveError(null);
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const payload = {
        name: editForm.name,
        host: editForm.host,
        port: Number(editForm.port),
        secure: editForm.secure,
        user: editForm.user,
        fromEmail: editForm.fromEmail,
        fromName: editForm.fromName,
      };
      // Only send password if the user actually typed a new one
      if (editForm.password) {
        payload.password = editForm.password;
      }
      await api.put(`/config/smtp/${editing.id}`, payload);
      await loadConfigs();
      setEditing(null);
      setEditForm(emptyForm);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Couldn't save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (config) => {
    if (config.isDefault) return;
    setBusyId(config.id);
    try {
      await api.post(`/config/smtp/${config.id}/default`);
      await loadConfigs();
    } catch (err) {
      alert(err.response?.data?.message || "Couldn't set this as the default configuration.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (config) => {
    if (!window.confirm(`Delete "${config.name}"? This cannot be undone.`)) return;
    setBusyId(config.id);
    try {
      await api.delete(`/config/smtp/${config.id}`);
      await loadConfigs();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const filteredConfigs = configs.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.host?.toLowerCase().includes(q) ||
      c.fromEmail?.toLowerCase().includes(q)
    );
  });

  const secureCount = configs.filter((c) => c.secure).length;
  const defaultConfig = configs.find((c) => c.isDefault);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .smtp-scope * { box-sizing: border-box; }
        .smtp-scope { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .smtp-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

        .smtp-add-btn { transition: background .15s ease, transform .1s ease; }
        .smtp-add-btn:hover { background: #4338CA; }
        .smtp-add-btn:active { transform: translateY(1px); }

        .smtp-card { transition: border-color .15s ease, box-shadow .15s ease, transform .15s ease; }
        .smtp-card:hover { border-color: #C7CAD6; box-shadow: 0 6px 20px -8px rgba(20,22,34,0.14); transform: translateY(-1px); }

        .smtp-tool-btn { transition: background .12s ease, color .12s ease; cursor: pointer; }
        .smtp-tool-btn:hover:not(:disabled) { background: #F1F2F6; }
        .smtp-tool-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .smtp-dot { display: inline-block; border-radius: 50%; flex-shrink: 0; }
        .smtp-dot-live { position: relative; }
        .smtp-dot-live::after {
          content: '';
          position: absolute; inset: 0; border-radius: 50%;
          background: inherit; opacity: 0.55;
          animation: smtp-pulse 1.8s ease-out infinite;
        }
        @keyframes smtp-pulse {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        .smtp-input { transition: border-color .12s ease, box-shadow .12s ease; }
        .smtp-input:focus { border-color: #4F46E5 !important; box-shadow: 0 0 0 3px #EEF0FF; outline: none; }

        .smtp-cancel-btn { transition: background .12s ease, border-color .12s ease; }
        .smtp-cancel-btn:hover { background: #EDEEF2; }

        .smtp-save-btn { transition: background .12s ease, transform .1s ease; }
        .smtp-save-btn:hover:not(:disabled) { background: #4338CA; }
        .smtp-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .smtp-modal-close { transition: background .12s ease, color .12s ease; }
        .smtp-modal-close:hover { background: #F1F2F6; color: #12141C; }

        .smtp-spin { animation: smtp-spin .8s linear infinite; }
        @keyframes smtp-spin { to { transform: rotate(360deg); } }

        .smtp-overlay-anim { animation: smtp-fade-in .15s ease; }
        @keyframes smtp-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .smtp-modal-anim { animation: smtp-modal-in .18s cubic-bezier(.2,.9,.3,1); }
        @keyframes smtp-modal-in { from { opacity: 0; transform: translateY(8px) scale(.98); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="smtp-scope" style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.headerIconWrap}>
                <IconGear />
              </div>
              <div>
                <div style={styles.headerTitle}>SMTP Configurations</div>
                <div style={styles.headerSubtitle}>Manage the outbound mail servers used to send messages</div>
              </div>
            </div>
            <button className="smtp-add-btn" style={styles.addBtn} onClick={handleAddNew}>
              <IconPlus />
              Add Configuration
            </button>
          </div>

          {!isLoading && !error && configs.length > 0 && (
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <div style={styles.statValue}>{configs.length}</div>
                <div style={styles.statLabel}>{configs.length === 1 ? "Server" : "Servers"}</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={{ ...styles.statValue, color: color.teal }}>{secureCount}</div>
                <div style={styles.statLabel}>Using TLS/SSL</div>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <div style={{ ...styles.statValue, fontSize: 15, color: color.indigo }}>
                  {defaultConfig ? defaultConfig.name : "None set"}
                </div>
                <div style={styles.statLabel}>Default server</div>
              </div>

              <div style={styles.searchWrap}>
                <span style={styles.searchIcon}>
                  <IconSearch />
                </span>
                <input
                  className="smtp-input"
                  style={styles.searchInput}
                  placeholder="Search by name, host, or email…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          )}

          <div style={styles.body}>
            {isLoading ? (
              <div style={styles.stateBlock}>
                <div className="smtp-spin" style={styles.spinner} />
                <p style={styles.muted}>Loading configurations…</p>
              </div>
            ) : error ? (
              <div style={styles.stateBlock}>
                <p style={styles.errorText}>{error}</p>
              </div>
            ) : configs.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIconWrap}>
                  <IconInbox />
                </div>
                <div style={styles.emptyTitle}>No SMTP configurations yet</div>
                <p style={styles.emptyText}>
                  Connect a mail server so your app can send confirmations, invites, and notifications.
                </p>
                <button className="smtp-add-btn" style={{ ...styles.addBtn, margin: "0 auto" }} onClick={handleAddNew}>
                  <IconPlus />
                  Add your first configuration
                </button>
              </div>
            ) : filteredConfigs.length === 0 ? (
              <div style={styles.stateBlock}>
                <p style={styles.muted}>No configurations match &ldquo;{query}&rdquo;.</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredConfigs.map((c) => (
                  <div
                    key={c.id}
                    className="smtp-card"
                    style={{
                      ...styles.card,
                      ...(c.isDefault ? styles.cardDefault : {}),
                    }}
                  >
                    {c.isDefault && <div style={styles.cardAccent} />}

                    <div style={styles.cardBody}>
                      <div style={styles.cardTopRow}>
                        <div style={styles.cardName}>{c.name}</div>
                        {c.isDefault && <span style={styles.defaultPill}>Default</span>}
                      </div>

                      <div style={styles.readout}>
                        <span
                          className={`smtp-dot ${c.secure ? "smtp-dot-live" : ""}`}
                          style={{
                            ...styles.readoutDot,
                            background: c.secure ? "#0E9488" : "#B45309",
                          }}
                        />
                        <span className="smtp-mono" style={styles.readoutText}>
                          {c.host}
                          <span style={styles.readoutColon}>:</span>
                          {c.port}
                        </span>
                      </div>

                      <div style={styles.sectionRow}>
                        <div style={styles.section}>
                          <div style={styles.sectionLabel}>From</div>
                          <div className="smtp-mono" style={styles.sectionValueMono}>{c.fromEmail}</div>
                        </div>
                        {c.user && (
                          <div style={styles.section}>
                            <div style={styles.sectionLabel}>Auth user</div>
                            <div className="smtp-mono" style={styles.sectionValueMono}>{c.user}</div>
                          </div>
                        )}
                      </div>

                      <span
                        style={{
                          ...styles.badge,
                          ...(c.secure ? styles.badgeSecure : styles.badgeInsecure),
                        }}
                      >
                        {c.secure ? "TLS / SSL" : "No encryption"}
                      </span>
                    </div>

                    <div style={styles.toolbar}>
                      <button
                        className="smtp-tool-btn"
                        style={{ ...styles.toolBtn, color: "#0E7490" }}
                        onClick={() => setViewing(c)}
                        title="View details"
                      >
                        <IconEye />
                      </button>
                      <button
                        className="smtp-tool-btn"
                        style={{ ...styles.toolBtn, color: c.isDefault ? "#B45309" : "#4F46E5" }}
                        onClick={() => handleSetDefault(c)}
                        disabled={busyId === c.id}
                        title={c.isDefault ? "Default configuration" : "Make default"}
                      >
                        <IconStar filled={c.isDefault} />
                      </button>
                      <button
                        className="smtp-tool-btn"
                        style={{ ...styles.toolBtn, color: "#4B5063" }}
                        onClick={() => handleEdit(c)}
                        title="Edit"
                      >
                        <IconPencil />
                      </button>
                      <button
                        className="smtp-tool-btn"
                        style={{ ...styles.toolBtn, color: "#DC2626", borderRight: "none" }}
                        onClick={() => handleDelete(c)}
                        disabled={busyId === c.id}
                        title="Delete"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isLoading && !error && configs.length > 0 && (
            <div style={styles.panelFooter}>
              <IconServer />
              <span>
                Showing {filteredConfigs.length} of {configs.length} configuration
                {configs.length === 1 ? "" : "s"}
                {query ? ` for "${query}"` : ""}
              </span>
            </div>
          )}
        </div>

        {viewing && (
          <div className="smtp-overlay-anim" style={styles.overlay} onClick={() => setViewing(null)}>
            <div className="smtp-modal-anim" style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHead}>
                <span style={styles.modalTitle}>{viewing.name}</span>
                <button className="smtp-modal-close" style={styles.modalClose} onClick={() => setViewing(null)}>
                  ✕
                </button>
              </div>
              <dl style={styles.modalGrid}>
                <div>
                  <dt style={styles.modalLabel}>Host</dt>
                  <dd className="smtp-mono" style={styles.modalValueMono}>{viewing.host}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Port</dt>
                  <dd className="smtp-mono" style={styles.modalValueMono}>{viewing.port}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Security</dt>
                  <dd style={styles.modalValue}>{viewing.secure ? "TLS/SSL Enabled" : "No TLS/SSL"}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Username</dt>
                  <dd className="smtp-mono" style={styles.modalValueMono}>{viewing.user}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>From Email</dt>
                  <dd className="smtp-mono" style={styles.modalValueMono}>{viewing.fromEmail}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>From Name</dt>
                  <dd style={styles.modalValue}>{viewing.fromName}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Default</dt>
                  <dd style={styles.modalValue}>{viewing.isDefault ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {editing && (
          <div className="smtp-overlay-anim" style={styles.overlay} onClick={closeEditModal}>
            <div className="smtp-modal-anim" style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHead}>
                <span style={styles.modalTitle}>Edit &ldquo;{editing.name}&rdquo;</span>
                <button className="smtp-modal-close" style={styles.modalClose} onClick={closeEditModal}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={styles.form}>
                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Name</label>
                  <input
                    className="smtp-input"
                    style={styles.formInput}
                    value={editForm.name}
                    onChange={(e) => handleEditFieldChange("name", e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formRowSplit}>
                  <div style={{ flex: 2 }}>
                    <label style={styles.formLabel}>Host</label>
                    <input
                      className="smtp-input smtp-mono"
                      style={styles.formInput}
                      value={editForm.host}
                      onChange={(e) => handleEditFieldChange("host", e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>Port</label>
                    <input
                      className="smtp-input smtp-mono"
                      style={styles.formInput}
                      type="number"
                      value={editForm.port}
                      onChange={(e) => handleEditFieldChange("port", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={editForm.secure}
                      onChange={(e) => handleEditFieldChange("secure", e.target.checked)}
                      style={styles.checkbox}
                    />
                    Use TLS/SSL
                  </label>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Username</label>
                  <input
                    className="smtp-input smtp-mono"
                    style={styles.formInput}
                    value={editForm.user}
                    onChange={(e) => handleEditFieldChange("user", e.target.value)}
                  />
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Password</label>
                  <input
                    className="smtp-input"
                    style={styles.formInput}
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={editForm.password}
                    onChange={(e) => handleEditFieldChange("password", e.target.value)}
                  />
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>From Email</label>
                  <input
                    className="smtp-input smtp-mono"
                    style={styles.formInput}
                    type="email"
                    value={editForm.fromEmail}
                    onChange={(e) => handleEditFieldChange("fromEmail", e.target.value)}
                    required
                  />
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>From Name</label>
                  <input
                    className="smtp-input"
                    style={styles.formInput}
                    value={editForm.fromName}
                    onChange={(e) => handleEditFieldChange("fromName", e.target.value)}
                  />
                </div>

                {saveError && <p style={styles.errorText}>{saveError}</p>}

                <div style={styles.formActions}>
                  <button
                    type="button"
                    className="smtp-cancel-btn"
                    style={styles.cancelBtn}
                    onClick={closeEditModal}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="smtp-save-btn" style={styles.saveBtn} disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

// ---- Design tokens ----
const color = {
  bg: "#F5F6F9",
  panel: "#FFFFFF",
  border: "#E4E6EC",
  borderStrong: "#D3D6DE",
  ink: "#12141C",
  inkSoft: "#6B7080",
  inkFaint: "#9CA0AD",
  indigo: "#4F46E5",
  indigoSoft: "#EEF0FF",
  teal: "#0E9488",
  tealSoft: "#E7F6F4",
  amber: "#B45309",
  amberSoft: "#FDF3E2",
  rose: "#DC2626",
};

const styles = {
  page: {
    color: color.ink,
    padding: "28px 24px",
    background: color.bg,
    minHeight: "100%",
  },
  panel: {
    background: color.panel,
    border: `1px solid ${color.border}`,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(18,20,28,0.04)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 28px",
    background: "linear-gradient(180deg, #FAFAFC 0%, #F6F7FA 100%)",
    borderBottom: `1px solid ${color.border}`,
    flexWrap: "wrap",
    gap: 16,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: color.indigoSoft,
    color: color.indigo,
    flexShrink: 0,
  },
  headerTitle: { fontSize: 19, fontWeight: 800, color: color.ink, letterSpacing: "-0.01em" },
  headerSubtitle: { fontSize: 13, color: color.inkSoft, marginTop: 2 },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: color.indigo,
    border: "none",
    borderRadius: 9,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(79,70,229,0.35)",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    padding: "16px 28px",
    borderBottom: `1px solid ${color.border}`,
    flexWrap: "wrap",
  },
  statItem: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  statValue: {
    fontSize: 18,
    fontWeight: 800,
    color: color.ink,
    letterSpacing: "-0.01em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 180,
  },
  statLabel: { fontSize: 11.5, color: color.inkSoft, fontWeight: 500 },
  statDivider: { width: 1, height: 28, background: color.border, flexShrink: 0 },
  searchWrap: {
    position: "relative",
    marginLeft: "auto",
    minWidth: 240,
    flex: "1 1 240px",
    maxWidth: 340,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: color.inkFaint,
    display: "flex",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px 9px 34px",
    fontSize: 13.5,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: 8,
    outline: "none",
    background: "#FCFCFD",
    color: color.ink,
  },
  body: { padding: "26px 28px" },
  stateBlock: {
    padding: "40px 0",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  spinner: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: `2.5px solid ${color.border}`,
    borderTopColor: color.indigo,
  },
  emptyState: {
    padding: "48px 20px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: color.indigoSoft,
    color: color.indigo,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: color.ink, marginBottom: 6 },
  emptyText: { fontSize: 13.5, color: color.inkSoft, maxWidth: 340, margin: "0 0 22px", lineHeight: 1.5 },
  muted: { color: color.inkSoft, fontSize: 14, margin: 0 },
  errorText: { color: color.rose, fontSize: 14, margin: 0 },
  panelFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 28px",
    borderTop: `1px solid ${color.border}`,
    background: "#FAFAFC",
    color: color.inkFaint,
    fontSize: 12.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 340px))",
    gap: 20,
  },
  card: {
    position: "relative",
    border: `1px solid ${color.border}`,
    borderRadius: 12,
    background: color.panel,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  cardDefault: {
    borderColor: "#D9D6FB",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: "linear-gradient(90deg, #4F46E5, #7C74F0)",
  },
  cardBody: { padding: "20px 20px 18px" },
  cardTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 700,
    color: color.ink,
    letterSpacing: "-0.01em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  defaultPill: {
    fontSize: 11,
    fontWeight: 700,
    color: color.indigo,
    background: color.indigoSoft,
    padding: "3px 9px",
    borderRadius: 999,
    flexShrink: 0,
  },
  readout: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    background: "#F8F8FB",
    border: `1px solid ${color.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    marginBottom: 16,
  },
  readoutDot: {
    width: 7,
    height: 7,
  },
  readoutText: {
    fontSize: 13,
    fontWeight: 500,
    color: color.ink,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  readoutColon: { color: color.inkFaint, margin: "0 1px" },
  sectionRow: { display: "flex", gap: 16, marginBottom: 2 },
  section: { marginBottom: 14, minWidth: 0, flex: 1 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: color.inkFaint,
    marginBottom: 4,
  },
  sectionValueMono: {
    fontSize: 13,
    fontWeight: 500,
    color: color.ink,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  badge: {
    display: "inline-block",
    fontSize: 11.5,
    fontWeight: 700,
    padding: "4px 11px",
    borderRadius: 999,
    letterSpacing: "0.01em",
  },
  badgeInsecure: { background: color.amberSoft, color: color.amber },
  badgeSecure: { background: color.tealSoft, color: color.teal },
  toolbar: {
    display: "flex",
    borderTop: `1px solid ${color.border}`,
    background: "#FBFBFD",
  },
  toolBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 0",
    background: "transparent",
    border: "none",
    borderRight: `1px solid ${color.border}`,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,17,26,0.5)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: color.panel,
    borderRadius: 14,
    width: "min(480px, 100%)",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: 26,
    boxShadow: "0 24px 60px -12px rgba(15,17,26,0.35)",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: 800, color: color.ink, letterSpacing: "-0.01em" },
  modalClose: {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    border: "none",
    background: "transparent",
    fontSize: 14,
    cursor: "pointer",
    color: color.inkSoft,
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    margin: 0,
  },
  modalLabel: {
    fontSize: 10.5,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: color.inkFaint,
    fontWeight: 700,
  },
  modalValue: { fontSize: 14, margin: "3px 0 0", color: color.ink, fontWeight: 500, wordBreak: "break-all" },
  modalValueMono: { fontSize: 13.5, margin: "3px 0 0", color: color.ink, fontWeight: 500, wordBreak: "break-all" },

  form: { display: "flex", flexDirection: "column", gap: 14 },
  formRow: { display: "flex", flexDirection: "column", gap: 6 },
  formRowSplit: { display: "flex", gap: 12 },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#374151" },
  formInput: {
    padding: "10px 12px",
    fontSize: 14,
    border: `1px solid ${color.borderStrong}`,
    borderRadius: 8,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    background: "#FCFCFD",
    color: color.ink,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  checkbox: { width: 15, height: 15, accentColor: color.indigo, cursor: "pointer" },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },
  cancelBtn: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    background: "#F3F4F6",
    border: `1px solid ${color.borderStrong}`,
    borderRadius: 8,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: color.indigo,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(79,70,229,0.35)",
  },
};
