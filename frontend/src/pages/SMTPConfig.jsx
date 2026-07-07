import { useEffect, useState } from "react";
import api from "../api/api";

export default function SMTPConfig() {
  const [configs, setConfigs] = useState([]);

  const [form, setForm] = useState({
    name: "",
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    fromEmail: "",
    fromName: "",
    isDefault: true,
  });

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const res = await api.get("/config/smtp");
      setConfigs(res.data.userConfigs || []);
    } catch (err) {
      console.log(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/config/smtp", form);

      alert(res.data.message);

      loadConfigs();

      setForm({
        name: "",
        host: "",
        port: 587,
        secure: false,
        user: "",
        pass: "",
        fromEmail: "",
        fromName: "",
        isDefault: true,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>SMTP Configuration</h2>

      <form onSubmit={submit}>

        <input
          placeholder="Configuration Name"
          value={form.name}
          onChange={(e)=>setForm({...form,name:e.target.value})}
        /><br/><br/>

        <input
          placeholder="SMTP Host"
          value={form.host}
          onChange={(e)=>setForm({...form,host:e.target.value})}
        /><br/><br/>

        <input
          type="number"
          placeholder="Port"
          value={form.port}
          onChange={(e)=>setForm({...form,port:Number(e.target.value)})}
        /><br/><br/>

        <label>
          <input
            type="checkbox"
            checked={form.secure}
            onChange={(e)=>setForm({...form,secure:e.target.checked})}
          />
          SSL
        </label>

        <br/><br/>

        <input
          placeholder="SMTP User"
          value={form.user}
          onChange={(e)=>setForm({...form,user:e.target.value})}
        /><br/><br/>

        <input
          type="password"
          placeholder="SMTP Password"
          value={form.pass}
          onChange={(e)=>setForm({...form,pass:e.target.value})}
        /><br/><br/>

        <input
          placeholder="From Email"
          value={form.fromEmail}
          onChange={(e)=>setForm({...form,fromEmail:e.target.value})}
        /><br/><br/>

        <input
          placeholder="From Name"
          value={form.fromName}
          onChange={(e)=>setForm({...form,fromName:e.target.value})}
        /><br/><br/>

        <button>Save SMTP</button>

      </form>

      <hr />

      <h3>Saved Configurations</h3>

      {configs.map((c) => (
        <div key={c.id}>
          <b>{c.name}</b> - {c.host}
        </div>
      ))}
    </div>
  );
}