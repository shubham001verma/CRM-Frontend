import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import API_BASE_URL from "../components/Config";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Grid,
  Alert
} from "@mui/material";
function AddTeam() {
  const userId = sessionStorage.getItem("useridsrmapp");

  const [teamData, setTeamData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    subrole: "",
    address: "",
    fixedSalary:"",
    totalPaidLeaves:"",
    createdby: userId,
  });

  const [roles, setRoles] = useState([]); // Initialize as an empty array
  const navigate = useNavigate();
   const [message, setMessage] = useState({ type: '', text: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/role/getrolesbyuserid/${userId}`);
        const data = response.data;
        console.log(data);
        setRoles(data || []); // Ensure it's always an array
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/team/createteam`,
        teamData
      );
      setMessage({ type: 'success', text: 'Team Member Created successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setTeamData({
        name: "",
        phone: "",
        email: "",
        password: "",
        subrole: "",
        address: "",
        fixedSalary:"",
        totalPaidLeaves:"",
        createdby: userId,
      });
      navigate(-1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create team member. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="container mt-4">
     <form onSubmit={handleSubmit}>
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={2}>
          {/* Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              name="name"
              value={teamData.name}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={teamData.email}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Password */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="text"
              name="password"
              value={teamData.password}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Phone
              </Typography>
              <PhoneInput
                country={"in"}
                value={teamData.phone}
                onChange={(phone) => setTeamData({ ...teamData, phone })}
                inputProps={{ name: "phone", required: true }}
                containerClass="react-tel-input"
                inputClass="form-control"
              />
            </FormControl>
          </Grid>

          {/* Role */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="subrole"
                value={teamData.subrole}
                onChange={handleChange}
                required
                label="Role"
              >
                <MenuItem value="">Select Role</MenuItem>
                {roles?.map((role, index) => (
                  <MenuItem key={index} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Address */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              name="address"
              value={teamData.address}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fixed Salary"
              variant="outlined"
              name="fixedSalary"
              value={teamData.fixedSalary}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="TotalPaidLeaves"
              variant="outlined"
              name="totalPaidLeaves"
              value={teamData.totalPaidLeaves}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Create Team
        </Button>
      </form>
    </div>
  );
}

export default AddTeam;
