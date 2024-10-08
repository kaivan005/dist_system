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
        patient_id: '',
        drug_id: '',
        patient_name: '',
        drug_qty: '',
        exp_date: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchPatient();
    }, []);

    const fetchPatient = async () => {
        try {
            const response = await axios.get('http://localhost:5000/patients');
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
            await axios.delete(`http://localhost:5000/patients/${id}`);
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
            patient_id: '',
            drug_id: '',
            patient_name: '',
            drug_qty: '',
            exp_date: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/patients/${currentpatient.patient_id}`, currentpatient);
            } else {
                await axios.post('http://localhost:5000/patients', currentpatient);
            }
            fetchPatient(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving Patient:', error);
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
                                <th onClick={() => handleSort('patient_id')}>ID{sortConfig.key === 'patient_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('drug_id')}>Drug ID{sortConfig.key === 'drug_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('patient_name')}>Patient Name{sortConfig.key === 'patient_name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('drug_qty')}>Quantity{sortConfig.key === 'drug_qty' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('exp_date')}>Expiry Date{sortConfig.key === 'exp_date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patient.map((drug, index) => (
                                <tr key={drug.patient_id}>
                                    <td>{drug.patient_id}</td>
                                    <td>{drug.drug_id}</td>
                                    <td>{drug.patient_name}</td>
                                    <td>{drug.drug_qty}</td>
                                    <td>{new Date(drug.exp_date).toLocaleDateString()}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(drug)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(drug.patient_id)}>Delete</button>
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
                name="patient_name"
                placeholder="Name"
                value={currentpatient.patient_name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="drug_id"
                placeholder="Drug ID"
                value={currentpatient.drug_id}
                onChange={handleChange}
            />
            <input
                type="number"
                name="drug_qty"
                placeholder="Quantity"
                value={currentpatient.drug_qty}
                onChange={handleChange}
            />
            <input
                type="date"
                name="exp_date"
                placeholder="Expiry Date"
                value={formatDate(currentpatient.exp_date)}
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
