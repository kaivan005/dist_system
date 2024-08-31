import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Drugs = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [drugs, setDrugs] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentDrug, setCurrentDrug] = useState({
        d_id: '',
        name: '',
        exp_date: '',
        quantity_available: '',
        low_stock_amount: '',
        h_id: '',
        s_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchDrugs();
    }, []);

    const fetchDrugs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/drugs');
            setDrugs(response.data);
        } catch (error) {
            console.error('Error fetching drugs:', error);
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
        setDrugs((prevDrugs) => {
            const sortedDrugs = [...prevDrugs];
            sortedDrugs.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedDrugs;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/drugs/${id}`);
            fetchDrugs(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting drug:', error);
        }
    };

    const handleEdit = (drug) => {
        setCurrentDrug(drug);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddMedicine = () => {
        setCurrentDrug({
            d_id: '',
            name: '',
            exp_date: '',
            quantity_available: '',
            low_stock_amount: '',
            h_id: '',
            s_id: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/drugs/${currentDrug.id}`, currentDrug);
            } else {
                await axios.post('http://localhost:5000/drugs', currentDrug);
            }
            fetchDrugs(); // Refresh the list after save
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
        setCurrentDrug({
            ...currentDrug,
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
                        <h2>All Drugs</h2>
                        <button className="add-button" onClick={handleAddMedicine}>Add Medicine</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('d_id')}>ID {sortConfig.key === 'd_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('exp_date')}>Expiry Date {sortConfig.key === 'exp_date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('quantity_available')}>Quantity Available{sortConfig.key === 'quantity_available' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('low_stock_amount')}>Low stock Threshold{sortConfig.key === 'low_stock_amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('h_id')}>Hospital ID {sortConfig.key === 'h_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('s_id')}>Supplier ID {sortConfig.key === 's_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drugs.map((drug, index) => (
                                <tr key={drug.id}>
                                    <td>{drug.d_id}</td>
                                    <td>{drug.name}</td>
                                    <td>{new Date(drug.exp_date).toLocaleDateString()}</td>
                                    <td>{drug.quantity_available}</td>
                                    <td>{drug.low_stock_amount}</td>
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
            <h3>{isEditing ? 'Edit Medicine' : 'Add Medicine'}</h3>
            <input
                type="text"
                name="d_id"
                placeholder="ID"
                value={currentDrug.d_id}
                onChange={handleChange}
            />
            <input
                type="number"
                name="name"
                placeholder="Name"
                value={currentDrug.name}
                onChange={handleChange}
            />
                <input
                    type="date"
                    name="exp_date"
                    placeholder="Expiry Date"
                    value={formatDate(currentDrug.exp_date)}
                    onChange={handleChange}
                />
            <input
                type="number"
                name="quantity_available"
                placeholder="Quantity Available"
                value={currentDrug.quantity_available}
                onChange={handleChange}
            />

            <input
                type="text"
                name="low_stock_amount"
                placeholder="Low Stock Amount"
                value={currentDrug.low_stock_amount}
                onChange={handleChange}
            />
            <input
                type="text"
                name="h_id"
                placeholder="Hospital ID"
                value={currentDrug.h_id}
                onChange={handleChange}
            />
            <input
                type="text"
                name="s_id"
                placeholder="Supplier ID"
                value={currentDrug.s_id}
                onChange={handleChange}
            />
            <div className="modal-actions">
                <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Medicine'}</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Drugs;
