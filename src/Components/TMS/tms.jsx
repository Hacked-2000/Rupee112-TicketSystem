import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Chip,
  Avatar,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as ResolvedIcon,
  Assignment as TicketIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data - replace with API calls in a real application
const tickets = [
  { 
    id: 1, 
    title: 'Login issue', 
    description: 'Cannot login to the system', 
    status: 'open', 
    priority: 'high',
    createdBy: 'Rohan Raj',
    assignedTo: 'Admin User',
    createdAt: '2023-05-01',
  },
  { 
    id: 2, 
    title: 'Dashboard not loading', 
    description: 'Dashboard takes too long to load', 
    status: 'in-progress', 
    priority: 'medium',
    createdBy: 'Nisha Sharma',
    assignedTo: 'Admin User',
    createdAt: '2023-05-02',
  },
  { 
    id: 3, 
    title: 'Profile update', 
    description: 'Need to update profile picture', 
    status: 'resolved', 
    priority: 'low',
    createdBy: 'Rinku Singh',
    assignedTo: 'Admin User',
    createdAt: '2023-05-03',
  },
];

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
};

const statusColors = {
  open: 'info',
  'in-progress': 'primary',
  resolved: 'success',
};

const TMS = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openTicket, setOpenTicket] = useState('');
  const navigate = useNavigate();

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenTicket = ()=>{
    navigate("/openTicket");
  }


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Ticket Management System
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search tickets..."
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />
        <motion.div whileHover={{ scale: 1.05 }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Ticket
          </Button>
        </motion.div>
      </Box>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <Badge badgeContent={ticket.id} color="primary">
                      <TicketIcon color="action" />
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {ticket.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.priority} 
                      color={priorityColors[ticket.priority]} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={ticket.status} 
                      color={statusColors[ticket.status]} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {ticket.createdBy.charAt(0)}
                      </Avatar>
                      {ticket.createdBy}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                        {ticket.assignedTo.charAt(0)}
                      </Avatar>
                      {ticket.assignedTo}
                    </Box>
                  </TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell align="center">
                  <Button onClick={handleOpenTicket}>Open</Button>
                    {/* <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Resolve">
                      <IconButton>
                        <ResolvedIcon color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip> */}
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

export default TMS;