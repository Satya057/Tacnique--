import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../App";

/**
 * Component for the user form.
 * @param {Object} props - Component props.
 * @param {Function} props.setShowForm - Function to show/hide the form.
 * @param {Function} props.handleAddOrEditUser - Function to handle adding or editing a user.
 * @param {Object|null} props.selectedUser - The selected user data for editing, or null for adding a new user.
 * @param {Function} props.setSelectedUser - Function to set the selected user.
 */
const UserForm = ({ setShowForm, handleAddOrEditUser, selectedUser, setSelectedUser }) => {
  const [formData, setFormData] = useState({
    name: selectedUser ? selectedUser.name : "",
    email: selectedUser ? selectedUser.email : "",
    company: {
      name: selectedUser ? selectedUser.company.name : "",
    },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        company: {
          name: selectedUser.company.name,
        },
      });
    }
  }, [selectedUser]);

  /**
   * Handle input change.
   * @param {Object} e - Event object.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission.
   * @param {Object} e - Event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company.name) {
      setError("All fields are required.");
      return;
    }
    const method = selectedUser ? 'put' : 'post';
    const endpoint = selectedUser ? `${config.endpoint}/users/${selectedUser.id}` : `${config.endpoint}/users`;

    axios[method](endpoint, formData)
      .then(response => {
        handleAddOrEditUser(response.data);
        setFormData({
          name: "",
          email: "",
          company: {
            name: "",
          },
        });
        setSelectedUser(null);
        setShowForm(false);
      })
      .catch(err => setError(err.message));
  };

  /**
   * Handle form cancellation.
   */
  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      company: "",
    });
    setSelectedUser(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{selectedUser ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit} className="user-form">
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">Department</label>
            <input
              type="text"
              name="company"
              placeholder="Department"
              value={formData.company.name}
              onChange={(e) => setFormData({ ...formData, company: { name: e.target.value } })}
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="primary-button">{selectedUser ? 'Save Changes' : "Add"}</button>
            <button type="button" className="secondary-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background-color: #fff;
          padding: 30px;
          border-radius: 8px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in-out;
        }

        .modal h2 {
          margin-top: 0;
          color: #333;
          font-size: 18px;
          margin-bottom: 20px;
        }

        .user-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          margin-bottom: 8px;
          color: #333;
        }

        .user-form input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          color: #333;
          transition: border-color 0.3s;
        }

        .user-form input:focus {
          border-color: #007bff;
          outline: none;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .primary-button {
          padding: 10px 20px;
          border-radius: 4px;
          background-color: #7f56d9;
          color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .primary-button:hover {
          background-color: #693bb7;
        }

        .secondary-button {
          padding: 10px 20px;
          border-radius: 4px;
          background-color: transparent;
          color: #333;
          border: none;
          cursor: pointer;
          margin-right: 10px;
        }

        .secondary-button:hover {
          color: #000;
        }

        .error {
          color: red;
          margin-bottom: 15px;
          text-align: center;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .modal {
            padding: 20px;
            max-width: 95%;
          }

          .user-form input {
            font-size: 14px;
          }

          .primary-button, .secondary-button {
            padding: 10px;
            font-size: 14px;
          }
        }

        @media (max-width: 480px) {
          .modal {
            padding: 15px;
          }

          .user-form input {
            font-size: 14px;
            padding: 10px;
          }

          .primary-button, .secondary-button {
            padding: 8px 12px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserForm;
