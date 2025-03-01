import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button,Paper, Container, Grid,Alert, TextareaAutosize, FormControlLabel, Checkbox, FormGroup, Typography } from '@mui/material';
import API_BASE_URL from "../components/Config";
const EditProjects = () => {
  const userId = sessionStorage.getItem('useridsrmapp');
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    client: '',
    startDate: '',
    Dedline: '',
    status: '',
    price: '',
    weblink: '',
    hosting: '',
    hostingpurchaseDate:'',
    hostingexpDate:'',
    projectType: '',
    domain: '',
    domainpurchaseDate:'',
    domainexpDate:'',
    notes: '',
    lables: ''
  });
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate()
  const location = useLocation();
  const id = location.pathname.split("/").pop();
    const [message, setMessage] = useState({ type: '', text: '' });
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/getclientsbyuserid/${userId}`);
        console.log(response)
      
        const data = response.data.data
       
        setClients(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    fetchClients();
  }, []);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/getservicesbyuserid/${userId}`);
        setServices(response.data);
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    fetchServices();
  }, [userId]);
  useEffect(() => {
    const fetchProjectData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/project/singleproject/${id}`); // Fetch client data by ID
      console.log(response);
      setProjectData(response.data.project);
      setSelectedServices(response.data.project.services.map(service => service._id));
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
      
  };
  fetchProjectData(); 
    
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedServices((prevSelected) =>
      checked ? [...prevSelected, value] : prevSelected.filter((serviceId) => serviceId !== value)
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const updatedProjectData = { ...projectData, services: selectedServices };
    axios.put(`${API_BASE_URL}/project/updateprojects/${id}`, updatedProjectData)
      .then(response => {
        setMessage({ type: 'success', text: 'Project updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        navigate(-1)
       
   
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Failed to update Project. Please try again.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      });
  };
console.log(projectData)
  return (
    <div >
    <form onSubmit={handleSubmit}>

         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Project Name" id="name" name="name" value={projectData.name} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Project Type</InputLabel>
            <Select id="projectType" name="projectType" value={projectData.projectType} onChange={handleChange} required label="Project Type">
              <MenuItem value="">Select Project Type</MenuItem>
              <MenuItem value="Client Project">Client Project</MenuItem>
              <MenuItem value="Internal Project">Internal Project</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>


      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Client</InputLabel>
            <Select id="client" name="client" value={projectData.client} onChange={handleChange} disabled={projectData.projectType === "Internal Project"} required={projectData.projectType === "Client Project"} label="Client">
              <MenuItem value="">Select a Client</MenuItem>
              {clients.map(client => (
                <MenuItem key={client._id} value={client._id}>{client.clientname?.owner}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select id="status" name="status" value={projectData.status} onChange={handleChange} required label="Status">
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Start Date" type="date" InputLabelProps={{ shrink: true }} id="startDate" name="startDate" value={projectData.startDate} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Deadline" type="date" InputLabelProps={{ shrink: true }} id="Dedline" name="Dedline" value={projectData.Dedline} onChange={handleChange} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Price" id="price" name="price" value={projectData.price} onChange={handleChange} required />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Web Link" type="url" id="webLink" name="weblink" value={projectData.weblink} onChange={handleChange} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Hosting" id="hosting" name="hosting" value={projectData.hosting} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Hosting Purchase Date" type="date" InputLabelProps={{ shrink: true }} id="hostingpurchaseDate" name="hostingpurchaseDate" value={projectData.hostingpurchaseDate} onChange={handleChange} />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Hosting Exp Date"
          name="hostingexpDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={projectData.hostingexpDate}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}  md={6}>
          <TextField fullWidth label="Description" id="description" name="description" value={projectData.description} onChange={handleChange} required />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextareaAutosize minRows={3} placeholder="Notes" id="notes" name="notes" value={projectData.notes} onChange={handleChange} style={{ width: '100%', padding: '8px', fontSize: '1rem', }} />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}  sx={{ mt: 2 }}>
    
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Domain"
          name="domain"
          value={projectData.domain}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Domain Purchase Date"
          name="domainpurchaseDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={projectData.domainpurchaseDate}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Domain Exp Date"
          name="domainexpDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={projectData.domainexpDate}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          select
          label="Labels"
          name="lables"
          value={projectData.lables}
          onChange={handleChange}
        >
          <MenuItem value="">Select Labels</MenuItem>
          <MenuItem value="highpriority">High Priority</MenuItem>
          <MenuItem value="perfect">Perfect</MenuItem>
          <MenuItem value="ontrack">On Track</MenuItem>
          <MenuItem value="upcoming">Upcoming</MenuItem>
          <MenuItem value="urgent">Urgent</MenuItem>
        </TextField>
      </Grid>
      <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h7" gutterBottom>
              Select Services
            </Typography>
             <Paper elevation={3} sx={{ padding: '16px',marginTop:'10px' }}>
            <FormGroup>
              {services.map((service) => (
                <FormControlLabel
                  key={service._id}
                  control={
                    <Checkbox
                      value={service._id}
                      checked={selectedServices.includes(service._id)}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label={service.name}
                />
              ))}
            </FormGroup>
            </Paper>
          </Grid>
        </Grid>
    </Grid>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Edit Project
      </Button>
    </form>
  </div>
  );
};

export default EditProjects;
