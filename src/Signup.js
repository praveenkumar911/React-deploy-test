// Signup.js
import React, { useState } from 'react';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'NGO', // Default role
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(formData);
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="NGO">NGO</option>
          <option value="Dev">Developer</option>
          <option value="Core">Core</option>
          <option value="Org">Organization</option>
        </select>

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
