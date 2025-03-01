import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams ,useLocation} from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Container, Grid, TextareaAutosize,Alert } from '@mui/material';
import API_BASE_URL from "../components/Config";
function EditTaskByClient() {
  const userId=sessionStorage.getItem('useridsrmapp');
  const [taskData, setTaskData] = useState({
    clientnotes: '',
  });

  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const navigate = useNavigate();
      const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {

    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get(`${API_BASE_URL}/project/getprojectbyuserid/${userId}`);
        console.log(projectsResponse)
        setProjects(projectsResponse.data.data);

        const teamResponse = await axios.get(`${API_BASE_URL}/team/getteammemberbyuserid/${userId}`);
        console.log(teamResponse)
        setTeamMembers(teamResponse.data.data);

       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`${API_BASE_URL}/task/updatetasks/${id}`, taskData);
        setMessage({ type: 'success', text: 'Note send successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
      navigate(-1); 
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to note send. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="container mt-4">
  
  <form onSubmit={handleSubmit}>
       {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>
        
         
        <Grid item xs={12}>
          <TextareaAutosize minRows={3} placeholder="Client Notes" id="clientnotes" name="clientnotes" value={taskData.clientnotes} onChange={handleChange} style={{ width: '100%', padding: '8px', fontSize: '1rem', }} />
        </Grid>
   
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" >
              Send Note
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default EditTaskByClient;
