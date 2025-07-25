import { useState } from 'react';
import { mockUsers } from '../data/mockData';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const handleUpdateRole = (userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    setActionMessage(`User role updated to ${newRole} (PUT /api/users/${userId}/role)`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    setActionMessage(`User deleted (DELETE /api/users/${userId})`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleToggleStatus = (userId) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
    setActionMessage(`User status toggled (PATCH /api/users/${userId}/status)`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleBulkAction = (action) => {
    setActionMessage(`Bulk action: ${action} (POST /api/users/bulk/${action})`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and system settings</p>
      </div>

      {actionMessage && (
        <div className="action-message">
          <p>{actionMessage}</p>
        </div>
      )}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Admin Users</h3>
          <p>{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="stat-card">
          <h3>Regular Users</h3>
          <p>{users.filter(u => u.role === 'user').length}</p>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Bulk Actions</h2>
        <div className="bulk-actions">
          <button 
            onClick={() => handleBulkAction('activate')}
            className="bulk-button"
          >
            Activate All Users
          </button>
          <button 
            onClick={() => handleBulkAction('deactivate')}
            className="bulk-button"
          >
            Deactivate All Users
          </button>
          <button 
            onClick={() => handleBulkAction('export')}
            className="bulk-button"
          >
            Export User Data
          </button>
          <button 
            onClick={() => handleBulkAction('backup')}
            className="bulk-button"
          >
            Create Backup
          </button>
        </div>
      </div>

      <div className="users-section">
        <h2>User Management</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{formatDate(user.lastLogin)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <select 
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        value={user.role}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`status-button ${user.status === 'active' ? 'deactivate' : 'activate'}`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-settings">
        <h2>System Settings</h2>
        <div className="settings-grid">
          <div className="setting-card">
            <h3>Database Configuration</h3>
            <p>Manage database connections and settings</p>
            <button className="setting-button">Configure DB</button>
          </div>
          
          <div className="setting-card">
            <h3>Security Settings</h3>
            <p>Configure authentication and authorization</p>
            <button className="setting-button">Security Config</button>
          </div>
          
          <div className="setting-card">
            <h3>API Management</h3>
            <p>Manage API keys and endpoints</p>
            <button className="setting-button">API Settings</button>
          </div>
          
          <div className="setting-card">
            <h3>System Logs</h3>
            <p>View and manage system logs</p>
            <button className="setting-button">View Logs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 