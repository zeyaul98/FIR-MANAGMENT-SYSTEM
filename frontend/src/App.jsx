import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './admin/pages/Dashboard'
import SmartSearch from './admin/pages/SmartSearch'
import Reports from './admin/pages/Reports'
import Officer from './officer/pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/smart-search"
          element={
            <ProtectedRoute allowedRole="admin">
              <SmartSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRole="admin">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer"
          element={
            <ProtectedRoute allowedRole="officer">
              <Officer />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
