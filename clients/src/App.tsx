import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { NewClaim } from './pages/claims/NewClaim';
import { AnalysisResult } from './pages/claims/AnalysisResult';
import { ClaimHistory } from './pages/claims/ClaimHistory';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Main App Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/claims/new" element={<NewClaim />} />
                <Route path="/claims/analysis-result" element={<AnalysisResult />} />
                <Route path="/claims/history" element={<ClaimHistory />} />
                <Route path="/claims/queue" element={<ClaimHistory />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
