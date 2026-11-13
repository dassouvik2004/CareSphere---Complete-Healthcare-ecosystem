import { Routes, Route, Navigate } from 'react-router-dom';
import AdminConsole from '../pages/admin/Adminconsole';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminConsole />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      {/* add more routes here later, e.g. /login, /doctor, /patient */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}