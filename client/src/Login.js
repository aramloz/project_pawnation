import React, { useState } from 'react';
//import './Login.css'; // Make sure to import the appropriate CSS file for your Login component
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Here, you can perform your login logic, such as sending the email and password to the server
    // For demonstration purposes, we'll just show an error message if the fields are empty
    if (!username || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    // Clear any previous error message
    setErrorMessage('');

    // Prepare the data in JSON format
    const data = {
        username: username,
        password: password,
      };
  
      fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the server response
          if (data.success) {
            // If login is successful, redirect to the user's dashboard or desired page
            if (data.user.compte_type === 1) {
                navigate('/dashboard', { state: { username: username,  veterinaireId: data.veterinaireId } });
            } else {

            }
          } else {
            setErrorMessage(data.error || 'Login failed. Please check your credentials.');
          }
        })
        .catch((error) => {
          console.error('Error occurred during login:', error);
          setErrorMessage('An error occurred during login. Please try again later.');
        });
    };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
