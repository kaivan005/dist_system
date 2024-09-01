import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/style.css';

function LoginPage() {
    const [email, setEmail] = useState(''); // Controlled input for email
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAuth = (e) => {
        e.preventDefault(); // Prevent default form submission

        if (email === "") {
            alert("Enter Email");
            return;
        }
        if (password === "") {
            alert("Enter Password");
            return;
        }

        const url = 'http://localhost:5000/login';
        axios.post(url, { email, password })
            .then(response => {
                const { role, token } = response.data;
                localStorage.setItem('role', role);
                localStorage.setItem('token', token);

                if (role === 'admin') {
                    navigate('/dashboard');
                } else if (role === 'procurement_officer') {
                    navigate('/pro_dashboard');
                } else if (role === 'pharmacy_manager') {
                    navigate('/p_dashboard');
                }

                window.location.reload();
            })
            .catch(error => {
                console.error('Login error', error);
                // Check if there's an error message in the response
                const errorMessage = error.response?.data?.message || 'An error occurred during login. Please try again.';
                alert(errorMessage);
            });
    };

    return (
        <div className="body">
            <div className="container">
                <div className="forms-container">
                    <div className="form-control signin-form">
                        <form>
                            <h2>Signin</h2>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" onClick={handleAuth}>
                                Signin
                            </button>
                        </form>
                        <span>or signin with</span>
                        <div className="socials">
                            <i className="fab fa-google-plus-g"></i>
                        </div>
                    </div>
                </div>
                <div className="intros-container">
                    <div className="intro-control signin-intro">
                        <div className="intro-control__inner">
                            <h2>Welcome back!</h2>
                            <p>
                                Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
