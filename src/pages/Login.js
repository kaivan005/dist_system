import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/style.css';

function LoginRegisterForm() {
    const [email, setEmail] = useState(''); // Controlled input for email
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleAuth = () => {
        if (!isRegister && email === ""){
            alert("Enter Email");
            return;
        }
        else if (!isRegister && password === ""){
            alert("Enter Password")
            return;
        }
      
        const url = isRegister ? 'http://localhost:5000/register' : 'http://localhost:5000/login';
        axios.post(url, { email, password })
            .then(response => {
                if (!isRegister) {
                    localStorage.setItem('username', response.data.username);
                    localStorage.setItem('token', response.data.token);
                    navigate('/dashboard');
                    window.location.reload(); 
                } else {
                    alert('Registration successful!');
                    setIsRegister(false);
                }
            })
            .catch(error => {
                console.error(isRegister ? 'Registration error' : 'Login error', error);
                alert(error.response.data.message);
            });
    };

    return (
        <div className="body">
        <div className={`container ${isRegister ? 'change' : ''}`}>
            <div className="forms-container">
                <div className="form-control signup-form">
                   
                    <span>or signup with</span>
                    <div className="socials">                        
                        <i className="fab fa-google-plus-g"></i>
                    </div>
                </div>
                <div className="form-control signin-form">
                    <form>
                        <h2>Signin</h2>
                        <input
                            type="email"
                            placeholder="Username"
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

export default LoginRegisterForm;
