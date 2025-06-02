import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, IconButton, InputAdornment } from "@mui/material";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { apiUrls } from "../Utils/APIEndPoints";
import makeApiRequest from "../Utils/makeAPIRequest";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ForgotPassword = ({mode}) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
//   const theme = useTheme();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const option = {
        method: "POST",
        data: { email, newPassword },
      };
      
      const response = await makeApiRequest(
        apiUrls.ResetPassword,
        option,
        "application/json",
        null,
        null,
        false
      );

      if (!response || response.error) {
        throw new Error(response?.message || "Password reset failed");
      }

      toast.success("Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #0f2027)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
        "@keyframes gradient": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          mx: 2,
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              mode === "light"
                ? "linear-gradient(90deg, #1976d2, #0d47a1)"
                : "linear-gradient(90deg, #90caf9, #42a5f5)",
          },
        }}
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <IconButton  color="inherit">
            {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box> */}

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
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            Reset Your Password
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Enter your email and new password
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
              width: "100%",
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                },
                "& .MuiOutlinedInput-root": {
                  color: "text.primary",
                  "& fieldset": {
                    borderColor:
                      mode === "light"
                        ? "#e0e0e0"
                        : "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#1976d2" : "#90caf9",
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                },
                "& .MuiOutlinedInput-root": {
                  color: "text.primary",
                  "& fieldset": {
                    borderColor:
                      mode === "light"
                        ? "#e0e0e0"
                        : "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#1976d2" : "#90caf9",
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiInputLabel-root": {
                  color: "text.secondary",
                },
                "& .MuiOutlinedInput-root": {
                  color: "text.primary",
                  "& fieldset": {
                    borderColor:
                      mode === "light"
                        ? "#e0e0e0"
                        : "rgba(255, 255, 255, 0.23)",
                  },
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#1976d2" : "#90caf9",
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
                  textAlign: "center",
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
                fontSize: "1rem",
                background:
                  mode === "light"
                    ? "linear-gradient(90deg, #1976d2, #0d47a1)"
                    : "linear-gradient(90deg, #90caf9, #42a5f5)",
                "&:hover": {
                  background:
                    mode === "light"
                      ? "linear-gradient(90deg, #1565c0, #0d47a1)"
                      : "linear-gradient(90deg, #42a5f5, #1e88e5)",
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
                "Reset Password"
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                mt: 1,
                textTransform: "none",
                color: mode === "light" ? "#1976d2" : "#90caf9",
                fontSize: "0.875rem",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "transparent",
                },
              }}
            >
              Back to Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;