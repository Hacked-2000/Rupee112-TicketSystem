import React, { useState } from "react";
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
import { CircularProgress } from "@mui/material";
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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {apiUrls} from "../Utils/APIEndPoints";
import makeApiRequest from "../Utils/makeAPIRequest";

// In a real app, this would be an API call
// const mockLogin = async (credentials) => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Hardcoded users - replace with actual API call
//   const users = [
//     {
//       id: 1,
//       email: "admin@gmail.com",
//       password: "admin123",
//       name: "Admin User",
//       role: "admin",
//     },
//     {
//       id: 2,
//       email: "user@gmail.com",
//       password: "user123",
//       name: "Regular User",
//       role: "user",
//     },
//   ];

//   const user = users.find(
//     (u) => u.email === credentials.email && u.password === credentials.password
//   );

//   if (!user) {
//     throw new Error("Invalid credentials");
//   }

//   return user;
// };

const Login = () => {
  const [user_email, setEmail] = useState("");
  const [user_password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     dispatch(loginStart());
  //     const user = await mockLogin({ email, password });
  //     dispatch(loginSuccess(user));
  //     toast.success("Login successful!");
  //     navigate("/");
  //   } catch (err) {
  //     dispatch(loginFailure(err.message));
  //     setError(err.message);
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false); 
  //   }
  // };
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

      // save token from login
      const token = loginResponse.data.token;

      // protected route
      const option1 ={
        method: "GET",
      }
      const protectedLogin = await makeApiRequest(apiUrls.ProtectedLogin, option1, "application/json", dispatch, token, false);
      const masterRole = await makeApiRequest(apiUrls.MasterRole,option1, "application/json", dispatch, token, false);
      
      const user = {
        ...loginResponse,
        protected: protectedLogin,
        master: masterRole,
      };
      
      dispatch(loginSuccess(user));
      toast.success("Login SuccessFully");
      navigate("/");
    //   const response = await fetch("http://192.168.3.193:3000/api/v1/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });
  
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || "Login failed");
    //   }
  
    //   const user = await response.json();
    //   dispatch(loginSuccess(user));
    //   toast.success("Login successful!");
    //   navigate("/");
    // } catch (err) {
    //   dispatch(loginFailure(err.message));
    //   setError(err.message);
    //   toast.error(err.message);
    // } finally {
    //   setLoading(false);
    // }
    } catch(err) {
      console.log(err);
      dispatch(loginFailure(err.message))
      setError(err.message);
      toast.error(err.message);
    } finally{
      setLoading(false);
    }
  };
  
  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?ticket)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
            </motion.div>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
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
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                component={motion.div}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <CircularProgress size={24} color="blue" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
