import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid ,Alert} from '@mui/material';
import API_BASE_URL from "../components/Config";
function AddTasks() {
  const userId = sessionStorage.getItem('useridsrmapp');
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    project: '',
    client: '',
    assignedTo: '',
    startDate: '',
    Dedline: '',
    status: '',
    lables: '',
    createdby: userId,
  });

  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const navigate = useNavigate();
  const [clientName, setClientName] = useState(''); 
      const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsResponse = await axios.get(`${API_BASE_URL}/project/getprojectbyuserid/${userId}`);
        setProjects(projectsResponse.data.data);

        const teamResponse = await axios.get(`${API_BASE_URL}/team/getteammemberbyuserid/${userId}`);
        setTeamMembers(teamResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "project") {
      const selectedProject = projects.find(proj => proj._id === value);
      if (selectedProject) {
        setTaskData(prevState => ({
          ...prevState,
          project: value,
          client: selectedProject.client._id || '', 
        }));
        setClientName(selectedProject.client.clientname.owner || '');
      }
    } else {
      setTaskData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/task/createtasks`, taskData);
      setMessage({ type: 'success', text: 'Task Created successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setTaskData({
        title: '',
        description: '',
        project: '',
        client: '',
        assignedTo: '',
        startDate: '',
        Dedline: '',
        status: '',
        lables: '',
        createdby: userId,
      });
      setClientName('');
      navigate(-1);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create task. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit}>
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Title" name="title" value={taskData.title} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Description" name="description" value={taskData.description} onChange={handleChange} multiline rows={3} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select name="project" value={taskData.project} onChange={handleChange} required label="Project">
                <MenuItem value="">Select Project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Client"  value={clientName} disabled />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select name="assignedTo" value={taskData.assignedTo} onChange={handleChange} required label="Assigned To">
                <MenuItem value="">Select Team Member</MenuItem>
                {teamMembers.map((teamMember) => (
                  <MenuItem key={teamMember._id} value={teamMember._id}>{teamMember.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Start Date" type="date" name="startDate" value={taskData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Deadline" type="date" name="Dedline" value={taskData.Dedline} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={taskData.status} onChange={handleChange} required label="Status">
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Labels</InputLabel>
              <Select name="lables" value={taskData.lables} onChange={handleChange} required label="Labels">
                <MenuItem value="">Select Label</MenuItem>
                <MenuItem value="Bug">Bug</MenuItem>
                <MenuItem value="Design">Design</MenuItem>
                <MenuItem value="Enhancement">Enhancement</MenuItem>
                <MenuItem value="Feedback">Feedback</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Task
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default AddTasks;
