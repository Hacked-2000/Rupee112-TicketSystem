import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../Store/Reducers/loginSlice";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, IconButton } from "@mui/material";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  CssBaseline,
  Grid,
  Link,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { apiUrls } from "../Utils/APIEndPoints";
import makeApiRequest from "../Utils/makeAPIRequest";

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#1976d2',
            dark: '#0d47a1',
          },
          secondary: {
            main: '#212121',
          },
          background: {
            default: 'linear-gradient(135deg,rgb(210, 210, 210),rgb(194, 194, 194))',
            paper: '#ffffff',
          },
          text: {
            primary: '#212121',
            secondary: '#757575',
          },
        }
      : {
          // Dark mode palette (for Paper component only)
          primary: {
            main: '#90caf9',
            dark: '#42a5f5',
          },
          secondary: {
            main: '#ce93d8',
          },
          background: {
            paper: '#121212',
          },
          text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
          },
        }),
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: 0.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(31, 25, 210, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          },
        },
      },
    },
  });

const Login = () => {
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('light');
  
  const theme = createTheme(getDesignTokens(mode));
  const outerTheme = useTheme();

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      dispatch(loginStart());
      const option = {
        method: "POST",
        data: {user_email, user_password},
      }
      const loginResponse = await makeApiRequest(apiUrls.Login, option, "application/json", dispatch, null, false);
      if (
        !loginResponse || 
        loginResponse.error || 
        !loginResponse?.data?.token
      ) {
        throw new Error(
          loginResponse?.message || 
          "Login failed: Invalid credentials or server error"
        );
      }

      const token = loginResponse.data.token;
      const option1 = {
        method: "GET",
      }
      const protectedLogin = await makeApiRequest(apiUrls.ProtectedLogin, option1, "application/json", dispatch, token, false);
      const masterRole = await makeApiRequest(apiUrls.MasterRole, option1, "application/json", dispatch, token, false);
      
      const user = {
        ...loginResponse,
        protected: protectedLogin,
        master: masterRole,
      };
      
      dispatch(loginSuccess(user));
      toast.success("Login Successful");
      navigate("/");
    } catch(err) {
      console.log(err);
      dispatch(loginFailure(err.message))
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  
  return (
    <>
      <ThemeProvider theme={outerTheme}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            '@keyframes gradient': {
              '0%': {
                backgroundPosition: '0% 50%',
              },
              '50%': {
                backgroundPosition: '100% 50%',
              },
              '100%': {
                backgroundPosition: '0% 50%',
              },
            },
          }}
        >
          <ThemeProvider theme={theme}>
            <Paper
              elevation={6}
              sx={{
                width: '100%',
                maxWidth: 450,
                p: 4,
                mx: 2,
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: mode === 'light' 
                    ? 'linear-gradient(90deg, #1976d2, #0d47a1)' 
                    : 'linear-gradient(90deg, #90caf9, #42a5f5)',
                },
              }}
              component={motion.div}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Box>
              
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Avatar 
                    sx={{ 
                      m: 1, 
                      bgcolor: "primary.main",
                      width: 64,
                      height: 64,
                    }}
                  >
                    <LockOutlinedIcon fontSize="medium" />
                  </Avatar>
                </motion.div>
                <Typography 
                  component="h1" 
                  variant="h5"
                  sx={{ 
                    mt: 2,
                    mb: 1,
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    mb: 3,
                    color: 'text.secondary',
                    textAlign: 'center',
                  }}
                >
                  Sign in to access your Dashboard
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ 
                    mt: 1,
                    width: '100%',
                  }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={user_email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{
                      mb: 2,
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      },
                      '& .MuiOutlinedInput-root': {
                        color: 'text.primary',
                        '& fieldset': {
                          borderColor: mode === 'light' ? '#e0e0e0' : 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
                        },
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={user_password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    sx={{
                      mb: 2,
                      '& .MuiInputLabel-root': {
                        color: 'text.secondary',
                      },
                      '& .MuiOutlinedInput-root': {
                        color: 'text.primary',
                        '& fieldset': {
                          borderColor: mode === 'light' ? '#e0e0e0' : 'rgba(255, 255, 255, 0.23)',
                        },
                        '&:hover fieldset': {
                          borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
                        },
                      },
                    }}
                  />
                  {error && (
                    <Typography 
                      color="error" 
                      variant="body2"
                      sx={{ 
                        mt: 1,
                        textAlign: 'center',
                      }}
                    >
                      {error}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 3, 
                      mb: 2,
                      py: 1.5,
                      fontSize: '1rem',
                      background: mode === 'light' 
                        ? 'linear-gradient(90deg, #1976d2, #0d47a1)' 
                        : 'linear-gradient(90deg, #90caf9, #42a5f5)',
                      '&:hover': {
                        background: mode === 'light' 
                          ? 'linear-gradient(90deg, #1565c0, #0d47a1)' 
                          : 'linear-gradient(90deg, #42a5f5, #1e88e5)',
                      },
                    }}
                    component={motion.div}
                    whileHover={{ 
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </ThemeProvider>
        </Box>
      </ThemeProvider>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Login;