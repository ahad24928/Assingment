import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

const EMPTY_FORM = {
  name: "",
  host: "",
  port: 587,
  secure: false,
  user: "",
  pass: "",
  fromEmail: "",
  fromName: "",
  isDefault: false,
};

const REQUIRED_FIELDS = ["name", "host", "user", "fromEmail", "fromName"];

function validate(form, isEditing) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (!String(form[field]).trim()) errors[field] = "Required";
  });

  if (!isEditing && !form.pass.trim()) {
    errors.pass = "Required";
  }

  if (form.fromEmail && !/^\S+@\S+\.\S+$/.test(form.fromEmail)) {
    errors.fromEmail = "Enter a valid email address";
  }

  if (!form.port || form.port < 1 || form.port > 65535) {
    errors.port = "Enter a port between 1 and 65535";
  }

  return errors;
}

export default function SMTPConfig() {
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: "success" | "error", message }

  // --- Edit modal state ---
  const [editing, setEditing] = useState(null); // the config object being edited, or null
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editErrors, setEditErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    loadConfigs();
  }, []);

  // Auto-dismiss the banner after a few seconds so it doesn't linger forever.
  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), banner.type === "error" ? 6000 : 4000);
    return () => clearTimeout(timer);
  }, [banner]);

  const loadConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/config/smtp");
      setConfigs(res.data.userConfigs || []);
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || "Unable to load SMTP configurations.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowPassword(false);
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form, Boolean(editingId));
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setBanner(null);

    try {
      const payload = { ...form };
      // Don't overwrite a stored password with an empty value on update.
      if (editingId && !payload.pass) delete payload.pass;

      if (editingId) {
        await api.put(`/config/smtp/${editingId}`, payload);
        setBanner({ type: "success", message: "SMTP configuration updated." });
      } else {
        await api.post("/config/smtp", payload);
        setBanner({ type: "success", message: "SMTP configuration saved." });
      }

      await loadConfigs();
      resetForm();
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Edit modal handlers ---

  const handleEdit = (config) => {
    setSaveError("");
    setEditErrors({});
    setEditForm({
      name: config.name || "",
      host: config.host || "",
      port: config.port || "",
      secure: !!config.secure,
      user: config.user || "",
      pass: "", // never prefill password
      fromEmail: config.fromEmail || "",
      fromName: config.fromName || "",
      isDefault: !!config.isDefault,
    });
    setEditing(config);
  };

  const closeEditModal = () => {
    setEditing(null);
    setEditForm(EMPTY_FORM);
    setEditErrors({});
    setSaveError("");
  };

  const handleEditFieldChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editErrors[field]) setEditErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editing) return;

    const validationErrors = validate(editForm, true);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }

    setSaveError("");
    setIsSaving(true);

    try {
      const payload = { ...editForm };
      // Don't overwrite the stored password with an empty value.
      if (!payload.pass) delete payload.pass;

      const wasDefault = !!editing.isDefault;
      delete payload.isDefault; // default status is set via its own endpoint below

      await api.put(`/config/smtp/${editing.id}`, payload);

      // If the user just checked "Set as default", flip it via the dedicated endpoint.
      if (editForm.isDefault && !wasDefault) {
        await api.post(`/config/smtp/${editing.id}/default`);
      }

      setBanner({ type: "success", message: "SMTP configuration updated." });
      await loadConfigs();
      closeEditModal();
    } catch (err) {
      setSaveError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteConfig = async (id) => {
    if (!window.confirm("Delete this SMTP configuration? This cannot be undone.")) return;

    try {
      await api.delete(`/config/smtp/${id}`);
      if (editingId === id) resetForm();
      await loadConfigs();
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || "Delete failed. Please try again.",
      });
    }
  };

  const setDefault = async (id) => {
    try {
      await api.post(`/config/smtp/${id}/default`);
      await loadConfigs();
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || "Couldn't set this as the default configuration.",
      });
    }
  };

  const testConnection = async () => {
    const validationErrors = validate(form, Boolean(editingId));
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsTesting(true);
    setBanner(null);

    try {
      const res = await api.post("/config/smtp/test", form);
      setBanner({ type: "success", message: res.data.message || "Connection successful." });
    } catch (err) {
      setBanner({
        type: "error",
        message: err.response?.data?.message || "Connection failed.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes smtpBannerFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={styles.page}>
        <header style={styles.header}>
          <h1 style={styles.title}>SMTP Configuration</h1>
          <p style={styles.subtitle}>
            Manage the outgoing mail servers used to send email from your account.
          </p>
        </header>

        {banner && (
          <div
            style={{
              ...styles.banner,
              ...(banner.type === "success" ? styles.bannerSuccess : styles.bannerError),
            }}
            role="status"
          >
            <span>{banner.message}</span>
            <button
              type="button"
              onClick={() => setBanner(null)}
              style={styles.bannerClose}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            {editingId ? "Edit Configuration" : "Add a New Configuration"}
          </h2>

          <form onSubmit={submit} noValidate>
            <div style={styles.grid}>
              <Field label="Configuration Name" error={errors.name}>
                <input
                  style={styles.input}
                  placeholder="e.g. Primary Transactional"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </Field>

              <Field label="SMTP Host" error={errors.host}>
                <input
                  style={styles.input}
                  placeholder="smtp.example.com"
                  value={form.host}
                  onChange={(e) => updateField("host", e.target.value)}
                />
              </Field>

              <Field label="Port" error={errors.port}>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  max="65535"
                  value={form.port}
                  onChange={(e) => updateField("port", Number(e.target.value))}
                />
              </Field>

              <Field label="Security">
                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={form.secure}
                    onChange={(e) => updateField("secure", e.target.checked)}
                  />
                  <span>Use SSL / TLS</span>
                </label>
              </Field>

              <Field label="SMTP Username" error={errors.user}>
                <input
                  style={styles.input}
                  placeholder="username@example.com"
                  value={form.user}
                  onChange={(e) => updateField("user", e.target.value)}
                />
              </Field>

              <Field
                label="Password"
                error={errors.pass}
                hint={editingId ? "Leave blank to keep the current password" : undefined}
              >
                <div style={styles.passwordRow}>
                  <input
                    style={styles.input}
                    type={showPassword ? "text" : "password"}
                    placeholder={editingId ? "••••••••" : "Password"}
                    value={form.pass}
                    onChange={(e) => updateField("pass", e.target.value)}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    style={styles.ghostButton}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              <Field label="From Email" error={errors.fromEmail}>
                <input
                  style={styles.input}
                  placeholder="no-reply@example.com"
                  value={form.fromEmail}
                  onChange={(e) => updateField("fromEmail", e.target.value)}
                />
              </Field>

              <Field label="From Name" error={errors.fromName}>
                <input
                  style={styles.input}
                  placeholder="Your Company"
                  value={form.fromName}
                  onChange={(e) => updateField("fromName", e.target.value)}
                />
              </Field>
            </div>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => updateField("isDefault", e.target.checked)}
              />
              <span>Set as default configuration</span>
            </label>

            <div style={styles.actions}>
              <button type="submit" style={styles.primaryButton} disabled={isSaving}>
                {isSaving ? "Saving…" : editingId ? "Update Configuration" : "Save Configuration"}
              </button>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting ? "Testing…" : "Test Connection"}
              </button>

              {editingId && (
                <button type="button" style={styles.ghostButton} onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section>
          <h2 style={styles.sectionTitle}>Saved Configurations</h2>

          {isLoading ? (
            <p style={styles.muted}>Loading configurations…</p>
          ) : configs.length === 0 ? (
            <p style={styles.muted}>No SMTP configurations yet. Add one above to get started.</p>
          ) : (
            <div style={styles.list}>
              {configs.map((c) => (
                <div key={c.id} style={styles.configCard}>
                  <div style={styles.configHeader}>
                    <h3 style={styles.configName}>{c.name}</h3>
                    <span
                      style={{
                        ...styles.badge,
                        ...(c.isDefault ? styles.badgeDefault : styles.badgeSecondary),
                      }}
                    >
                      {c.isDefault ? "Default" : "Secondary"}
                    </span>
                  </div>

                  <dl style={styles.detailGrid}>
                    <div>
                      <dt style={styles.detailLabel}>Host</dt>
                      <dd style={styles.detailValue}>
                        {c.host}:{c.port}
                      </dd>
                    </div>
                    <div>
                      <dt style={styles.detailLabel}>Username</dt>
                      <dd style={styles.detailValue}>{c.user}</dd>
                    </div>
                    <div>
                      <dt style={styles.detailLabel}>From</dt>
                      <dd style={styles.detailValue}>{c.fromEmail}</dd>
                    </div>
                  </dl>

                  <div style={styles.configActions}>
                    <button
                      style={{ ...styles.toolBtn, ...styles.toolBtnEdit }}
                      onClick={() => handleEdit(c)}
                      title="Edit"
                    >
                      <IconPencil />
                      <span>Edit</span>
                    </button>
                    <button style={styles.dangerButton} onClick={() => deleteConfig(c.id)}>
                      Delete
                    </button>
                    {!c.isDefault && (
                      <button style={styles.ghostButton} onClick={() => setDefault(c.id)}>
                        Make Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {editing && (
            <div style={styles.overlay} onClick={closeEditModal}>
              <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHead}>
                  <span style={styles.modalTitle}>Edit "{editing.name}"</span>
                  <button style={styles.modalClose} onClick={closeEditModal} type="button">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} style={styles.form} noValidate>
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Name</label>
                    <input
                      style={styles.formInput}
                      value={editForm.name}
                      onChange={(e) => handleEditFieldChange("name", e.target.value)}
                    />
                    {editErrors.name && <span style={styles.errorText}>{editErrors.name}</span>}
                  </div>

                  <div style={styles.formRowSplit}>
                    <div style={{ flex: 2 }}>
                      <label style={styles.formLabel}>Host</label>
                      <input
                        style={styles.formInput}
                        value={editForm.host}
                        onChange={(e) => handleEditFieldChange("host", e.target.value)}
                      />
                      {editErrors.host && <span style={styles.errorText}>{editErrors.host}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={styles.formLabel}>Port</label>
                      <input
                        style={styles.formInput}
                        type="number"
                        value={editForm.port}
                        onChange={(e) => handleEditFieldChange("port", Number(e.target.value))}
                      />
                      {editErrors.port && <span style={styles.errorText}>{editErrors.port}</span>}
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
                    {editErrors.user && <span style={styles.errorText}>{editErrors.user}</span>}
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Password</label>
                    <input
                      style={styles.formInput}
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={editForm.pass}
                      onChange={(e) => handleEditFieldChange("pass", e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>From Email</label>
                    <input
                      style={styles.formInput}
                      type="email"
                      value={editForm.fromEmail}
                      onChange={(e) => handleEditFieldChange("fromEmail", e.target.value)}
                    />
                    {editErrors.fromEmail && (
                      <span style={styles.errorText}>{editErrors.fromEmail}</span>
                    )}
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>From Name</label>
                    <input
                      style={styles.formInput}
                      value={editForm.fromName}
                      onChange={(e) => handleEditFieldChange("fromName", e.target.value)}
                    />
                    {editErrors.fromName && (
                      <span style={styles.errorText}>{editErrors.fromName}</span>
                    )}
                  </div>

                  <div style={styles.formRow}>
                    <label style={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={editForm.isDefault}
                        disabled={!!editing.isDefault}
                        onChange={(e) => handleEditFieldChange("isDefault", e.target.checked)}
                      />
                      {editing.isDefault
                        ? "This is already the default configuration"
                        : "Set as default configuration"}
                    </label>
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
        </section>
      </div>
    </>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {hint && !error && <span style={styles.hint}>{hint}</span>}
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

function IconPencil() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

const styles = {
  page: {
    maxWidth: 880,
    margin: "0 auto",
    padding: "32px 20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: "#1a1a1a",
  },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 14, color: "#6b7280", marginTop: 6 },
  banner: {
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    animation: "smtpBannerFadeIn 0.2s ease-out",
  },
  bannerClose: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    lineHeight: 1,
    color: "inherit",
    opacity: 0.6,
    padding: 2,
    flexShrink: 0,
  },
  bannerSuccess: { background: "#ecfdf5", color: "#065f46", borderColor: "#a7f3d0" },
  bannerError: { background: "#fef2f2", color: "#991b1b", borderColor: "#fecaca" },
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: "0 0 16px" },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 12 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  passwordRow: { display: "flex", gap: 8 },
  hint: { fontSize: 12, color: "#6b7280" },
  errorText: { fontSize: 12, color: "#dc2626" },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    margin: "4px 0 16px",
  },
  actions: { display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" },
  primaryButton: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#2563eb",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#111827",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
  },
  ghostButton: {
    padding: "9px 14px",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 8,
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#b91c1c",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 8,
    cursor: "pointer",
  },
  muted: { color: "#6b7280", fontSize: 14 },
  list: { display: "flex", flexDirection: "column", gap: 14 },
  configCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 18,
    background: "#fff",
  },
  configHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  configName: { fontSize: 16, fontWeight: 600, margin: 0 },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 999,
  },
  badgeDefault: { background: "#e0f2fe", color: "#075985" },
  badgeSecondary: { background: "#f3f4f6", color: "#4b5563" },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
    margin: "0 0 14px",
  },
  detailLabel: { fontSize: 11, textTransform: "uppercase", color: "#9ca3af", fontWeight: 600 },
  detailValue: { fontSize: 14, margin: "2px 0 0", color: "#111827" },
  configActions: { display: "flex", gap: 8, flexWrap: "wrap" },

  // --- Edit tool button (in card actions) ---
  toolBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 14px",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 8,
    cursor: "pointer",
  },
  toolBtnEdit: {
    color: "#1d4ed8",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  },

  // --- Edit modal ---
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 24, 39, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
  },
  modalHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: { fontSize: 16, fontWeight: 600, color: "#111827" },
  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: 16,
    color: "#6b7280",
    cursor: "pointer",
    lineHeight: 1,
    padding: 4,
  },
  form: { padding: 20, display: "flex", flexDirection: "column", gap: 14 },
  formRow: { display: "flex", flexDirection: "column", gap: 4 },
  formRowSplit: { display: "flex", gap: 12 },
  formLabel: { fontSize: 13, fontWeight: 600, color: "#374151" },
  formInput: {
    padding: "9px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "#374151",
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    background: "#2563eb",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
