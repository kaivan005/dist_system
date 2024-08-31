import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Orders = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [Orders, setOrders] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentOrders, setCurrentOrders] = useState({
        o_id: '',
        date: '',
        status: '',
        h_id: '',
        s_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/Orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching Orders:', error);
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
        setOrders((prevOrders) => {
            const sortedOrders = [...prevOrders];
            sortedOrders.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedOrders;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/Orders/${id}`);
            fetchOrders(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting drug:', error);
        }
    };

    const handleEdit = (drug) => {
        setCurrentOrders(drug);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddOrders = () => {
        setCurrentOrders({
            o_id: '',
            date: '',
            status: '',
            h_id: '',
            s_id: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/Orders/${currentOrders.id}`, currentOrders);
            } else {
                await axios.post('http://localhost:5000/Orders', currentOrders);
            }
            fetchOrders(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving drug:', error);
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const handleChange = (e) => {
        setCurrentOrders({
            ...currentOrders,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="dashboard-container">
            <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} isOpen={isSidebarOpen} />
            <div className="main-content">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="content">
                    <div className="header">
                        <h2>Orders</h2>
                        <button className="add-button" onClick={handleAddOrders}>Add Orders</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('o_id')}>ID{sortConfig.key === 'o_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('date')}>Date{sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('status')}>Status{sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('h_id')}>Hospital ID{sortConfig.key === 'h_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('s_id')}>Supplier ID{sortConfig.key === 's_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Orders.map((drug, index) => (
                                <tr key={drug.o_id}>
                                    <td>{new Date(drug.date).toLocaleDateString()}</td>
                                    <td>{drug.status}</td>
                                    <td>{drug.h_id}</td>
                                    <td>{drug.s_id}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(drug)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(drug.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showModal && (
    <div className="modal">
        <div className="modal-content">
            <h3>{isEditing ? 'Edit Orders' : 'Add Orders'}</h3>
            <input
                type="text"
                name="o_id"
                placeholder="ID"
                value={currentOrders.o_id}
                onChange={handleChange}
            />
            <input
            type="date"
            name="date"
            placeholder="Date"
            value={formatDate(currentOrders.date)}
            onChange={handleChange}
        />
            <input
                type="text"
                name="status"
                placeholder="Status"
                value={currentOrders.status}
                onChange={handleChange}
            />
            <input
                type="text"
                name="h_id"
                placeholder="Hospital ID"
                value={currentOrders.h_id}
                onChange={handleChange}
            />
            <input
                type="text"
                name="s_id"
                placeholder="Supplier ID"
                value={currentOrders.s_id}
                onChange={handleChange}
            />
            <div className="modal-actions">
                <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Orders'}</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Orders;
