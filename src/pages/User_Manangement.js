import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Sidebar';
import Sidebar from '../components/Navbar';
import Select from 'react-select';
import './css/styles1.css';

const Users = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setuser] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        user_id: '',
        name: '',
        email: '',
        password: '',
        role: '',
        hospital_id: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const roleOptions = [
        { value: 'admin', label: 'Admin' },
        { value: 'procurement_officer', label: 'Procurement Officer' },
        { value: 'pharmacy_manager', label: 'Pharmacy Manager' }
        // Add more roles as needed
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/user');
            setuser(response.data);
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
        setuser((prevuser) => {
            const sorteduser = [...prevuser];
            sorteduser.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
            return sorteduser;
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/user/${id}`);
            fetchUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddUser = () => {
        setCurrentUser({
            user_id: '',
            name: '',
            email: '',
            password: '',
            role: '',
            hospital_id: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/user/${currentUser.user_id}`, currentUser);
            } else {
                await axios.post('http://localhost:5000/user', currentUser);
            }
            fetchUsers(); // Refresh the list after save
            setShowModal(false);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({
            ...currentUser,
            [name]: value,
        });
    };

    const handleRoleChange = (selectedOption) => {
        setCurrentUser({
            ...currentUser,
            role: selectedOption.value,
        });
    };

    return (
        <div className="dashboard-container">
            <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} isOpen={isSidebarOpen} />
            <div className="main-content">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="content">
                    <div className="header">
                        <h2>Users</h2>
                        <button className="add-button" onClick={handleAddUser}>Add User</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('user_id')}>ID{sortConfig.key === 'user_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('name')}>Name{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('email')}>E-Mail{sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('role')}>Role{sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('hospital_id')}>Hospital ID{sortConfig.key === 'hospital_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((user, index) => (
                                <tr key={user.id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.hospital_id}</td>
                                    <td>
                                        <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="delete-button" onClick={() => handleDelete(user.user_id)}>Delete</button>
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
                        <h3>{isEditing ? 'Edit User' : 'Add User'}</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={currentUser.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={currentUser.email}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="password"
                            placeholder="Password"
                            value={currentUser.password}
                            onChange={handleChange}
                        />
                        <Select
                            name="role"
                            value={roleOptions.find(option => option.value === currentUser.role)}
                            onChange={handleRoleChange}
                            options={roleOptions}
                            placeholder="Select Role"
                            className='dib'
                        />
                        <input
                            type="text"
                            name="hospital_id"
                            placeholder="Hospital ID"
                            value={currentUser.hospital_id}
                            onChange={handleChange}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSave}>{isEditing ? 'Save Changes' : 'Add User'}</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
