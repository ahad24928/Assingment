import { useEffect, useState } from "react";
import api from "../api/api";

export default function ScheduledJobs() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = async () => {
    const res = await api.get("/scheduled-jobs");
    setJobs(res.data.data);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const cancelJob = async (id) => {
    await api.delete(`/scheduled-jobs/${id}`);
    loadJobs();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Scheduled Jobs</h2>

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

          <button onClick={() => cancelJob(job.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}