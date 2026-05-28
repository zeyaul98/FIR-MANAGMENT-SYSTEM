import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Admin from './admin/pages/Dashboard'
import SmartSearch from './admin/pages/SmartSearch'
import Reports from './admin/pages/Reports'
import Officer from './officer/pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'
import MyProfile from "./admin/components/MyProfile";
import AddFIR from "./officer/pages/AddFIR";
import { Toaster } from "react-hot-toast";
import BulkUploadFIR from "./officer/pages/BulkUploadFIR";
import OfficerProfile from "./officer/pages/OfficerProfile";
import FIRList from "./officer/pages/FIRList";
import AccusedList from "./officer/pages/AccusedList";
import FIRView from "./officer/pages/FIRView";
import FIREdit from "./officer/pages/FIREdit";
import BailList from "./officer/pages/BailList";


const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
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
        <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRole="admin">
                <MyProfile />
              </ProtectedRoute>
            } 
          />

          <Route
          path="/officer/add-fir"
          element={
            <ProtectedRoute allowedRole="officer">
              <AddFIR />
            </ProtectedRoute>
          }
        />
        <Route
        path="/officer/bulk-upload-fir"
        element={
          <ProtectedRoute allowedRole="officer">
            <BulkUploadFIR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/profile"
        element={
          <ProtectedRoute allowedRole="officer">
            <OfficerProfile />
          </ProtectedRoute>
        }
      />

      <Route path="/officer/firs/:id" element={<FIRView />} />
      <Route path="/officer/firs/edit/:id" element={<FIREdit />} /> 
      <Route path="/officer/firs" element={<FIRList />} />
      <Route path="/officer/bulk-upload" element={<BulkUploadFIR />} />
      <Route path="/officer/accused" element={<AccusedList />} />
      <Route path="/officer/bails" element={<BailList />} />
      <Route path="/officer/firs/view/:id" element={<FIRView />} />
      <Route path="/officer/bails/edit/:id" element={<FIREdit />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
