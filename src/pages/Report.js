import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Reports = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sales, setSales] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://localhost:5000/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setSales((prevSales) => {
            const sortedSales = [...prevSales];
            sortedSales.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedSales;
        });
    };


    // const handleChange = (e) => {
    //     setCurrentSale({
    //         ...currentSale,
    //         [e.target.name]: e.target.value,
    //     });
    // };

    // const handleFilter = () => {
    //     fetchSales();
    // };

    const handleDownload = () => {
        const filteredSales = sales.filter((sale) => {
            const saleDate = new Date(sale.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return saleDate >= start && saleDate <= end;
        });

        const worksheet = XLSX.utils.json_to_sheet(filteredSales);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
        XLSX.writeFile(workbook, "Sales Report.xlsx");
    };

    return (
        <div className="dashboard-container">
                <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
            <div className="main-content">
            <Sidebar isOpen={isSidebarOpen} />
                <div className="content">
                    <div className="header">
                        <div className="date-selector">
                            <h3>Select Date</h3>
                            <br/>
                            <label>From</label>
                            <input
                                type="date"
                                name="start_date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <label>Till</label>
                            <input
                                type="date"
                                name="end_date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <button className="add-button" onClick={handleDownload}>Download</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th onClick={() => handleSort('c_name')}>Customer Name {sortConfig.key === 'c_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('date')}>Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('d_name')}>Drug Name {sortConfig.key === 'd_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('quantity')}>Quantity {sortConfig.key === 'quantity' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('price')}>Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales
                                .filter((sale) => {
                                    const saleDate = new Date(sale.date);
                                    const start = new Date(startDate);
                                    const end = new Date(endDate);
                                    return saleDate >= start && saleDate <= end;
                                })
                                .map((sale, index) => (
                                    <tr key={sale.id}>
                                        <td>{index + 1}</td>
                                        <td>{sale.c_name}</td>
                                        <td>{new Date(sale.date).toLocaleDateString()}</td>
                                        <td>{sale.d_name}</td>
                                        <td>{sale.quantity}</td>
                                        <td>{sale.price}</td>
                          
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
         
        </div>
    );
};

export default Reports;
