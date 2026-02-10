import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LineCallbackPage from './pages/LineCallbackPage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SubInfoPage from './pages/SubInfoPage'
import FeedbackPage from './pages/FeedbackPage';
import HomePage from './pages/HomePage';
import DailyPage from './pages/DailyPage';
import StatsPage from './pages/StatisPage';
import ProfilePage from './pages/ProfilePage';
import HealthKnowledgePage from './pages/HealthKnowledgePage';
import CarbExchangePage from './pages/CarbExchangePage';
import FindFoodPage from './pages/FindFoodPage';
import FoodDetailsPage from './pages/FoodDetailsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/subinfo" element={<ProtectedRoute><SubInfoPage /></ProtectedRoute>} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/daily" element={<DailyPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/health" element={<HealthKnowledgePage />} />
        <Route path="/exchange" element={<CarbExchangePage />} />
        <Route path="/line/callback" element={<LineCallbackPage />} />
        <Route path="/find-food" element={<FindFoodPage />} />
        <Route path="/food-details" element={<FoodDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App