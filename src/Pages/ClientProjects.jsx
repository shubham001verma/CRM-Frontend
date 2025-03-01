import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Badge, Card, CardContent, Typography,IconButton } from '@mui/material';
import API_BASE_URL from "../components/Config";
function ClientProjects() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem('useridsrmapp');

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#4caf50';
      case 'In Progress':
        return '#ffc107';
      case 'On Hold':
        return '#9e9e9e';
      case 'Pending':
        return '#ff5722';
      default:
        return '#6c757d';
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/project/getprojectbyclientid/${userId}`);
        console.log(response.data.project);
        setProjects(response.data.project);
        setFilteredProjects(response.data.project);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProjects();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(value)
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className='container' style={{ marginTop: '20px' }}>
    
    <TableContainer  >
      <Table  aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}>
        <TableHead >
          <TableRow>
            <TableCell>SNo.</TableCell>
            <TableCell>Project Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Weblink</TableCell>
            <TableCell>Project Cost</TableCell>
            <TableCell>Total Paid</TableCell>
            <TableCell>Due</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <TableRow key={project._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <a href={project.weblink} target='_blank' rel='noopener noreferrer' style={{ color: 'gray', textDecoration: 'none' }}>
                    {project.weblink.length > 20 ? `${project.weblink.slice(0, 20)}...` : project.weblink}
                  </a>
                </TableCell>
                <TableCell>₹{project.price}</TableCell>
                <TableCell>₹{project.client.paymentReceived || 'N/A'}</TableCell>
                <TableCell style={{ color: project.price -  project.client?.paymentReceived > 0 ? 'red' : 'green' }}>${project.price - project.client?.paymentReceived || 'N/A'}</TableCell>
                <TableCell>
                  <div style={{ width: '100px', height: '5px', backgroundColor: '#ddd', borderRadius: '5px', position: 'relative' }}>
                    <div style={{
                      width: project.status === 'On Hold' ? '25%' : project.status === 'Completed' ? '100%' : project.status === 'In Progress' ? '50%' : '0%',
                      height: '100%',
                      backgroundColor: "#83a4f7",
                      borderRadius: '5px',
                    }} />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge sx={{  backgroundColor: `${getStatusBackgroundColor (project.status)}20`, 
                      color: getStatusBackgroundColor (project.status), 
                       padding: '5px 10px', borderRadius: '5px',
                       fontWeight: "bold", }}>{project.status}</Badge>
                </TableCell>
                <TableCell>
               
  <IconButton onClick={() =>   window.location.href = (`/editprojectbyclient/${project._id}`)} >
    <Edit fontSize="small" color="primary" />
  </IconButton>
             
 
  <IconButton onClick={()=>window.location.href = (`/clientprojectdetails/${project._id}`)} >
    <Visibility  fontSize="small" color="success"  />
  </IconButton>

                 
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} align='center'>No projects found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
   
  </div>
  );
}

export default ClientProjects;
