import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UserForm.css';  // Include the CSS file for custom styling

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    fetchRoles();

    if (id) {
      axios.get(`http://localhost:8000/api/users/${id}`)
        .then(res => {
          const foundUser = res.data.data || res.data; // fallback if it's not wrapped in `data`
          setUser({
            name: foundUser.name || '',
            email: foundUser.email || '',
            password: '',
            role:
              typeof foundUser.roles?.[0] === 'string'
                ? foundUser.roles[0]
                : foundUser.roles?.[0]?.name || ''
          });
        })
        .catch(err => console.error('Error loading user:', err));
    }
  }, [id]);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/roles');
      setRoles(res.data);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (!id || user.password) {
      payload.password = user.password;
    }

    try {
      const url = id
        ? `http://localhost:8000/api/users/${id}`
        : `http://localhost:8000/api/users`;

      const method = id ? axios.put : axios.post;

      await method(url, payload);
      navigate('/users');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save user. Check console for details.');
    }
  };

  return (
    <div className="user-form-container">
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={user.name}
            placeholder="Enter name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={user.email}
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            placeholder={id ? "Leave blank to keep current password" : "Enter password"}
            onChange={handleChange}
            required={!id}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select name="role" id="role" value={user.role} onChange={handleChange} required>
            <option value="">-- Select Role --</option>
            {roles.map((role, idx) => (
              <option key={idx} value={role}>{role}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">{id ? 'Update' : 'Create'} User</button>
          <button type="button" onClick={() => navigate("/users")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
