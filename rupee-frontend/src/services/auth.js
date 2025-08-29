import { jwtDecode } from 'jwt-decode';

// Helper function to generate token with 24h expiration
const generateToken = (user) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const exp = now + (24 * 60 * 60); // 24 hours from now
  
  const payload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
    role_name: user.role_name,
    name: user.name,
    iat: now,
    exp: exp
  };
  
  // Convert payload to base64
  const base64Payload = btoa(JSON.stringify(payload));
  // Use a dummy signature since this is mock data
  const signature = 'dummy_signature';
  
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64Payload}.${signature}`;
};

// Login user
export const login = async (credentials) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => 
    u.email === credentials.user_email && 
    !u.is_deleted && 
    u.is_active
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const token = generateToken(user);
  
  return {
    status: "success",
    status_code: 200,
    message: "Login successful",
    data: { token }
  };
};

// Get protected data
export const getProtectedData = async (token) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const decoded = jwtDecode(token);
    return {
      status: "success",
      data: {
        user: decoded
      }
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Reset password
export const resetPassword = async (passwordData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.email === passwordData.email);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  return {
    status: "success",
    message: "Password updated successfully"
  };
};