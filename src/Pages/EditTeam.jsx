import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import API_BASE_URL from "../components/Config";
function EditTeam() {
  const [teamData, setTeamData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    subrole: "",
    address: "",
    fixedSalary: "",
    totalPaidLeaves: "",
  });
  const userId = sessionStorage.getItem("useridsrmapp");
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: '', text: '' });
  const [roles, setRoles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData({ ...teamData, [name]: value });
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/role/getrolesbyuserid/${userId}`);
        const data = response.data;
        console.log(data);
        setRoles(data || []);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/team/singleteam/${id}`
        );
        console.log(response)
        setTeamData(response.data.teamMember
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.put(
        `${API_BASE_URL}/team/updateteam/${id}`,
        teamData
      );
      setMessage({ type: 'success', text: 'Team Member updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setTeamData({
        name: "",
        phone: "",
        email: "",
        password: "",
        subrole: "",
        address: "",
        fixedSalary: "",
        totalPaidLeaves: "",
      });
      navigate(-1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update team member. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleUpdate}>
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={2}>

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

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Edit Team
        </Button>
      </form>
    </div>
  );
}

export default EditTeam;
