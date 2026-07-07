import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from "../api/api";

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

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const res = await api.get("/config/smtp");

    setConfigs(res.data.userConfigs);

    if (res.data.userConfigs.length)
      setConfigId(res.data.userConfigs[0].id);
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

    const fd = new FormData();

    fd.append("smtpHost", config.host);

    const res = await api.post("/provider-info", fd);

    setProvider(res.data.data);
  };

  useEffect(() => {
    detectProvider();
  }, [configId]);

  const submit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("configId", configId);
    form.append("subject", subject);
    form.append("htmlContent", htmlContent);

    form.append("excelFile", excelFile);

    if (htmlFile)
      form.append("htmlTemplate", htmlFile);

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

    if (notifyEmail)
      form.append("notifyEmail", notifyEmail);

    if (notifyBrowser)
      form.append("notifyBrowser", "on");

    try {
      const res = await api.post("/send", form);

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div>

      <h2>Send Bulk Email</h2>

      <form onSubmit={submit}>

        <h3>SMTP Configuration</h3>

        <select
          value={configId}
          onChange={(e)=>setConfigId(e.target.value)}
        >
          {configs.map(c=>(
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <hr/>

        <h3>Subject</h3>

        <input
          style={{width:"100%"}}
          value={subject}
          onChange={(e)=>setSubject(e.target.value)}
        />

        <hr/>

        <h3>Email Content</h3>

        <ReactQuill
          theme="snow"
          value={htmlContent}
          onChange={setHtmlContent}
        />

        <br/>

        <input
          type="file"
          accept=".html"
          onChange={(e)=>setHtmlFile(e.target.files[0])}
        />

        <hr/>

        <h3>Excel File</h3>
        <div style={{ marginTop: "10px" }}>
  <a href="/sample.xlsx" download>
    <button type="button">
      📥 Download Sample Excel
    </button>
  </a>
</div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={async(e)=>{
            const file=e.target.files[0];
            setExcelFile(file);
            await parseExcel(file);
          }}
        />

        <h3>Total Contacts : {total}</h3>

        <table border="1">

          <thead>

            <tr>

              <th>Email</th>
              <th>First</th>
              <th>Last</th>

            </tr>

          </thead>

          <tbody>

          {preview.map((c,i)=>(
            <tr key={i}>
              <td>{c.Email}</td>
              <td>{c.FirstName}</td>
              <td>{c.LastName}</td>
            </tr>
          ))}

          </tbody>

        </table>

        <hr/>

        <h3>Email Range</h3>

        <input
          type="number"
          value={start}
          onChange={(e)=>setStart(e.target.value)}
        />

        <input
          type="number"
          value={count}
          onChange={(e)=>setCount(e.target.value)}
        />

        <hr/>

        <h3>Delay</h3>

        <input
          type="number"
          value={delay}
          onChange={(e)=>setDelay(e.target.value)}
        />

        <hr/>

        <label>

          <input
            type="checkbox"
            checked={useBatch}
            onChange={(e)=>setUseBatch(e.target.checked)}
          />

          Use Batch Mode

        </label>

        {useBatch && (

          <div>

            <p>Batch Size</p>

            <input
              type="number"
              value={batchSize}
              onChange={(e)=>setBatchSize(e.target.value)}
            />

            <p>Email Delay</p>

            <input
              type="number"
              value={emailDelay}
              onChange={(e)=>setEmailDelay(e.target.value)}
            />

            <p>Batch Delay</p>

            <input
              type="number"
              value={batchDelay}
              onChange={(e)=>setBatchDelay(e.target.value)}
            />

          </div>

        )}

        <hr/>

        <label>

          <input
            type="checkbox"
            checked={scheduleEmail}
            onChange={(e)=>setScheduleEmail(e.target.checked)}
          />

          Schedule Email

        </label>

        {scheduleEmail && (

          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e)=>setScheduledTime(e.target.value)}
          />

        )}

        <hr/>

        <h3>Notification</h3>

        <input
          placeholder="Notification Email"
          value={notifyEmail}
          onChange={(e)=>setNotifyEmail(e.target.value)}
        />

        <br/><br/>

        <label>

          <input
            type="checkbox"
            checked={notifyBrowser}
            onChange={(e)=>setNotifyBrowser(e.target.checked)}
          />

          Browser Notification

        </label>

        <hr/>

        {provider && (

          <div>

            <h3>Provider Information</h3>

            <p>Provider : {provider.provider}</p>

            <p>Daily Limit : {provider.dailyLimit}</p>

            <p>Recommended Batch : {provider.recommendedBatchSize}</p>

            <p>Recommended Delay : {provider.recommendedDelay}</p>

          </div>

        )}

        <button type="submit">

          Send Emails

        </button>

      </form>

    </div>
  );
}