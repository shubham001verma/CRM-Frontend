import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Container, Grid, TextareaAutosize,Alert } from '@mui/material';
import API_BASE_URL from "../components/Config";
const EditProjectByClient = () => {
  const userId = sessionStorage.getItem('useridsrmapp');
  const [projectData, setProjectData] = useState({
    
    clientnotes: '',
   
  });

  const [clients, setClients] = useState([]);
  const navigate = useNavigate()
  const location = useLocation();
  const id = location.pathname.split("/").pop();
 const [message, setMessage] = useState({ type: '', text: '' });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 
    axios.put(`${API_BASE_URL}/project/updateprojects/${id}`, projectData)
      .then(response => {
        setMessage({ type: 'success', text: 'Note send successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        navigate(-1)
      
   
      })
      .catch(error => {
        setMessage({ type: 'error', text: 'Failed to note send. Please try again.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      });
  };
console.log(projectData)
  return (
    <div >
    <form onSubmit={handleSubmit}>
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextareaAutosize minRows={3} placeholder="Client Notes" id="clientnotes" name="clientnotes" value={projectData.clientnotes} onChange={handleChange} style={{ width: '100%', padding: '8px', fontSize: '1rem', }} />
        </Grid>
      </Grid>
      
      <Grid container spacing={3}  sx={{ mt: 2 }}>
    
    </Grid>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Note Send
      </Button>
    </form>
  </div>
  );
};

export default EditProjectByClient;