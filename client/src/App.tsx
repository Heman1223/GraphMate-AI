import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import FriendsPage from './pages/FriendsPage';
import NetworkPage from './pages/NetworkPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import MessagesPage from './pages/MessagesPage';
import CommunityPage from './pages/CommunityPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/layout/AppLayout';

function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/:identifier" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
