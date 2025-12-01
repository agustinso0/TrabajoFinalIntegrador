import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import Login from '../pages/Login'
import LostPassword from '../pages/LostPassword'
import SignUp from '../pages/SignUp'
import { Home } from '../pages/Home'
import { Profile } from '../pages/Profile'
import { Users } from '../pages/Users'
import { FormsExample } from '../pages/FormsExample'
import { RecordsList } from '../pages/RecordsList'
import { RecordDetail } from '../pages/RecordDetail'
import { Report } from '../pages/Report'
import { QueryReport } from '../pages/QueryReport'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/lost-password" element={<LostPassword />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/abm" element={<FormsExample />} />
        <Route path="/records" element={<RecordsList />} />
        <Route path="/records/:id" element={<RecordDetail />} />
        <Route path="/report" element={<Report />} />
        <Route path="/query-report" element={<QueryReport />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  )
}

