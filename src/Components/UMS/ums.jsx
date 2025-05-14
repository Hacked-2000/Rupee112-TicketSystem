import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../Store/Reducers/umsSlice";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import UMSpop from "./umsPop";

const UMS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedUser, setSelectedUser] = useState(null);

  // const { users, loading, error } = useSelector((state) => state.ums);
  const { users, loading, error } = useSelector((state) => state.ums);
  const auth = useSelector((state) => state.auth);
  const masterRoles = auth.user?.master?.data || [];

  const dispatch = useDispatch();

// console.log(auth)
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, auth.user?.data?.token]);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // to get role name by role id..
  const getRoleName = (roleId) => {
    const role = masterRoles.find(r => r.id === roleId);
    return role ? role.name : 'User';
  };


  const handleFormSubmit = async (formData) => {
    const currentUser = auth.user.protected.user;
    try {
      if (modalMode === 'add') {
        await dispatch(createUser({ 
          ...formData, 
          created_by: currentUser.id 
        }));
        dispatch(fetchUsers());
      } else if (modalMode === 'edit') {
        await dispatch(updateUser({ 
          userId: selectedUser.id, 
          userData: { 
            ...formData, 
            updated_by: currentUser.id 
          }
        }));
        
        dispatch(fetchUsers());
      } else if (modalMode === 'delete') {
        await dispatch(deleteUser(selectedUser.id));
        dispatch(fetchUsers());
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <Typography>Loading users...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        User Management System
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search users..."
          InputProps={{ 
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} /> // Fixed to use SearchIcon
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => {
              setModalMode('add');
              setModalOpen(true);
            }}
          >
            Add User
          </Button>
        </motion.div>
      </Box>

      <UMSpop
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        userData={selectedUser}
        usersList={users}
        onSubmit={handleFormSubmit}
      />

      {error && <Typography color="error">{error}</Typography>}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "background.default" }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Box
                     component="span"
                      sx={{
                        p: "2px 8px",
                        borderRadius: 1,
                        bgcolor: user.role_id === 3 ? "primary.light" : "secondary.light",
                        color: user.role_id === 3 ? "primary.contrastText" : "secondary.contrastText",
                      }}
                    >
                      {getRoleName(user.role_id)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                       component="span"
                      sx={{
                        p: "2px 8px",
                        borderRadius: 1,
                        bgcolor: user.is_active === 1 ? "success.light" : "error.light",
                        color: user.is_active === 1 ? "success.contrastText" : "error.contrastText",
                      }}
                    >
                      {user.is_active === 1 ? "active" : "inactive"}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => {
                        setModalMode('edit');
                        setSelectedUser(user);
                        setModalOpen(true);
                      }}>
                        <EditIcon color="primary" /> 
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => {
                        setModalMode('delete');
                        setSelectedUser(user);
                        setModalOpen(true);
                      }}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Box>
  );
};

export default UMS;