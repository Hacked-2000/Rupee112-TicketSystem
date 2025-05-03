// src/Components/umsPop.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { useSelector } from 'react-redux';

const umsPop = ({ open, onClose, mode, userData, usersList, onSubmit }) => {
    const {user} = useSelector((state) => state.auth);
    const masterRole = user?.master?.data || [];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    reporting: '',
    is_active: 1,
    lms_user_id: '',
    created_by: user?.id || '',
  });

//   console.log(masterRole);
  
//   const availableRoles = Array.isArray(masterRole) ? masterRole : [];

  useEffect(() => {
    if (mode === 'edit' && userData) {
      setFormData({
        name: userData.name,
        email: userData.email,
        role_id: userData.role_id,
        reporting: userData.reporting,
        is_active: userData.is_active,
        lms_user_id: userData.lms_user_id || '',
        created_by: userData.created_by ,
      });
    } else if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        password: '',
        role_id: '',
        reporting: '',
        is_active: 1,
        lms_user_id: '',
        created_by: user?.id || '',
      });
    }
  }, [mode, userData, user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    let submitData = { ...formData };

    if (mode === 'add') {
      submitData.created_by = user?.id;
    } else if (mode === 'edit') {
      // Remove email and password before submitting
      const { email, password, ...rest } = formData;
      submitData = rest;
    }

    onSubmit(submitData);
    onClose();
  };

  const getRoleName = (roleId) => {
    const role = masterRole.find(r => r.id === roleId);
    return role ? role.name : 'User';
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'add' ? 'Add User' : mode === 'edit' ? 'Edit User' : 'Delete User'}
      </DialogTitle>
      <DialogContent>
        {mode === 'delete' ? (
          <Typography>Delete user {userData?.name}?</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="LMS User ID"
              name="lms_user_id"
              value={formData.lms_user_id}
              onChange={handleChange}
              fullWidth
            />
            {mode === 'add' && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            )}
            <TextField
              select
              label="Role"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              fullWidth
              required
            >
                            {masterRole.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}

            </TextField>
            <TextField
              select
              label="Reporting To"
              name="reporting"
              value={formData.reporting}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {/* <MenuItem value="">None</MenuItem> */}
              {usersList.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({getRoleName(user.role_id)})
                </MenuItem>
              ))}
            </TextField>
            {mode === 'edit' && (
              <TextField
                select
                label="Status"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Inactive</MenuItem>
              </TextField>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color={mode === 'delete' ? 'error' : 'primary'}
          disabled={mode !== 'delete' && (!formData.name || !formData.email || !formData.role_id)}
        >
          {mode === 'delete' ? 'Confirm Delete' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default umsPop;