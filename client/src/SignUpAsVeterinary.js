import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpAsVeterinary() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState('');
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Check if the code starts with "88"
    if (!code.startsWith('88')) {
        setMessage('Invalid code.');
        return;
    }

    // Prepare the data in JSON format
    const data = {
        username: username,
        password: password,
        type: 1
    };

    fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the server response
        if (data.success) {
            // If sign-up is successful, redirect to the Veterinary Dashboard
            navigate('/dashboard', { state: { username: username,  veterinaireId: data.veterinaireId } });
        } else {
            setMessage('Failed to create an account. Please try again later.');
        }
    })
    .catch(error => {
      setMessage("Error occurred during account creation.");
    });
  };

  return (
    <div>
      <h2>Sign Up as Veterinary</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="code">Code:</label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignUpAsVeterinary;
