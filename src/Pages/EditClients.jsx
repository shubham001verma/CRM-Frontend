import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography,Alert
} from '@mui/material';
import API_BASE_URL from "../components/Config";

function EditClients() {
  const UserId=sessionStorage.getItem('useridsrmapp');
  const [leads, setLeads] = useState([]);
  const [clientData, setClientData] = useState({
    clientname: '',
    primeryConnection: '',
    primeryConectiontype:'',
    email: '',
    phone: '',
    password: '', 
    company: '',
    address: '',
    projects: '',
    clientgroups: '',
    totalinvoiced: '',
    totalexpense:'',
    paymentReceived: '',
    lables: '', 
  });
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/singleclient/${id}`); 
        console.log(response);
        setClientData(response.data.client);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };
    fetchClientData();
  }, [id]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead/getwonledsbyuserid/${UserId}`);
        const data = response.data.data;
        console.log(data);
        setLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };

    fetchLeads();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clientname") {
      const selectedLead = leads.find(lead => lead._id === value);
      if (selectedLead) {
        setClientData({
          ...clientData,
          clientname: value,
          primeryConnection: selectedLead.primeryConection || '',
          primeryConectiontype: selectedLead.primeryConectiontype || '',
          phone: selectedLead.phone || '',
          address: selectedLead.address || '',
        });
      }
    } else {
      setClientData({ ...clientData, [name]: value });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.put(`${API_BASE_URL}/client/updateclients/${id}`, clientData); 
      setMessage({ type: 'success', text: 'Client Updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      navigate(-1); 
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update Client. Please try again.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="container mt-4">
     <form onSubmit={handleSubmit}>
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Client Name</InputLabel>
              <Select name="clientname" value={clientData.clientname} onChange={handleChange}
                label="Client Name">
                <MenuItem value="">Select Client</MenuItem>
                {leads.map((lead) => (
                  <MenuItem key={lead._id} value={lead._id}>{lead.owner}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Primary Connection" name="primeryConnection" value={clientData.primeryConnection} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Primary Connection Type</InputLabel>
              <Select name="primeryConectiontype" value={clientData.primeryConectiontype} onChange={handleChange}
                label="Primary Connection Type">
                <MenuItem value="">Select Connection Type</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Sales Executive">Sales Executive</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Graphic Designer">Graphic Designer</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" type="email" name="email" value={clientData.email} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
             <Typography variant="body1">Phone</Typography>
            <ReactPhoneInput country="in" value={clientData.phone} onChange={(phone) => setClientData({ ...clientData, phone })} inputProps={{ name: "phone", required: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Password" name="password" value={clientData.password} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Company" name="company" value={clientData.company} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Address" name="address" value={clientData.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Projects" name="projects" value={clientData.projects} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Client Type</InputLabel>
              <Select name="clientgroups" value={clientData.clientgroups} onChange={handleChange}
               label="Client Type">
                <MenuItem value="">Select Client Group</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="Gold">Gold</MenuItem>
                <MenuItem value="Silver">Silver</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Total Invoiced" name="totalinvoiced" value={clientData.totalinvoiced} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Total Expense" name="totalexpense" value={clientData.totalexpense} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Payment Received" name="paymentReceived" value={clientData.paymentReceived} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Labels</InputLabel>
              <Select name="lables" value={clientData.lables} onChange={handleChange}  label="Labels">
                <MenuItem value="">Select a Label</MenuItem>
                <MenuItem value="90% probability">90% Probability</MenuItem>
                <MenuItem value="50% probability">50% Probability</MenuItem>
                <MenuItem value="call this week">Call This Week</MenuItem>
                <MenuItem value="corporate">Corporate</MenuItem>
                <MenuItem value="potential">Potential</MenuItem>
                <MenuItem value="referral">Referral</MenuItem>
                <MenuItem value="satisfied">Satisfied</MenuItem>
                <MenuItem value="unsatisfied">Unsatisfied</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">Edit Client</Button>
          </Grid>
        </Grid>
      </form>
    </div >
  );
}

export default EditClients;
