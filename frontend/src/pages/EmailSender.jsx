import { useEffect, useState } from "react";
import api from "../api/api";
import FileUploads from "./FileUploads";
import EmailContent from "./EmailContent";

export default function EmailSender() {
  const [configs, setConfigs] = useState([]);
  const [configId, setConfigId] = useState("");

  const [subject, setSubject] = useState("");
  const [htmlContent, setHtmlContent] = useState("");

  const [excelFile, setExcelFile] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);

  const [preview, setPreview] = useState([]);
  const [total, setTotal] = useState(0);

  const [start, setStart] = useState(0);
  const [count, setCount] = useState(100);

  const [delay, setDelay] = useState(20);

  const [useBatch, setUseBatch] = useState(false);
  const [batchSize, setBatchSize] = useState(20);
  const [batchDelay, setBatchDelay] = useState(60);
  const [emailDelay, setEmailDelay] = useState(45);

  const [scheduleEmail, setScheduleEmail] = useState(false);
  const [scheduledTime, setScheduledTime] = useState("");

  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyBrowser, setNotifyBrowser] = useState(false);

  const [provider, setProvider] = useState(null);

  // --- Scheduled jobs, shared with FileUploads ---
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    loadConfigs();
    loadJobs();
  }, []);

  const loadConfigs = async () => {
    const res = await api.get("/config/smtp");

    setConfigs(res.data.userConfigs);

    if (res.data.userConfigs.length) setConfigId(res.data.userConfigs[0].id);
  };

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await api.get("/scheduled-jobs");
      setJobs(res.data.data || []);
    } catch (err) {
      console.error("Failed to load scheduled jobs", err);
    } finally {
      setJobsLoading(false);
    }
  };

  const cancelJob = async (id) => {
    try {
      await api.delete(`/scheduled-jobs/${id}`);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel job");
    }
  };

  const parseExcel = async (file) => {
    const fd = new FormData();

    fd.append("excelFile", file);

    const res = await api.post("/parse-excel", fd);

    setPreview(res.data.contacts);
    setTotal(res.data.totalCount);
  };

  const detectProvider = async () => {
    if (!configs.length) return;

    const config = configs.find((c) => c.id === configId);
    if (!config) return;

    const fd = new FormData();

    fd.append("smtpHost", config.host);

    const res = await api.post("/provider-info", fd);

    setProvider(res.data.data);
  };

  useEffect(() => {
    detectProvider();
  }, [configId, configs]);

  const submit = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      alert("Please upload an Excel file first.");
      return;
    }

    if (scheduleEmail && !scheduledTime) {
      alert("Please pick a scheduled time.");
      return;
    }

    const form = new FormData();

    form.append("configId", configId);
    form.append("subject", subject);
    form.append("htmlContent", htmlContent);

    form.append("excelFile", excelFile);

    if (htmlFile) form.append("htmlTemplate", htmlFile);

    form.append("delay", delay);

    form.append("emailRangeStart", start);
    form.append("emailRangeCount", count);

    if (useBatch) {
      form.append("useBatch", "on");
      form.append("batchSize", batchSize);
      form.append("batchDelay", batchDelay);
      form.append("emailDelay", emailDelay);
    }

    if (scheduleEmail) {
      form.append("scheduleEmail", "on");
      form.append("scheduledTime", new Date(scheduledTime).toISOString());
    }

    if (notifyEmail) form.append("notifyEmail", notifyEmail);

    if (notifyBrowser) form.append("notifyBrowser", "on");

    try {
      const res = await api.post("/send", form);

      alert(res.data.message);

      // Refresh so the new/updated job shows immediately
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <FileUploads
          configs={configs}
          configId={configId}
          setConfigId={setConfigId}
          excelFile={excelFile}
          setExcelFile={setExcelFile}
          parseExcel={parseExcel}
          htmlFile={htmlFile}
          setHtmlFile={setHtmlFile}
          preview={preview}
          total={total}
          start={start}
          setStart={setStart}
          count={count}
          setCount={setCount}
          delay={delay}
          setDelay={setDelay}
          useBatch={useBatch}
          setUseBatch={setUseBatch}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          batchDelay={batchDelay}
          setBatchDelay={setBatchDelay}
          emailDelay={emailDelay}
          setEmailDelay={setEmailDelay}
          scheduleEmail={scheduleEmail}
          setScheduleEmail={setScheduleEmail}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          notifyEmail={notifyEmail}
          setNotifyEmail={setNotifyEmail}
          notifyBrowser={notifyBrowser}
          setNotifyBrowser={setNotifyBrowser}
          provider={provider}
          scheduledJobs={jobs}
          jobsLoading={jobsLoading}
          onRefreshJobs={loadJobs}
          onCancelJob={cancelJob}
        />

       <EmailContent
  subject={subject}
  setSubject={setSubject}
  htmlContent={htmlContent}
  setHtmlContent={setHtmlContent}
  htmlFile={htmlFile}
  setHtmlFile={setHtmlFile}
  scheduleEmail={scheduleEmail}
/>
      </form>
    </div>
  );
}