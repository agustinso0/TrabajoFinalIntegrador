import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import LostPassword from "./pages/LostPassword"
import SignUp from "./pages/SignUp"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lost-password" element={<LostPassword />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App
