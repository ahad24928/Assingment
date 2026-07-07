import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import SMTPConfig from "./SMTPConfig";
import EmailSender from "./EmailSender";
import ScheduledJobs from "./ScheduledJobs";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch {
      navigate("/login");
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bulk Email Sender</h1>

      <h3>Welcome {user?.name}</h3>

      <p>{user?.email}</p>

      <hr />

      <hr />

      <button onClick={logout}>Logout</button>


        <hr /> 

        <SMTPConfig />

        <hr /> 


        <EmailSender />

        <hr />

<ScheduledJobs />

        
        

    </div>
  );
}