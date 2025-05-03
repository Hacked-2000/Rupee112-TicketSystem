import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [timeRange, setTimeRange] = React.useState('week');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  // Mock data for charts
  const ticketData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Tickets Created',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tickets Resolved',
        data: [8, 15, 2, 4, 1, 2],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const statusData = {
    labels: ['Open', 'In Progress', 'Resolved'],
    datasets: [
      {
        data: [12, 8, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ mb: 2 }}
        >
          <Tab label="Tickets Overview" icon={<BarChartIcon />} />
          <Tab label="Status Distribution" icon={<PieChartIcon />} />
          <Tab label="Trend Analysis" icon={<TimelineIcon />} />
        </Tabs>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="quarter">Last Quarter</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tabValue === 0 && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tickets Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar 
                data={ticketData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        )}
        
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Status Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie 
                    data={statusData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <Typography variant="h5">40</Typography>
                        <Typography variant="body2">Total Tickets</Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
                        <Typography variant="h5">20</Typography>
                        <Typography variant="body2">Resolved</Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
                        <Typography variant="h5">12</Typography>
                        <Typography variant="body2">Open</Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                  <Grid item xs={6}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                        <Typography variant="h5">8</Typography>
                        <Typography variant="body2">In Progress</Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {tabValue === 2 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trend Analysis
            </Typography>
            <Typography color="text.secondary">
              Trend analysis charts will be displayed here based on the selected time range.
            </Typography>
            {/* Placeholder for trend analysis chart */}
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TimelineIcon sx={{ fontSize: 100, opacity: 0.2 }} />
            </Box>
          </Paper>
        )}
      </motion.div>
    </Box>
  );
};

export default Reports;