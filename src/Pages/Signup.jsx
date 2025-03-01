import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, Card, Typography, IconButton, InputAdornment, Box, Paper, Alert, Grid } from "@mui/material";
import API_BASE_URL from "../components/Config";

function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/user/create`, formData);
            console.log(response.data);
            sessionStorage.setItem('useridsrmapp', response.data.user._id);
            localStorage.setItem('useridsrmapp', response.data.user._id);
            setMessage({ type: 'success', text: 'Register successful! Redirecting...' });

            window.location.href = '/';
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ backgroundColor: '#f0f3fc' }}>
            <Grid container justifyContent="center" alignItems="center" sx={{ maxWidth: "1100px" }}>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <img src="/login-bg.svg" alt="signup" style={{ maxWidth: "100%", height: "auto" }} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: "15px", textAlign: "center", mx: 2 }}>

                        <img src="/Main.png" alt="Logo" style={{ width: "80px", marginBottom: "20px" }} />
                        <Typography variant="h5" sx={{ mb: 4 }}>Signup</Typography>

                        {message.text && (
                            <Alert severity={message.type === "success" ? "success" : "error"} sx={{ mb: 3 }}>
                                {message.text}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField fullWidth margin="normal" variant="outlined" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            <TextField fullWidth margin="normal" variant="outlined" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            <TextField fullWidth margin="normal" variant="outlined" label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
                            <TextField fullWidth margin="normal" variant="outlined" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                            <TextField
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#3a86de" }}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#3a86de", "&:hover": { backgroundColor: "#306bbf" } }}>
                                Signup
                            </Button>

                            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                                Already have an account?{" "}
                                <span onClick={() => (window.location.href = "/")} style={{ cursor: "pointer", textDecoration: "none", color: "#333" }}>
                                    Login
                                </span>
                            </Typography>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>

    );
}

export default Signup;
