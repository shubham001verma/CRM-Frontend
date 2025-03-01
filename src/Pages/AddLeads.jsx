import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid, Typography, Alert
} from '@mui/material';
import API_BASE_URL from "../components/Config";

function AddLeads() {
  const UserId = sessionStorage.getItem('useridsrmapp');
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    status: '',
    owner: '',
    source: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    comments: '',
    lables: '',
    primeryConection: '',
    primeryConectiontype: '',
    createdby: UserId,
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData({ ...leadData, [name]: value });
  };

  useEffect(() => {
    const { city, state, zip } = leadData;
    if (city || state || zip) {
      setLeadData((prevData) => ({
        ...prevData,
        address: `${city ? city + ", " : ""}${state ? state + ", " : ""}${zip}`,
      }));
    }
  }, [leadData.city, leadData.state, leadData.zip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/lead/createleads`, leadData);
      setMessage({ type: 'success', text: 'Lead added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setLeadData({
        name: '',
        phone: '',
        status: '',
        owner: '',
        source: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        comments: '',
        lables: '',
        primeryConection: '',
        primeryConectiontype: '',
        createdby: UserId,
      });
      navigate(-1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add lead. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={leadData.name}
              onChange={handleChange}
              required
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Phone</Typography>
            <ReactPhoneInput
              country={"in"}
              value={leadData.phone}
              onChange={(phone) => setLeadData({ ...leadData, phone })}
              inputProps={{
                name: "phone",
                required: true,
              }}
              className="form-control"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Owner Name"
              fullWidth
              name="owner"
              value={leadData.owner}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Connection"
              fullWidth
              name="primeryConection"
              value={leadData.primeryConection}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Primary Connection Type</InputLabel>
              <Select
                name="primeryConectiontype"
                value={leadData.primeryConectiontype}
                onChange={handleChange}
                label="Primary Connection Type"
              >
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
            <FormControl fullWidth>
              <InputLabel>Source</InputLabel>
              <Select
                name="source"
                value={leadData.source}
                onChange={handleChange}
                label="Source"
              >
                <MenuItem value="">Select Source</MenuItem>
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="youtube">YouTube</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="linkedin">LinkedIn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              fullWidth
              name="address"
              value={leadData.address}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              fullWidth
              name="city"
              value={leadData.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="State"
              fullWidth
              name="state"
              value={leadData.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="ZIP"
              fullWidth
              name="zip"
              value={leadData.zip}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comments"
              fullWidth
              name="comments"
              value={leadData.comments}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={leadData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Discussion">Discussion</MenuItem>
                <MenuItem value="Qualified">Qualified</MenuItem>
                <MenuItem value="Negotiation">Negotiation</MenuItem>
                <MenuItem value="Lost">Lost</MenuItem>
                <MenuItem value="Won">Won</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Labels</InputLabel>
              <Select
                name="lables"
                value={leadData.lables}
                onChange={handleChange}
                label="Labels"
              >
                <MenuItem value="">Select a label</MenuItem>
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
            <Button
              type="submit"
              variant="contained"
              color="primary"

            >
              Create Lead
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddLeads;
