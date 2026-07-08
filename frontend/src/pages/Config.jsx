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
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconStar = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
  </svg>
);

const IconPencil = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
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

  return (
    <Layout>
      <div style={styles.page}>
        <div style={styles.panel}>
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <IconGear />
              <span style={styles.headerTitle}>My SMTP Configurations</span>
            </div>
            <button style={styles.addBtn} onClick={handleAddNew}>
              <IconPlus />
              Add New Configuration
            </button>
          </div>

          <div style={styles.body}>
            {isLoading ? (
              <p style={styles.muted}>Loading configurations…</p>
            ) : error ? (
              <p style={styles.errorText}>{error}</p>
            ) : configs.length === 0 ? (
              <p style={styles.muted}>No SMTP configurations yet. Add one to get started.</p>
            ) : (
              <div style={styles.grid}>
                {configs.map((c) => (
                  <div key={c.id} style={styles.card}>
                    <div style={styles.cardBody}>
                      <div style={styles.cardName}>{c.name}</div>

                      <div style={styles.section}>
                        <div style={styles.sectionLabel}>SMTP Server</div>
                        <div style={styles.sectionValue}>
                          {c.host}:{c.port}
                        </div>
                      </div>

                      <div style={styles.section}>
                        <div style={styles.sectionLabel}>From Email</div>
                        <div style={styles.sectionValue}>{c.fromEmail}</div>
                      </div>

                      <div style={styles.section}>
                        <div style={styles.sectionLabel}>Security</div>
                        <span
                          style={{
                            ...styles.badge,
                            ...(c.secure ? styles.badgeSecure : styles.badgeInsecure),
                          }}
                        >
                          {c.secure ? "TLS/SSL Enabled" : "No TLS/SSL"}
                        </span>
                      </div>
                    </div>

                    <div style={styles.toolbar}>
                      <button
                        style={{ ...styles.toolBtn, ...styles.toolBtnView }}
                        onClick={() => setViewing(c)}
                        title="View"
                      >
                        <IconEye />
                      </button>
                      <button
                        style={{
                          ...styles.toolBtn,
                          ...styles.toolBtnStar,
                          ...(c.isDefault ? styles.toolBtnStarActive : {}),
                        }}
                        onClick={() => handleSetDefault(c)}
                        disabled={busyId === c.id}
                        title={c.isDefault ? "Default configuration" : "Make default"}
                      >
                        <IconStar filled={c.isDefault} />
                      </button>
                      <button
                        style={{ ...styles.toolBtn, ...styles.toolBtnEdit }}
                        onClick={() => handleEdit(c)}
                        title="Edit"
                      >
                        <IconPencil />
                      </button>
                      <button
                        style={{ ...styles.toolBtn, ...styles.toolBtnDelete }}
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
        </div>

        {viewing && (
          <div style={styles.overlay} onClick={() => setViewing(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHead}>
                <span style={styles.modalTitle}>{viewing.name}</span>
                <button style={styles.modalClose} onClick={() => setViewing(null)}>
                  ✕
                </button>
              </div>
              <dl style={styles.modalGrid}>
                <div>
                  <dt style={styles.modalLabel}>Host</dt>
                  <dd style={styles.modalValue}>{viewing.host}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Port</dt>
                  <dd style={styles.modalValue}>{viewing.port}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Security</dt>
                  <dd style={styles.modalValue}>{viewing.secure ? "TLS/SSL Enabled" : "No TLS/SSL"}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>Username</dt>
                  <dd style={styles.modalValue}>{viewing.user}</dd>
                </div>
                <div>
                  <dt style={styles.modalLabel}>From Email</dt>
                  <dd style={styles.modalValue}>{viewing.fromEmail}</dd>
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
          <div style={styles.overlay} onClick={closeEditModal}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHead}>
                <span style={styles.modalTitle}>Edit "{editing.name}"</span>
                <button style={styles.modalClose} onClick={closeEditModal}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={styles.form}>
                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Name</label>
                  <input
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
                      style={styles.formInput}
                      value={editForm.host}
                      onChange={(e) => handleEditFieldChange("host", e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.formLabel}>Port</label>
                    <input
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
                    />
                    Use TLS/SSL
                  </label>
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Username</label>
                  <input
                    style={styles.formInput}
                    value={editForm.user}
                    onChange={(e) => handleEditFieldChange("user", e.target.value)}
                  />
                </div>

                <div style={styles.formRow}>
                  <label style={styles.formLabel}>Password</label>
                  <input
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
                    style={styles.formInput}
                    value={editForm.fromName}
                    onChange={(e) => handleEditFieldChange("fromName", e.target.value)}
                  />
                </div>

                {saveError && <p style={styles.errorText}>{saveError}</p>}

                <div style={styles.formActions}>
                  <button
                    type="button"
                    style={styles.cancelBtn}
                    onClick={closeEditModal}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button type="submit" style={styles.saveBtn} disabled={isSaving}>
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

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1a1a1a",
    padding: "20px",
  },
  panel: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    background: "#f8f9fb",
    borderBottom: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: 12,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: 700, color: "#1f2937" },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#2563eb",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  body: { padding: "24px" },
  muted: { color: "#6b7280", fontSize: 14 },
  errorText: { color: "#dc2626", fontSize: 14 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 320px))",
    gap: 20,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  cardBody: { padding: "20px" },
  cardName: { fontSize: 17, fontWeight: 700, color: "#111827", marginBottom: 14 },
  section: { marginBottom: 14 },
  sectionLabel: { fontSize: 13, color: "#9ca3af", marginBottom: 3 },
  sectionValue: { fontSize: 15, fontWeight: 700, color: "#111827" },
  badge: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 6,
  },
  badgeInsecure: { background: "#f5a524" },
  badgeSecure: { background: "#16a34a" },
  toolbar: {
    display: "flex",
    borderTop: "1px solid #e5e7eb",
  },
  toolBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0",
    background: "#fff",
    border: "none",
    borderRight: "1px solid #e5e7eb",
    borderTop: "1px solid transparent",
    cursor: "pointer",
    color: "#374151",
  },
  toolBtnView: { color: "#06b6d4", borderTop: "2px solid #06b6d4" },
  toolBtnStar: { color: "#2563eb", borderTop: "2px solid #2563eb" },
  toolBtnStarActive: { color: "#f5a524" },
  toolBtnEdit: { color: "#6b7280", borderTop: "2px solid transparent" },
  toolBtnDelete: { color: "#dc2626", borderTop: "2px solid #dc2626", borderRight: "none" },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    width: "min(460px, 90vw)",
    maxHeight: "85vh",
    overflowY: "auto",
    padding: 24,
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: 700 },
  modalClose: {
    border: "none",
    background: "transparent",
    fontSize: 16,
    cursor: "pointer",
    color: "#6b7280",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    margin: 0,
  },
  modalLabel: { fontSize: 11, textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 },
  modalValue: { fontSize: 14, margin: "2px 0 0", color: "#111827", wordBreak: "break-all" },

  form: { display: "flex", flexDirection: "column", gap: 14 },
  formRow: { display: "flex", flexDirection: "column", gap: 6 },
  formRowSplit: { display: "flex", gap: 12 },
  formLabel: { fontSize: 12, fontWeight: 600, color: "#374151" },
  formInput: {
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#2563eb",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
