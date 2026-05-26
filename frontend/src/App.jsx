import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const ATSAnalyzer = lazy(() => import('./pages/ATSAnalyzer'));
const JobMatcher = lazy(() => import('./pages/JobMatcher'));
const ResumeEnhancer = lazy(() => import('./pages/ResumeEnhancer'));
const CareerRoadmap = lazy(() => import('./pages/CareerRoadmap'));
const MockInterview = lazy(() => import('./pages/MockInterview'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const RAGChatbot = lazy(() => import('./pages/RAGChatbot'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex bg-gray-950 min-h-screen font-sans text-gray-100">
      {!isAuthPage && <Sidebar />}
      <div className={`${!isAuthPage ? 'ml-64' : ''} flex-1 overflow-x-hidden`}>
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-xl text-gray-400">Loading...</div>}>
          <Routes>
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            
            <Route path="/"          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ats"       element={<ProtectedRoute><ATSAnalyzer /></ProtectedRoute>} />
            <Route path="/match"     element={<ProtectedRoute><JobMatcher /></ProtectedRoute>} />
            <Route path="/enhance"   element={<ProtectedRoute><ResumeEnhancer /></ProtectedRoute>} />
            <Route path="/roadmap"   element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
            <Route path="/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="/chatbot"   element={<ProtectedRoute><RAGChatbot /></ProtectedRoute>} />
            <Route path="*"          element={<div className="p-8 text-2xl font-bold text-gray-600">Page not found.</div>} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
