import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin Imports
import AdminLayout from './admin/layouts/AdminLayout';
import AdminDashboardHome from './admin/views/AdminDashboardHome';
import MissingPersons from './admin/views/MissingPersons';
import AssetsInventoryAdmin from './admin/views/AssetsInventoryAdmin';
import UsersManagement from './admin/views/UsersManagement';
import VerificationsAdmin from './admin/views/VerificationsAdmin';
import AuditLogsAdmin from './admin/views/AuditLogsAdmin';
import AdminAuth from './admin/views/AdminAuth';
import RequireAdmin from './admin/components/RequireAdmin';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Sign-in page lives outside both the guard and AdminLayout's
            dashboard chrome -- it previously rendered nested inside
            AdminLayout, and once a guard exists that would create a
            redirect loop for anyone without a session. */}
        <Route path="/admin/auth" element={<AdminAuth />} />

        {/* Admin Dashboard Routes -- require a signed-in admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardHome />} />
            <Route path="missing" element={<MissingPersons />} />
            <Route path="assets" element={<AssetsInventoryAdmin />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="verifications" element={<VerificationsAdmin />} />
            <Route path="audit-logs" element={<AuditLogsAdmin />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}