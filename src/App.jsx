import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import LineCallbackPage from './pages/LineCallbackPage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import SubInfoPage from './pages/SubInfoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/subinfo" element={<ProtectedRoute><SubInfoPage /></ProtectedRoute>} />
        <Route path="/line/callback" element={<LineCallbackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App