// import api from './api';

// Get all users with pagination
export const getUsers = async (page = 1, limit = 25, roleId = 0) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Apply role filter if specified
  if (roleId > 0) {
    users = users.filter(user => user.role_id === roleId);
  }
  
  // Calculate pagination
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    status: "success",
    status_code: 200,
    message: "Users fetched successfully",
    data: {
      users: users.slice(startIndex, endIndex),
      total: totalItems,
      page,
      limit
    }
  };
};

// Get user by ID
export const getUserById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === parseInt(id));
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return {
    status: "success",
    data: user
  };
};

// Create new user
export const createUser = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    ...userData,
    id: users.length + 1,
    is_active: 1,
    is_deleted: 0,
    created_at: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return {
    status: "success",
    data: newUser
  };
};

// Update user
export const updateUser = async (id, userData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...userData,
    updated_at: new Date().toISOString()
  };
  
  localStorage.setItem('users', JSON.stringify(users));
  
  return {
    status: "success",
    data: users[userIndex]
  };
};

// Delete user
export const deleteUser = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === parseInt(id));
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  users[userIndex].is_deleted = 1;
  localStorage.setItem('users', JSON.stringify(users));
  
  return {
    status: "success",
    message: "User deleted successfully"
  };
};

// Get all roles
export const getRoles = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    status: "success",
    data: [
      { id: 1, name: "Admin" },
      { id: 2, name: "Manager" },
      { id: 3, name: "Support" },
      { id: 4, name: "Agent" }
    ]
  };
};