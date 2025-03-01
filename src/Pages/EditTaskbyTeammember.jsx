import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams,useLocation } from "react-router-dom";
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Typography,Alert } from "@mui/material";
import API_BASE_URL from "../components/Config";
function EditTaskbyTeammember() {
  const userId = sessionStorage.getItem("useridsrmapp");
  const [taskData, setTaskData] = useState({
    status: "",
    teamnotes: "",
  });

  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const navigate = useNavigate();
    const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (id) {
          const taskResponse = await axios.get(`${API_BASE_URL}/task/singletask/${id}`);
          setTaskData({
            status: taskResponse.data.task.status, 
            teamnotes: "", 
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      setMessage({ type: 'success', text: 'Task status updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      navigate(-1); 
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update task status. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
     
      <form onSubmit={handleSubmit}>
           {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select id="status" name="status" value={taskData.status} onChange={handleChange} label="Status">
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Team Notes"
              id="teamnotes"
              name="teamnotes"
              value={taskData.teamnotes}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          {id ? "Update Task" : "Add Task"}
        </Button>
      </form>
    </Container>
  );
}

export default EditTaskbyTeammember;

