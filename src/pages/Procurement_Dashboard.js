import React, { useState } from 'react';
// import axios from 'axios';
import Navbar from '../components/ProcurementSidebar';
import Sidebar from '../components/Navbar';
import './css/Dashboard.css';

const ProcurementDashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const [totalSales, setTotalSales] = useState(0);
    // const [totalSalesAmt, setTotalSalesAmt] = useState(0);
    // const [allMedicines, setAllMedicines] = useState(0);
    // const [availableMedicines, setAvailableMedicines] = useState(0);
    // const [expiredMedicines, setExpiredMedicines] = useState(0);
    // const [outOfStockMedicines, setOutOfStockMedicines] = useState(0);



    // const fetchData = async () => {
    //     try {
    //         const salesResponse = await axios.get('http://localhost:5000/sales');
    //         const medicinesResponse = await axios.get('http://localhost:5000/drugs');
    //         const today = new Date();

    //         const totalSalesCount = salesResponse.data.length;
    //         const totalSalesAmount = salesResponse.data.reduce((total, sale) => total + sale.price, 0);
    //         const allMedicinesCount = medicinesResponse.data.length;
    //         const availableMedicinesCount = medicinesResponse.data.filter(medicine => medicine.quantity_available > 0).length;
    //         const expiredMedicinesCount = medicinesResponse.data.filter(medicine => new Date(medicine.exp_date) < today).length;
    //         const outOfStockMedicinesCount = medicinesResponse.data.filter(medicine => medicine.quantity_available === 0).length;

    //         setTotalSales(totalSalesCount);
    //         setTotalSalesAmt(totalSalesAmount);
    //         setAllMedicines(allMedicinesCount);
    //         setAvailableMedicines(availableMedicinesCount);
    //         setExpiredMedicines(expiredMedicinesCount);
    //         setOutOfStockMedicines(outOfStockMedicinesCount);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

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
                            <h3>Total Sales</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Total Sales Amount</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>All Medicines</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Available Medicines</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Expired Medicines</h3>
                            <p>{0}</p>
                        </div>
                        <div className="dashboard-card">
                            <h3>Out of Stock</h3>
                            <p>{0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementDashboard;
