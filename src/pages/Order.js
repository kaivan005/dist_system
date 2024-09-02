import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Corrected import
import Sidebar from '../components/Sidebar'; // Corrected import
import './css/styles1.css';
import Select from 'react-select';
import ReactSelect from 'react-select';


const Orders = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
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
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/orders');
                const drugsWithHospitalNames = response.data.map(drug => {
                    const hospital = hospitals.find(hospital => hospital.hospital_id === drug.hospital_id);
                    const supplier = suppliers.find(supplier => supplier.supplier_id === drug.supplier_id);
                    return { ...drug, hospital_name: hospital ? hospital.name : 'Unknown Hospital', supplier_name: supplier ? supplier.name : 'Unknown Supplier' };
                });
                setOrders(drugsWithHospitalNames);
            } catch (error) {
                console.error('Error fetching drugs:', error);
            }
        };
    
        fetchOrders();
        fetchHospitals();
        fetchSuppliers();
    }, [hospitals, suppliers]);
    
    
    

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/orders');
            const drugsWithHospitalNames = response.data.map(drug => {
                const hospital = hospitals.find(hospital => hospital.hospital_id === drug.hospital_id);
                const supplier = suppliers.find(supplier => supplier.supplier_id === drug.supplier_id);
                return { ...drug, hospital_name: hospital ? hospital.name : 'Unknown Hospital', supplier_name: supplier ? supplier.name : 'Unknown Supplier' };
            });
            setOrders(drugsWithHospitalNames);
        } catch (error) {
            console.error('Error fetching drugs:', error);
        }
    };

    const fetchHospitals = async () => {
        try {
            const response = await axios.get('http://localhost:5000/hospital'); // Ensure this endpoint returns the correct data
            setHospitals(response.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/supplier'); // Ensure this endpoint returns the correct data
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
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

    // const handleHospitalChange = (selectedOption) => {
    //     setCurrentOrders({
    //         ...currentOrders,
    //         hospital_id: selectedOption.value,
    //     });
    // };

    // const handleSupplierChange = (selectedOption) => {
    //     setCurrentOrders({
    //         ...currentOrders,
    //         supplier_id: selectedOption.value,
    //     });
    // };
    const handleSelectChange = (selectedOption, actionMeta) => {
        setCurrentOrders({
            ...currentOrders,
            [actionMeta.name]: selectedOption ? selectedOption.value : ''
        });
    };

    // Define mapped options outside of JSX for clarity and reusability
    const hospitalOptions = hospitals.map(hospital => ({
        value: hospital.hospital_id, // Ensure 'hospital_id' is the correct key
        label: hospital.name
    }));

    const supplierOptions = suppliers.map(supplier => ({
        value: supplier.supplier_id, // Ensure 'supplier_id' is the correct key
        label: supplier.name
    }));
    return (
        <div className="dashboard-container">
                <Sidebar isOpen={isSidebarOpen} />
            <div className="main-content">
            <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />
                <div className="content">
                    <div className="header">
                        <h2>Orders</h2>
                        <button className="add-button" onClick={handleAddOrders}>Add Order</button>
                    </div>
                    <table className="drugs-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('order_id')}>ID{sortConfig.key === 'order_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('date')}>Date{sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('status')}>Status{sortConfig.key === 'status' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('hospital_id')}>Hospital{sortConfig.key === 'hospital_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th onClick={() => handleSort('supplier_id')}>Supplier{sortConfig.key === 'supplier_id' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                return (
                                    <tr key={order.order_id}>
                                        <td>{order.order_id}</td>
                                        <td>{new Date(order.date).toLocaleDateString()}</td>
                                        <td>{order.status}</td>
                                        <td>{order.hospital_name}</td>
                                        <td>{order.supplier_name}</td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(order)}>Edit</button>
                                            <button className="delete-button" onClick={() => handleDelete(order.order_id)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                       <ReactSelect
                            name="hospital_id"
                            value={hospitalOptions.find(option => option.value === currentOrders.hospital_id) || null}
                            onChange={handleSelectChange}
                            options={hospitalOptions}
                            placeholder="Select Hospital"
                            className='dib'
                        />
                        <ReactSelect
                            name="supplier_id"
                            value={supplierOptions.find(option => option.value === currentOrders.supplier_id) || null}
                            onChange={handleSelectChange}
                            options={supplierOptions}
                            placeholder="Select Supplier"
                            className='dib'
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
