import "./Fileupload.css";

const IconDoc = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" />
    <path d="M14 2v5h5" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 11A8 8 0 0 0 6 6.3L4 8M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14 5.7l2-1.7M20 20v-4h-4" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export default function FileUploads({
  configs,
  configId,
  setConfigId,

  excelFile,
  setExcelFile,
  parseExcel,

  htmlFile,
  setHtmlFile,

  preview,
  total,

  start,
  setStart,
  count,
  setCount,

  delay,
  setDelay,

  useBatch,
  setUseBatch,
  batchSize,
  setBatchSize,
  batchDelay,
  setBatchDelay,
  emailDelay,
  setEmailDelay,

  scheduleEmail,
  setScheduleEmail,
  scheduledTime,
  setScheduledTime,

  notifyEmail,
  setNotifyEmail,
  notifyBrowser,
  setNotifyBrowser,

  provider,

  scheduledJobs = [],
  jobsLoading = false,
  onRefreshJobs = () => {},
  onCancelJob = null,
  onTestNotification = () => {},
}) {
  return (
    <div className="fu-wrap">
      {/* ---------------- File Uploads ---------------- */}
      <div className="fu-card">
        <div className="fu-card-head">
          <IconDoc />
          <span>File Uploads</span>
        </div>

        <div className="fu-card-body">
          <div className="fu-section">
            <label className="fu-label">
              SMTP Configuration <span className="fu-req">*</span>
            </label>
            <select
              className="fu-select"
              value={configId}
              onChange={(e) => setConfigId(e.target.value)}
            >
              {configs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="fu-section">
            <label className="fu-label">
              Excel File (Contacts) <span className="fu-req">*</span>
            </label>
            <input
              type="file"
              className="fu-native-file"
              accept=".xlsx,.xls"
              onChange={async (e) => {
                const file = e.target.files[0];
                setExcelFile(file);
                await parseExcel(file);
              }}
            />
            <p className="fu-hint">
              Required columns: <strong>Email</strong>. Optional:{" "}
              <strong>FirstName, LastName, Company, Subject</strong>
            </p>
            <button
              type="button"
              className="fu-sample-btn"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/sample.xlsx";
                link.download = "sample.xlsx";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              ⬇ Download Sample
          </button>

            {preview.length > 0 && (
              <>
                <div className="fu-total-badge">{total} contacts loaded</div>
                <div className="fu-table-wrap">
                  <table className="fu-table">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>First</th>
                        <th>Last</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((c, i) => (
                        <tr key={i}>
                          <td>{c.Email}</td>
                          <td>{c.FirstName}</td>
                          <td>{c.LastName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          <div className="fu-section">
            <label className="fu-label">HTML Template (Optional)</label>
            <input
              type="file"
              className="fu-native-file"
              accept=".html"
              onChange={(e) => setHtmlFile(e.target.files[0])}
            />
            <p className="fu-hint">If provided, will override the editor content below</p>
          </div>

          <div className="fu-section">
            <label className="fu-label">Delay Between Emails (seconds)</label>
            <input
              type="number"
              className="fu-input fu-input-sm"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
            />
            <p className="fu-hint">Delay between each email (15–30 seconds recommended)</p>
          </div>

          <div className="fu-section fu-row-2">
            <div className="fu-field">
              <span className="fu-field-label">Send from row</span>
              <input
                type="number"
                className="fu-input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="fu-field">
              <span className="fu-field-label">Number to send</span>
              <input
                type="number"
                className="fu-input"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>
          </div>

          <div className="fu-warning-box">
            <div className="fu-warning-title">⚠ SMTP Provider Guidelines:</div>
            <ul>
              <li>Gmail: Use App Passwords, not regular password</li>
              <li>Outlook: Regular password usually works</li>
              <li>Respect provider sending limits</li>
            </ul>
          </div>

          {provider && (
            <div className="fu-provider-box">
              <h4>Provider detected: {provider.provider}</h4>
              <div className="fu-provider-grid">
                <div>
                  <span className="fu-provider-label">Daily limit</span>
                  <span className="fu-provider-value">{provider.dailyLimit}</span>
                </div>
                <div>
                  <span className="fu-provider-label">Recommended batch</span>
                  <span className="fu-provider-value">{provider.recommendedBatchSize}</span>
                </div>
                <div>
                  <span className="fu-provider-label">Recommended delay</span>
                  <span className="fu-provider-value">{provider.recommendedDelay}s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Batch Processing ---------------- */}
      <div className="fu-card">
        <div className="fu-card-head">
          <IconBolt />
          <span>Batch Processing (Avoid Gmail Limits)</span>
        </div>

        <div className="fu-card-body">
          <label className="fu-toggle-row">
            <input
              type="checkbox"
              className="fu-checkbox"
              checked={useBatch}
              onChange={(e) => setUseBatch(e.target.checked)}
            />
            <span>
              <span className="fu-toggle-title">Enable Batch Processing</span>
              <span className="fu-toggle-desc">Recommended for large lists to avoid Gmail limits</span>
            </span>
          </label>

          {useBatch && (
            <div className="fu-subpanel">
              <div className="fu-field">
                <span className="fu-field-label">Batch Size</span>
                <input
                  type="number"
                  className="fu-input"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                />
              </div>
              <div className="fu-field">
                <span className="fu-field-label">Email Delay</span>
                <input
                  type="number"
                  className="fu-input"
                  value={emailDelay}
                  onChange={(e) => setEmailDelay(e.target.value)}
                />
              </div>
              <div className="fu-field">
                <span className="fu-field-label">Batch Delay</span>
                <input
                  type="number"
                  className="fu-input"
                  value={batchDelay}
                  onChange={(e) => setBatchDelay(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Schedule Email Sending ---------------- */}
      <div className="fu-card">
        <div className="fu-card-head">
          <IconClock />
          <span>Schedule Email Sending</span>
        </div>

        <div className="fu-card-body">
          <label className="fu-toggle-row">
            <input
              type="checkbox"
              className="fu-checkbox"
              checked={scheduleEmail}
              onChange={(e) => setScheduleEmail(e.target.checked)}
            />
            <span>
              <span className="fu-toggle-title">Schedule for later sending</span>
              <span className="fu-toggle-desc">Send emails at a specific date/time automatically</span>
            </span>
          </label>

          {scheduleEmail && (
            <div className="fu-schedule-grid">
              <div className="fu-schedule-col">
                <label className="fu-label">Schedule Date &amp; Time</label>
                <input
                  type="datetime-local"
                  className="fu-input"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                <p className="fu-hint">
                  Minimum 5 minutes from now · Your timezone: Asia/Calcutta
                </p>
              </div>

              <div className="fu-schedule-col">
                <label className="fu-label">Notification Settings</label>
                <input
                  type="email"
                  className="fu-input"
                  placeholder="you@example.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                />

                <label className="fu-toggle-row fu-toggle-row-compact">
                  <input
                    type="checkbox"
                    className="fu-checkbox"
                    checked={notifyBrowser}
                    onChange={(e) => setNotifyBrowser(e.target.checked)}
                  />
                  <span className="fu-toggle-title">Browser notification</span>
                </label>

                <button type="button" className="fu-test-btn" onClick={onTestNotification}>
                  <IconBell /> Test Notification
                </button>
              </div>
            </div>
          )}

          <div className="fu-jobs-box">
            <div className="fu-jobs-head">
              <span>📋 Active Scheduled Jobs:</span>
              <button type="button" className="fu-refresh-btn" onClick={onRefreshJobs} disabled={jobsLoading}>
                <IconRefresh /> {jobsLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {jobsLoading && scheduledJobs.length === 0 ? (
              <p className="fu-jobs-empty">Loading...</p>
            ) : scheduledJobs.length === 0 ? (
              <p className="fu-jobs-empty">No scheduled jobs</p>
            ) : (
              <div className="fu-jobs-cards">
                {scheduledJobs.map((job) => (
                  <div key={job.id} className="fu-job-card">
                    <div className="fu-job-card-top">
                      <span className="fu-job-subject">{job.subject || "Untitled"}</span>
                      <span className={`fu-job-status fu-job-status-${(job.status || "").toLowerCase()}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="fu-job-card-meta">
                      <span>👥 {job.contactCount} contacts</span>
                      {job.scheduledTime && (
                        <span>🕒 {new Date(job.scheduledTime).toLocaleString()}</span>
                      )}
                    </div>

                    {onCancelJob && job.status !== "completed" && (
                      <button
                        type="button"
                        className="fu-job-cancel-btn"
                        onClick={() => onCancelJob(job.id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}