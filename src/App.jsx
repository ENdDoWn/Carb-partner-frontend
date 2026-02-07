import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LineCallbackPage from './pages/LineCallbackPage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SubInfoPage from './pages/SubInfoPage'
import EnableNotifications from './pages/EnableNotifications';
import FeedbackPage from './pages/FeedbackPage';
import HomePage from './pages/HomePage';
import DailyPage from './pages/DailyPage';
import StatsPage from './pages/StatisPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/subinfo" element={<ProtectedRoute><SubInfoPage /></ProtectedRoute>} />
        <Route path="/notification" element={<EnableNotifications />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/line/callback" element={<LineCallbackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App