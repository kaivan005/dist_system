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


function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={!isAuthenticated ? <LoginRegisterForm />: <Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={!isAuthenticated ? <Dashboard />: <Navigate to="/" />} />
                <Route path="/hospital" element={!isAuthenticated ? <Hospitals />: <Navigate to="/" />} />
                <Route path="/users" element={!isAuthenticated ? <Users />: <Navigate to="/" />} />
                <Route path="/supplier" element={!isAuthenticated ? <Supplier />: <Navigate to="/" />} />
                <Route path="/drugs" element={!isAuthenticated ? <Drugs />: <Navigate to="/" />} />
                <Route path="/orders" element={!isAuthenticated ? <Orders />: <Navigate to="/" />} />
                <Route path="/patient" element={!isAuthenticated ? <Patient />: <Navigate to="/" />} />
                <Route path="/reports" element={!isAuthenticated ? <Reports />: <Navigate to="/" />} />

                {/* <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/all_drugs" element={isAuthenticated ? <Drugs /> : <Navigate to="/" />} />
                <Route path="/available_drugs" element={isAuthenticated ? <AvailableDrugs /> : <Navigate to="/" />} />
                <Route path="/sales" element={isAuthenticated ? <Sales /> : <Navigate to="/" />} />
                <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/" />} /> */}
            </Routes>
        </Router>
    );
}

export default App;
