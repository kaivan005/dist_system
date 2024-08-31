import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Patient = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [patient, setpatient] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentpatient, setCurrentpatient] = useState({
        u_id: '',
        name: '',
        email: '',
        password: '',
        role: '',
        h_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPatient();
    }, []);

    const fetchPatient = async () => {
        try {
            const response = await axios.get('http://localhost:5000/patient');
            setpatient(response.data);
        } catch (error) {
            console.error('Error fetching patient:', error);
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
        setpatient((prevpatient) => {
            const sortedpatient = [...prevpatient];
            sortedpatient.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedpatient;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/patient/${id}`);
            fetchPatient(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting drug:', error);
        }
    };

    const handleEdit = (drug) => {
        setCurrentpatient(drug);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddpatient = () => {
        setCurrentpatient({
            u_id: '',
            name: '',
            email: '',
            password: '',
            role: '',
            h_id: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/patient/${currentpatient.id}`, currentpatient);
            } else {
                await axios.post('http://localhost:5000/patient', currentpatient);
            }
            fetchPatient(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving Patient:', error);
        }
    };

    const handleChange = (e) => {
        setCurrentpatient({
            ...currentpatient,
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
                        <h2>Patient</h2>
                        <button className="add-button" onClick={handleAddpatient}>Add Patient</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')}>Name{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('drug_name')}>Drug Name{sortConfig.key === 'drug_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('qty')}>Quantity{sortConfig.key === 'qty' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('exp_date')}>Expiry Date{sortConfig.key === 'exp_date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patient.map((drug, index) => (
                                <tr key={drug.name}>
                                    <td>{drug.drug_name}</td>
                                    <td>{drug.qty}</td>
                                    <td>{drug.exp_date}</td>
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
            <h3>{isEditing ? 'Edit patient' : 'Add patient'}</h3>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={currentpatient.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="drug_name"
                placeholder="Drug Name"
                value={currentpatient.drug_name}
                onChange={handleChange}
            />
            <input
                type="number"
                name="qty"
                placeholder="Quantity"
                value={currentpatient.qty}
                onChange={handleChange}
            />
            <input
                type="text"
                name="exp_date"
                placeholder="Expiry Date"
                value={currentpatient.exp_date}
                onChange={handleChange}
            />
            <div className="modal-actions">
                <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add patient'}</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Patient;
