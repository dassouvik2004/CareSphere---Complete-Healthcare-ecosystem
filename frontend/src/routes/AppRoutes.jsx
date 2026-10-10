import { Routes, Route, Navigate } from 'react-router-dom';
import AdminConsole from '../pages/admin/Adminconsole';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminConsole />} />
      {/* add more routes here later, e.g. /login, /doctor, /patient */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}