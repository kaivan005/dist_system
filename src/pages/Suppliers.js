import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import './css/styles1.css';

const Supplier = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setSupplier] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentSupplier] = useState({
        s_id: '',
        name: '',
        contact_details: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchSupplier();
    }, []);

    const fetchSupplier = async () => {
        try {
            const response = await axios.get('http://localhost:5000/supplier');
            setSupplier(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
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
        setSupplier((prevSupplier) => {
            const sortedSupplier = [...prevSupplier];
            sortedSupplier.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sortedSupplier;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/supplier/${id}`);
            fetchSupplier(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting Supplier:', error);
        }
    };

    const handleEdit = (drug) => {
        setCurrentSupplier(drug);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddSupplier = () => {
        setCurrentSupplier({
            s_id: '',
            name: '',
            contact_details: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/supplier/${currentUser.id}`, currentUser);
            } else {
                await axios.post('http://localhost:5000/supplier', currentUser);
            }
            fetchSupplier(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving drug:', error);
        }
    };

    const handleChange = (e) => {
        setCurrentSupplier({
            ...currentUser,
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
                        <h2>Supplier</h2>
                        <button className="add-button" onClick={handleAddSupplier}>Add Supplier</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('s_id')}>ID{sortConfig.key === 's_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('name')}>Name{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('contact_details')}>Contact Details{sortConfig.key === 'contact_details' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((drug, index) => (
                                <tr key={drug.s_id}>
                                    <td>{drug.name}</td>
                                    <td>{drug.contact_details}</td>
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
            <h3>{isEditing ? 'Edit Supplier' : 'Add Supplier'}</h3>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={currentUser.name}
                onChange={handleChange}
            />
            <input
                type="number"
                name="contact_details"
                placeholder="Contact Details"
                value={currentUser.contact_details}
                onChange={handleChange}
            />
            <div className="modal-actions">
                <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add Supplier'}</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Supplier;
