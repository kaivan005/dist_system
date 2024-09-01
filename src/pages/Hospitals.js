import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Hospitals = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [Hospital, setHospital] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentHospital, setCurrentHospital] = useState({
        hospital_id: '',
        name: '',
        location: '',
        conatact_details: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/hospital');
            setHospital(response.data);
        } catch (error) {
            console.error('Error fetching Hospital:', error);
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
        setHospital((prevHospital) => {
            const sortedHospital = [...prevHospital];
            sortedHospital.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedHospital;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/hospital/${id}`);
            fetchHospitals(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting Hospital:', error);
        }
    };

    const handleEdit = (Hospital) => {
        setCurrentHospital(Hospital);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddHospital = () => {
        setCurrentHospital({
            hospital_id: '',
            name: '',
            location: '',
            conatact_details: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/hospital/${currentHospital.hospital_id}`, currentHospital);
            } else {
                await axios.post('http://localhost:5000/hospital', currentHospital);
            }
            fetchHospitals(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving Hospital:', error);
        }
    };

    const handleChange = (e) => {
        setCurrentHospital({
            ...currentHospital,
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
                        <h2>Hospitals</h2>
                        <button className="add-button" onClick={handleAddHospital}>Add Hospital</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('hospital_id')}>ID {sortConfig.key === 'hospital_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('name')}>Name{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('location')}>Location {sortConfig.key === 'location' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('contact_details')}>Contact Details{sortConfig.key === 'contact_details' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Hospital.map((Hospital, index) => (
                                <tr key={Hospital.hospital_id}>
                                    <td>{Hospital.hospital_id}</td>
                                    <td>{Hospital.name}</td>
                                    <td>{Hospital.location}</td>
                                    <td>{Hospital.contact_details}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(Hospital)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(Hospital.hospital_id)}>Delete</button>
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
            <h3>{isEditing ? 'Edit Hospital' : 'Add Hospital'}</h3>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={currentHospital.name}
                onChange={handleChange}
            />
            <input
                type="text"
                name="location"
                placeholder="Location"
                value={currentHospital.location}
                onChange={handleChange}
            />
            <input
                type="tel"
                name="contact_details"
                placeholder="Contact details"
                value={currentHospital.contact_details}
                onChange={handleChange}
            />
            <div className="modal-actions">
                <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Hospital'}</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Hospitals;
