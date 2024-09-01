import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegisterForm from './pages/Login.js';
import Dashboard from './pages/Admin_Dashboard.js';
import Hospitals from './pages/Hospitals.js';
import Users from './pages/User_Manangement.js';
import Supplier from './pages/Suppliers.js';
import Drugs from './pages/Drugs.js';
import Orders from './pages/Order.js';
import Reports from './pages/Report.js';
import Patient from './pages/patient.js';
import ProcurementDashboard from './pages/Procurement_Dashboard.js';
import PharmacyDashboard from './pages/Pharmacy_Dashboard.js';

function App() {
    const isAuthenticated = !!localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Function to handle role-based redirection
    const getDashboardRoute = () => {
        switch (role) {
            case 'admin':
                return '/dashboard';
            case 'procurement_officer':
                return '/pro_dashboard';
            case 'pharmacy_manager':
                return '/p_dashboard';
            default:
                return '/';
        }
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        !isAuthenticated ? (
                            <LoginRegisterForm />
                        ) : (
                            <Navigate to={getDashboardRoute()} />
                        )
                    }
                />
                <Route path="/dashboard"
                    element={
                        isAuthenticated && role === 'admin' ? (
                            <Dashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/pro_dashboard"
                    element={
                        isAuthenticated && role === 'procurement_officer' ? (
                            <ProcurementDashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/p_dashboard"
                    element={
                        isAuthenticated && role === 'pharmacy_manager' ? (
                            <PharmacyDashboard />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/hospital"
                    element={isAuthenticated ? <Hospitals /> : <Navigate to="/" />}
                />
                <Route
                    path="/users"
                    element={isAuthenticated ? <Users /> : <Navigate to="/" />}
                />
                <Route
                    path="/supplier"
                    element={isAuthenticated ? <Supplier /> : <Navigate to="/" />}
                />
                <Route
                    path="/drugs"
                    element={isAuthenticated ? <Drugs /> : <Navigate to="/" />}
                />
                <Route
                    path="/orders"
                    element={isAuthenticated ? <Orders /> : <Navigate to="/" />}
                />
                <Route
                    path="/patient"
                    element={isAuthenticated ? <Patient /> : <Navigate to="/" />}
                />
                <Route
                    path="/reports"
                    element={isAuthenticated ? <Reports /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
