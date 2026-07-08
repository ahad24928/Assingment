import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SMTPConfig from "./pages/SMTPConfig";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Config from "./pages/Config";




function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/configs" element={<SMTPConfig />} />
      <Route path="/myconfig" element={<Config />} />
      <Route path="/reports" element={<Reports />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;