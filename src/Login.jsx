import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,NavLink } from 'react-router-dom';
import { TextField, Button, IconButton, InputAdornment, Alert } from '@mui/material';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'; 
import API_BASE_URL from "../src/components/Config";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, formData);
      if (response.data.user) {
        sessionStorage.setItem('useridsrmapp', response.data.user._id);
        localStorage.setItem('useridsrmapp', response.data.user._id);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
     
        window.location.href = '/dashboards/modern';
       
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'User login failed. Please check your credentials.' });
    }

    try {
      const response2 = await axios.post(`${API_BASE_URL}/team/teamlogin`, formData);
      if (response2.data.teamMember) {
        sessionStorage.setItem('loggedInUserId', response2.data.teamMember._id);
        sessionStorage.setItem('useridsrmapp', response2.data.teamMember.createdby);
        localStorage.setItem('loggedInUserId', response2.data.teamMember._id);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        window.location.href ='/dashboards/modern';
      }
    } catch (err2) {
      setMessage({ type: 'error', text: 'Team login failed. Please check your credentials.' });
    }

    try {
      const response3 = await axios.post(`${API_BASE_URL}/client/loginclient`, formData);
      if (response3.data.client) {
        sessionStorage.setItem('useridsrmapp', response3.data.client._id);
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
         window.location.href ='/dashboards/e-commerce';
      }
    } catch (err3) {
      setMessage({ type: 'error', text: 'Client login failed. Please check your credentials.' });
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      sx={{ backgroundColor: '#f0f3fc' }}
    >
      <Grid container spacing={2} >
      <Grid 
    item 
    xs={12} 
    md={6} 
    sx={{
      display: { 
        xs: 'none',  
        sm: 'none',  
        md: 'none', 
        lg: 'block', 
        xl: 'block', 
      }
    }}
  >
    <img src="/login-bg.svg" alt="Login" style={{ width: '500px', height: 'auto' }} />
  </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: '15px', textAlign: 'center', mt: { xs: 0, md: 12 } }}>
            <img src="/Main.png" alt="Logo" style={{ width: '80px', marginBottom: '20px' }} />
            <Typography variant="h5" sx={{ mb: 4 }}>Login</Typography>

            {message.text && (
              <Alert severity={message.type === 'success' ? 'success' : 'error'} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#3a86de' }}
                      >
                        {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Login
              </Button>
              <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                      You have no any account? <span onClick={() => (window.location.href = "/signup")} style={{ cursor: "pointer", textDecoration: "none", color: "#333" }}>Signup</span>
                    </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
