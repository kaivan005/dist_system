import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';
import Select from 'react-select';

const Orders = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentOrders, setCurrentOrders] = useState({
        order_id: '',
        date: '',
        status: '',
        hospital_id: '',
        supplier_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
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
            await axios.delete(`http://localhost:5000/orders/${id}`);
            fetchOrders(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleEdit = (order) => {
        setCurrentOrders(order);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddOrders = () => {
        setCurrentOrders({
            order_id: '',
            date: '',
            status: '',
            hospital_id: '',
            supplier_id: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/orders/${currentOrders.order_id}`, currentOrders);
            } else {
                await axios.post('http://localhost:5000/orders', currentOrders);
            }
            fetchOrders(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving order:', error);
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
        const { name, value } = e.target;
        setCurrentOrders({
            ...currentOrders,
            [name]: value,
        });
    };

    const handleStatusChange = (selectedOption) => {
        setCurrentOrders({
            ...currentOrders,
            status: selectedOption.value,
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
                        <button className="add-button" onClick={handleAddOrders}>Add Order</button>
                    </div>
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('order_id')}>ID{sortConfig.key === 'order_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('date')}>Date{sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('status')}>Status{sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('hospital_id')}>Hospital ID{sortConfig.key === 'hospital_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('supplier_id')}>Supplier ID{sortConfig.key === 'supplier_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order.order_id}>
                                    <td>{order.order_id}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>{order.status}</td>
                                    <td>{order.hospital_id}</td>
                                    <td>{order.supplier_id}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(order)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(order.order_id)}>Delete</button>
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
                        <h3>{isEditing ? 'Edit Order' : 'Add Order'}</h3>
                        <input
                            type="text"
                            name="order_id"
                            placeholder="ID"
                            value={currentOrders.order_id}
                            onChange={handleChange}
                            disabled
                        />
                        <input
                            type="date"
                            name="date"
                            placeholder="Date"
                            value={formatDate(currentOrders.date)}
                            onChange={handleChange}
                        />
                        <Select
                            name="status"
                            value={statusOptions.find(option => option.value === currentOrders.status)}
                            onChange={handleStatusChange}
                            options={statusOptions}
                            placeholder="Select Status"
                            className='dib'
                        />
                        <input
                            type="text"
                            name="hospital_id"
                            placeholder="Hospital ID"
                            value={currentOrders.hospital_id}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="supplier_id"
                            placeholder="Supplier ID"
                            value={currentOrders.supplier_id}
                            onChange={handleChange}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Order'}</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
