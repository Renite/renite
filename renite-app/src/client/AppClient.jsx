import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import Login from './views/Login';
import Home from './views/Home';
import AssetTracker from './views/AssetTracker';
import MapView from './views/MapView';
import Chat from './views/Chat';
import Profile from './views/Profile';
import EmergencyReport from './views/EmergencyReport';
import Volunteers from './views/Volunteers';
import MissingPersonDetail from './views/MissingPersonDetail';
import MissingPersonList from './views/MissingPersonList';
import EmergencyDesk from './views/EmergencyDesk';
import LanguageProvider from './context/LanguageContext';
import Rewards from './views/Rewards';
import AssetReport from './views/AssetReport';
import QRScannerModal from './components/QRScannerModal';
import PoliceHome from './views/PoliceHome';
import RequireAuth from './components/RequireAuth';

export default function AppClient() {
  return (
    <LanguageProvider>
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Citizen shell: any signed-in account can reach these (police/admin
          included -- they're still citizens for asset/report purposes). */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<Home />} />
          <Route path="assets" element={<AssetTracker />} />
          <Route path="map" element={<MapView />} />
          <Route path="chat" element={<Chat />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="report-asset" element={<AssetReport/>} />
          <Route path="qr-scan" element={<QRScannerModal/>} />
          {/* FIXED: Removed the leading slash from "profile" */}
          <Route path="profile" element={<Profile />} /> 
          
          <Route path="emergency-report" element={<EmergencyReport />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="track" element={<MissingPersonDetail />} />
          
          {/* Fix for the console warning: Redirect old /missing-person requests to the new list view */}
          <Route path="missing-person" element={<Navigate to="/missing" replace />} />
          
          {/* Missing Persons Directory List */}
          <Route path="missing" element={<MissingPersonList />} />
          
          {/* Dynamic Detail Route for a Specific Person */}
          <Route path="missing/:id" element={<MissingPersonDetail />} />
          
          <Route path="report" element={<EmergencyDesk />} />
        </Route>
      </Route>

      {/* Police Command: separate shell (PoliceHome renders its own header/
          logout), restricted to police + admin roles. This route was
          previously missing entirely -- Login.jsx already navigated here
          on a successful officer sign-in, it just 404'd. */}
      <Route element={<RequireAuth allowedRoles={['police', 'admin']} />}>
        <Route path="/police-home" element={<PoliceHome />} />
      </Route>
    </Routes>
    </LanguageProvider>
  );
}