import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import Dashboard from './pages/Dashboard/Dashboard';
import DSAGenerator from './pages/Features/DSAGenerator';
import InterviewPrep from './pages/Features/InterviewPrep';
import ResumeAnalyzer from './pages/Features/ResumeAnalyzer';
import StudyPlanner from './pages/Features/StudyPlanner';
import AdminPanel from './pages/Admin/AdminPanel';

const NotFound = () => <div className="text-center mt-20"><h2>404 Page Not Found</h2></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dsa" element={<DSAGenerator />} />
          <Route path="interview" element={<InterviewPrep />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="planner" element={<StudyPlanner />} />

          <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
