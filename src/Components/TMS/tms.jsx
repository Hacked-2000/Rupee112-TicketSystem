import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as ResolvedIcon,
  Assignment as TicketIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets, setCurrentPage } from "../../Store/Reducers/tmsSlice";

// Mock data - replace with API calls in a real application
// const tickets = [
//   {
//     id: 1,
//     title: 'Login issue',
//     description: 'Cannot login to the system',
//     status: 'open',
//     priority: 'high',
//     createdBy: 'Rohan Raj',
//     assignedTo: 'Admin User',
//     createdAt: '2023-05-01',
//   },
//   {
//     id: 2,
//     title: 'Dashboard not loading',
//     description: 'Dashboard takes too long to load',
//     status: 'in-progress',
//     priority: 'medium',
//     createdBy: 'Nisha Sharma',
//     assignedTo: 'Admin User',
//     createdAt: '2023-05-02',
//   },
//   {
//     id: 3,
//     title: 'Profile update',
//     description: 'Need to update profile picture',
//     status: 'resolved',
//     priority: 'low',
//     createdBy: 'Rinku Singh',
//     assignedTo: 'Admin User',
//     createdAt: '2023-05-03',
//   },
// ];

const priorityColors = {
  high: "error",
  medium: "warning",
  low: "success",
};

const statusColors = {
  open: "info",
  in_progress: "primary",
  resolved: "success",
};

const TMS = () => {
  const dispatch = useDispatch();
  const { tickets, loading, error, pagination } = useSelector(
    (state) => state?.tms || {}
  );
  const { user } = useSelector((state) => state.auth);
  const currentRole = user?.protected?.user?.role_id;

  // const state = useSelector((state) => state?.tms || {});
  // console.log(state);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "2023-11-30",
    endDate: new Date().toISOString().split("T")[0],
  });
  const navigate = useNavigate();
  console.log(pagination);
  useEffect(() => {
    dispatch(
      fetchTickets({
        page: pagination.currentPage,
        limit: pagination.limit,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
    );
  }, [dispatch, pagination.currentPage, dateRange]);

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  // Filter tickets based on search term
  const filteredTickets = tickets?.tickets?.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hideCreateButtonForRoles = [1, 3];
  const shouldHideCreateButton = hideCreateButtonForRoles.includes(currentRole);

  const handleOpenTicket = (ticket_id) => {
    navigate(`/openTicket/${ticket_id}`);
  };
  const handleCreateTicket = () => {
    navigate("/createTicket");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Ticket Management System
      </Typography>

      {/* Add date range filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={dateRange.startDate}
          onChange={handleDateChange}
          InputProps={{
            sx: {
              "& input::-webkit-calendar-picker-indicator": {
                filter: (theme) =>
                  theme.palette.mode === "dark" ? "invert(1)" : "none",
              },
            },
          }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={dateRange.endDate}
          onChange={handleDateChange}
          InputProps={{
            sx: {
              "& input::-webkit-calendar-picker-indicator": {
                filter: (theme) =>
                  theme.palette.mode === "dark" ? "invert(1)" : "none",
              },
            },
          }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
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
        {!shouldHideCreateButton && (<motion.div whileHover={{ scale: 1.05 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTicket}
          >
            Create Ticket
          </Button>
        </motion.div>)}
      </Box>

      {/* Loading and error states */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading tickets: {error}
        </Alert>
      )}
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
                <TableCell align="center" >Title</TableCell>
                <TableCell>Description</TableCell>
                {/* <TableCell>Priority</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets?.length > 0 &&
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Badge badgeContent={ticket.id} color="primary" max={9999}>
                        <TicketIcon color="action" />
                      </Badge>
                    </TableCell>
                    <TableCell align="center">{ticket.title}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {ticket.description}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Chip
                        label={ticket.priority}
                        color={priorityColors[ticket.priority] || "default"}
                        size="small"
                      />
                    </TableCell> */}
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        color={statusColors[ticket.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {ticket.user_name?.charAt(0)}
                        </Avatar>
                        {ticket.user_name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {ticket.allocated_name?.charAt(0)}
                        </Avatar>
                        {ticket.allocated_name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button onClick={()=>{handleOpenTicket(ticket?.id)}}>Open</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            disabled={pagination.currentPage === 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2 }}>
            Page {pagination.currentPage} of {pagination.totalPages} (Total:{" "}
            {pagination.totalItems})
          </Typography>
          <Button
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
          >
            Next
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default TMS;
