import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ProfileGate from './components/ProfileGate';
import LineCallbackPage from './pages/LineCallbackPage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SubInfoPage from './pages/SubInfoPage'
import FeedbackPage from './pages/FeedbackPage';
import HomePage from './pages/HomePage';
import DailyPage from './pages/DailyPage';
import StatsPage from './pages/StatisPage';
import ProfilePage from './pages/ProfilePage';
import WebAppGuidePage from './pages/WebAppGuidePage';
import HealthKnowledgePage from './pages/HealthKnowledgePage';
import HealthKnowledgeReaderPage from './pages/HealthKnowledgeReaderPage';
import CarbExchangePage from './pages/CarbExchangePage';
import FindFoodPage from './pages/FindFoodPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import CameraPage from './pages/CameraPage';
import ScanResultPage from './pages/ScanResultPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/check-profile" element={<ProtectedRoute><ProfileGate /></ProtectedRoute>} />
        <Route path="/subinfo" element={<ProtectedRoute><SubInfoPage /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/daily" element={<ProtectedRoute><DailyPage /></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/webapp-guide" element={<ProtectedRoute><WebAppGuidePage /></ProtectedRoute>} />
        <Route path="/health" element={<ProtectedRoute><HealthKnowledgePage /></ProtectedRoute>} />
        <Route path="/exchange" element={<ProtectedRoute><CarbExchangePage /></ProtectedRoute>} />
        <Route path="/health/reader" element={<HealthKnowledgeReaderPage />} />
        <Route path="/line/callback" element={<LineCallbackPage />} />
        <Route path="/camera" element={<ProtectedRoute><CameraPage /></ProtectedRoute>} />
        <Route path="/find-food" element={<ProtectedRoute><FindFoodPage /></ProtectedRoute>} />
        <Route path="/food-details" element={<ProtectedRoute><FoodDetailsPage /></ProtectedRoute>} />
        <Route path="/scan-result" element={<ProtectedRoute><ScanResultPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App