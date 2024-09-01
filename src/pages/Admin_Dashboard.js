import React, { useState } from 'react';
// import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/Dashboard.css';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="main-content">
            <Sidebar isOpen={isSidebarOpen} />
                <div className="content">
                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <h3>Total Hospital</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Orders</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>All Drugs</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Patients</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Pending Orders</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Expired Medicines</h3>
                            <p>{0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
