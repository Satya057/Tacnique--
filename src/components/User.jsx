import React from "react";

/**
 * Component for displaying user data in a table row.
 * @param {Object} props - Component props.
 * @param {Object} props.userData - The user data object.
 * @param {Function} props.handleEditUser - Function to handle user editing.
 * @param {Function} props.handleDeleteUser - Function to handle user deletion.
 */
const User = ({ userData, handleEditUser, handleDeleteUser }) => {
  if (!userData) {
    return null; // Don't render anything if userData is undefined
  }

  // Provide default values to prevent undefined errors
  const nameParts = (userData.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts[1] || "";
  const email = userData.email || "";
  const department = userData.company?.name || "";

  /**
   * Handle edit button click.
   */
  const handleEdit = () => {
    handleEditUser(userData);
  };

  /**
   * Handle delete button click.
   */
  const handleDelete = () => {
    handleDeleteUser(userData.id);
  };

  return (
    <tr>
      <td>{userData.id}</td>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td>{department}</td>
      <td>
        <button className="action-button edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button className="action-button delete-button" onClick={handleDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default User;
