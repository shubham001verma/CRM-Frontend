import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Paper, Typography,Alert,FormControl,MenuItem,Select,InputLabel } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import API_BASE_URL from "../components/Config";
const EditServices = () => {
    const location = useLocation();
    const id = location.pathname.split("/").pop();
  const navigate = useNavigate();
       const [message, setMessage] = useState({ type: '', text: '' });
  const [service, setService] = useState({
    name: '',
    description: '',
    cost: '',
    duration: ''
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/singleservice/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      await axios.put(`${API_BASE_URL}/service/updateservice/${id}`, service);
      setMessage({ type: 'success', text: 'Service Updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      navigate(-1); 
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update service. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div>
     
      <form onSubmit={handleSubmit}>
           {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Service Name"
              name="name"
              variant="outlined"
              value={service.name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              variant="outlined"
              multiline
              rows={3}
              value={service.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Cost"
              name="cost"
              variant="outlined"
              type="number"
              value={service.cost}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                name="duration"
                value={service.duration}
                onChange={handleChange}
                label="duration"
              >
                <MenuItem value="">Select duration Type</MenuItem>
                <MenuItem value="Short">Short</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Long">Long</MenuItem>
              
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} >
            <Button variant="contained" color="primary" type="submit">
              Update Service
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditServices;
