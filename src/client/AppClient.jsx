import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from './layouts/ClientLayout';
import Login from './views/Login';
import Home from './views/Home';
import AssetTracker from './views/AssetTracker';
import MapView from './views/MapView';
import Chat from './views/Chat';
import Profile from './views/Profile';
import EmergencyReport from './views/EmergencyReport';

export default function AppClient() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="assets" element={<AssetTracker />} />
        <Route path="map" element={<MapView />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
        <Route path="emergency-report" element={<EmergencyReport />} />
      </Route>
    </Routes>
  );
}