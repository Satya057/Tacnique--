import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "./User";
import "../styles/styles.css";
import { config } from "../App";
import UserForm from "./UserForm";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/**
 * Component for the user list.
 */
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 13;  // Set users per page to 13

  /**
   * Fetch users from the API.
   */
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${config.endpoint}/users`);
      setUsers(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Handle adding or editing a user.
   * @param {Object} user - The user data.
   */
  const handleAddOrEditUser = (user) => {
    if (selectedUser) {
      setUsers(users.map(u => (u.id === user.id ? user : u)));
      toast.success("User updated successfully!");
    } else {
      // Calculate new user ID based on the current maximum ID
      const newUser = {
        ...user,
        id: Math.max(...users.map(u => u.id)) + 1,
      };
      setUsers([...users, newUser]);
      toast.success("User added successfully!");
    }
    setShowForm(false);
  };

  /**
   * Handle deleting a user.
   * @param {number} id - The ID of the user to delete.
   */
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${config.endpoint}/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to delete user.");
    }
  };

  /**
   * Handle editing a user.
   * @param {Object} userData - The user data to edit.
   */
  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setShowForm(true);
  };

  /**
   * Change page.
   * @param {number} pageNumber - The page number to navigate to.
   */
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="user-list-container">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="header-container">
        <h1 className="user-list-heading">User List</h1>
        <button
          className="add-user-button"
          onClick={() => {
            setSelectedUser(null);
            setShowForm(true);
          }}
        >
          Add User
        </button>
      </div>

      {showForm && (
        <UserForm
          setShowForm={setShowForm}
          handleAddOrEditUser={handleAddOrEditUser}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <User
              key={user.id}
              userData={user}
              setShowForm={setShowForm}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <div className="pagination">
        <button 
          className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`} 
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="pagination-page">{currentPage}</span>
        <button 
          className={`pagination-button ${currentPage === Math.ceil(users.length / usersPerPage) ? 'disabled' : ''}`} 
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
        >
          Next
        </button>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .user-list-container {
          max-width: 80%;
          margin: 40px auto;
          padding: 20px;
          background-color: #f0f4f8;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .header-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
        }

        .user-list-heading {
          margin: 0;
          color: #333;
        }

        .user-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          animation: slideUp 0.6s ease-in-out;
        }

        .user-table th,
        .user-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        .user-table th {
          background-color: #007bff;
          color: white;
        }

        .user-table tr:nth-child(even) {
          background-color: #e6f7ff;
        }

        .add-user-button {
          padding: 10px 20px;
          margin-top: 10px;
          border: none;
          border-radius: 8px;
          background-color: #007bff;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-user-button:hover {
          background-color: #0056b3;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .pagination-button {
          padding: 8px 16px;
          margin: 0 5px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .pagination-button.disabled {
          background-color: #d6e0f0;
          cursor: not-allowed;
        }

        .pagination-button:not(.disabled):hover {
          background-color: #0056b3;
        }

        .pagination-page {
          padding: 8px 16px;
          margin: 0 5px;
          background-color: #f0f4f8;
          border-radius: 4px;
          font-size: 14px;
        }

        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 5px;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }

        .edit-button {
          background-color: #007bff;
          color: white;
        }

        .edit-button:hover {
          background-color: #0056b3;
          transform: scale(1.05);
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
        }

        .delete-button:hover {
          background-color: #c82333;
          transform: scale(1.05);
        }

        .error {
          color: red;
          margin-bottom: 10px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .user-list-container {
            max-width: 90%;
          }
        }

        @media (max-width: 768px) {
          .user-list-container {
            max-width: 95%;
          }

          .user-table th,
          .user-table td {
            padding: 10px;
            font-size: 14px;
          }

          .add-user-button {
            width: 100%;
            padding: 10px 0;
          }
        }

        @media (max-width: 480px) {
          .user-list-container {
            padding: 15px;
          }

          .user-table th,
          .user-table td {
            font-size: 12px;
          }

          .add-user-button {
            font-size: 14px;
            padding: 10px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UserList;
