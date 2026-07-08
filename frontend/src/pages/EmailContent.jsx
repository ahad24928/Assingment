import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./EmailContent.css";

const IconMail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M14 2v5h5" />
  </svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export default function EmailContent({
  subject,
  setSubject,
  htmlContent,
  setHtmlContent,
  htmlFile,
  setHtmlFile,
  scheduleEmail = false,
  onPreview = null,
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      setPreviewOpen(true);
    }
  };

  return (
    <div className="ec-card">
      <div className="ec-card-head">
        <IconMail />
        <span>Email Content</span>
      </div>

      <div className="ec-card-body">
        <div className="ec-section">
          <label className="ec-label">
            Subject <span className="ec-req">*</span>
          </label>
          <input
            className="ec-input"
            placeholder="Hello {{FirstName}}, welcome to {{Company}}!"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <p className="ec-hint">
            You can use placeholders like <code>{"{{FirstName}}"}</code>, <code>{"{{Company}}"}</code>, etc.
          </p>
        </div>

        <div className="ec-section">
          <label className="ec-label">Email Content</label>
          <div className="ec-editor-wrap">
            <ReactQuill
              theme="snow"
              value={htmlContent}
              onChange={setHtmlContent}
              placeholder="Write your email content here..."
            />
          </div>
          <p className="ec-hint">
            Use placeholders like <code>{"{{FirstName}}"}</code>, <code>{"{{Company}}"}</code> in your content.
          </p>
        </div>

        <div className="ec-section">
          <label className="ec-label">HTML Override (Optional)</label>
          <div className="ec-file-row">
            <label className="ec-file-btn">
              <IconFile />
              <span>Choose HTML File</span>
              <input
                type="file"
                accept=".html"
                onChange={(e) => setHtmlFile(e.target.files[0])}
                hidden
              />
            </label>
            <span className="ec-file-name">
              {htmlFile ? htmlFile.name : "No file chosen"}
            </span>
          </div>
          <p className="ec-hint">If provided, this file replaces the editor content above at send time.</p>
        </div>

        {/* --- Action row: changes based on schedule toggle --- */}
        <div className="ec-actions">
          {scheduleEmail ? (
            <>
              <button type="submit" className="ec-btn ec-btn-primary">
                <IconCalendar />
                Schedule Campaign
              </button>

              <button type="button" className="ec-btn ec-btn-outline" onClick={handlePreview}>
                <IconEye />
                Preview
              </button>

              <span className="ec-badge">
                <span className="ec-badge-dot" />
                Will be scheduled
              </span>
            </>
          ) : (
            <button type="submit" className="ec-btn ec-btn-primary">
              Send Emails
            </button>
          )}
        </div>
      </div>

      {previewOpen && (
        <div className="ec-preview-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="ec-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ec-preview-head">
              <span>Preview</span>
              <button type="button" className="ec-preview-close" onClick={() => setPreviewOpen(false)}>
                ✕
              </button>
            </div>
            <div className="ec-preview-subject">
              <strong>Subject:</strong> {subject || "(no subject)"}
            </div>
            <div className="ec-preview-body" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>
      )}
    </div>
  );
}