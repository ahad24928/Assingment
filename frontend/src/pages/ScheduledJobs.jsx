export default function ScheduledJobs({ jobs = [], loading = false, onRefresh, onCancel }) {
  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2>Scheduled Jobs</h2>
        <button type="button" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {jobs.length === 0 && !loading && <p>No scheduled jobs</p>}

      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h4>{job.subject}</h4>

          <p>Status: {job.status}</p>

          <p>Contacts: {job.contactCount}</p>

          {job.scheduledTime && (
            <p>Scheduled for: {new Date(job.scheduledTime).toLocaleString()}</p>
          )}

          <button type="button" onClick={() => onCancel(job.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}