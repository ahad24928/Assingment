import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

import SMTPConfig from "./SMTPConfig";
import EmailSender from "./EmailSender";
import Welcome from "./Welcome";
import AboutUs from "./AboutUs";
import Layout from "../components/Layout";
import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";

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

  return (
  <Layout>
    <div className="container-fluid py-4">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div style={{ flex: "3 1 520px", minWidth: 0 }}>
          <SMTPConfig />
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <Welcome user={user} />
        </div>
      </div>

      <div className="row mt-4">
  <div className="col-12">
    <AboutUs />
  </div>
</div>

<div className="row mt-5">
  <div className="col-12">
    <EmailSender />
  </div>
</div>
    </div>

    <Footer />
  </Layout>
  );
}
