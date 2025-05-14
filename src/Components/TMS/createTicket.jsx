// src/Components/CreateTicket.jsx
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../Store/Reducers/tmsSlice';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  AttachFile,
  Delete,
  CloudUpload,
  Description,
} from '@mui/icons-material';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading = false, error = null } = useSelector((state) => state.ticket || {});
  const {user} = useSelector((state) => state.auth || {});
  console.log(user?.protected?.user?.name);
  
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: user?.protected?.user?.id || '',
    title: '',
    description: '',
    status: 'open',
    updated_by: user?.protected?.user?.id || '',
    attachments: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
  
  const formPayload = new FormData();
  
  // Append all fields individually
  formPayload.append('user_id', Number(formData?.user_id) || '');
  formPayload.append('title', formData.title);
  formPayload.append('description', formData.description);
  formPayload.append('status', formData.status);
  formPayload.append('updated_by', Number(formData?.user_id) || '');

  // Append each file separately
  formData.attachments.forEach(file => {
    formPayload.append('attachments', file);
  });
  
  try {
    console.log(formPayload)
    await dispatch(createTicket(formPayload)).unwrap();
    toast.success('Ticket created successfully!');
    navigate('/tms');```jsx
// src/Components/CreateTicket.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../Store/Reducers/tmsSlice';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  AttachFile,
  Delete,
  CloudUpload,
  Description,
} from '@mui/icons-material';

const CreateTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading = false, error = null } = useSelector((state) => state.ticket || {});
  const { user } = useSelector((state) => state.auth || {});

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: user?.protected?.user?.id || '',
    title: '',
    description: '',
    status: 'open',
    updated_by: user?.protected?.user?.id || '',
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formPayload = new FormData();

    // Append all fields individually
    formPayload.append('user_id', Number(formData?.user_id) || '');
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('status', formData.status);
    formPayload.append('updated_by', Number(formData?.user_id) || '');

    // Append each file separately
    formData.attachments.forEach((file) => {
      formPayload.append('attachments', file);
    });

    try {
      await dispatch(createTicket(formPayload)).unwrap();
      toast.success('Ticket created successfully!');
      navigate('/tms');
    } catch (err) {
      toast.error(err.message || 'Failed to create ticket');
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to create ticket');
    }
  }, [error]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: 'none' }}
          variant="text"
          color="inherit"
        >
          Back to Dashboard
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
              Create New Support Ticket
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Title Field */}
                <TextField
                  fullWidth
                  label="Ticket Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  required
                />

                {/* Description Field */}
                <TextField
                  fullWidth
                  label="Detailed Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={6}
                  variant="outlined"
                  required
                />

                {/* Status Field */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ticket Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Ticket Status"
                    required
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>

                {/* File Upload Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                    Attachments
                  </Typography>

                  <Box
                    sx={{
                      border: '2px dashed #1976d2',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.dark',
                      },
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">
                      Click to upload files or drag and drop
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      (PDF, DOC, JPG, PNG up to 50MB)
                    </Typography>
                    <input
                      type="file"
                      hidden
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </Box>

                  {/* Uploaded Files Preview */}
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {formData.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => handleRemoveFile(index)}
                        deleteIcon={<Delete />}
                        variant="outlined"
                        icon={<AttachFile />}
                        sx={{
                          '& .MuiChip-label': {
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: 16,
                    borderRadius: 2,
                    width: 'fit-content',
                    alignSelf: 'flex-start',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Ticket'
                  )}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
};

export default CreateTicket;
```
  } catch (err) {
    toast.error(err.message || 'Failed to create ticket');
    // console.error('Ticket creation error:', err);
  }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: 'none' }}
          variant="text"
          color="inherit"
        >
          Back to Dashboard
        </Button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
              Create New Support Ticket
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {/* Title Field */}
                <TextField
                  fullWidth
                  label="Ticket Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                  required
                />

                {/* Description Field */}
                <TextField
                  fullWidth
                  label="Detailed Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={6}
                  variant="outlined"
                  required
                />

                {/* Status Field */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ticket Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Ticket Status"
                    required
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>

                {/* File Upload Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                    Attachments
                  </Typography>
                  
                  <Box
                    sx={{
                      border: '2px dashed #1976d2',
                      borderRadius: 2,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'primary.dark'
                      }
                    }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">
                      Click to upload files or drag and drop
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      (PDF, DOC, JPG, PNG up to 50MB)
                    </Typography>
                    <input
                      type="file"
                      hidden
                      multiple
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </Box>

                  {/* Uploaded Files Preview */}
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    {formData.attachments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        onDelete={() => handleRemoveFile(index)}
                        deleteIcon={<Delete />}
                        variant="outlined"
                        icon={<AttachFile />}
                        sx={{ 
                          '& .MuiChip-label': {
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    px: 6,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: 16,
                    borderRadius: 2,
                    width: 'fit-content',
                    alignSelf: 'flex-start'
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Ticket'
                  )}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </>
  );
};

export default CreateTicket;