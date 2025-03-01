import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaUserTie, FaEye } from 'react-icons/fa'; // Added missing FaPlus import
import { Link } from 'react-router-dom';
import {
  TextField, Select, MenuItem, Button, InputLabel, Avatar, Stack, Alert,
  Box, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Badge, IconButton
} from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { IoIosAddCircleOutline } from "react-icons/io";
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../components/Config";
function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAddButton, setShowAddButton] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [showViewButton, setShowViewButton] = useState(true);
  const userId = sessionStorage.getItem('useridsrmapp');
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [message, setMessage] = useState({ type: '', text: '' });
  const getDeadlineColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'black'; // Normal (default color)
      case 'In Progress':
        return 'red'; // Red for "in progress"
      case 'On Hold':
        return 'gray'; // Gray for "hold"

      default:
        return 'black'; // Default color for unhandled statuses
    }
  };

  const projectfilter = [
    "Client Project",
    "Internal Project"
  ];
  const statusfilter = [
    "Completed",
    "In Progress",
    "On Hold",
    "Pending"
  ]

  // Function to get the background color for the status
  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#4caf50'; // Green for "completed"
      case 'In Progress':
        return '#ffc107'; // Yellow for "in progress"
      case 'On Hold':
        return '#9e9e9e'; // Gray for "hold"
      case 'Pending':
        return '#ff5722'; // Orange for "pending"
      default:
        return '#6c757d'; // Default gray for unhandled statuses
    }
  };


  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  const getLabelColor = (label) => {
    switch (label) {
      case 'highpriority':
        return '#f44336'; // Red
      case 'perfect':
        return '#4caf50'; // Green
      case 'ontrack':
        return '#03a9f4'; // Blue
      case 'upcoming':
        return '#ffc107'; // Yellow
      case 'urgent':
        return '#ff5722'; // Orange
      default:
        return '#6c757d'; // Default Gray
    }
  };

  const getProjectTypeColor = (projectType) => {
    switch (projectType) {
      case 'Client Project':
        return '#673ab7'; // Deep Purple for Client Projects
      case 'Internal Project':
        return '#009688'; // Teal for Internal Projects
      default:
        return '#6c757d'; // Default Gray
    }
  };
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        console.log(response.data.teamMember.subrole.permissions);
        const teamData = response.data.teamMember.subrole;
        if (teamData && teamData.permissions?.length > 0) {
          teamData.permissions.forEach((data, index) => {
            if (data.module === "manageprojects") {

              const hasAddPermission = teamData.permissions[index].subPermissions.add;
              setShowAddButton(hasAddPermission);
              const hasEditPermission = teamData.permissions[index].subPermissions.edit;
              setShowEditButton(hasEditPermission);
              const hasViewPermission = teamData.permissions[index].subPermissions.view;
              setShowViewButton(hasViewPermission);
              const hasDeletePermission = teamData.permissions[index].subPermissions.delete;
              setShowDeleteButton(hasDeletePermission);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchPermission();
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/project/getprojectbyuserid/${userId}`); // Replace with your API URL
        console.log(response)
        setProjects(response.data.data);
        setFilteredProjects(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(value)

    );
    setFilteredProjects(filtered);
  };
  const handleProjectTypeChange = (e) => {
    const value = e.target.value;
    setSelectedProject(value);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
  };
  const handleFilterByDate = () => {
    applyFilters(); // Trigger the filter application when the button is clicked
  };
  const applyFilters = () => {
    let filtered = projects;
    if (search) {
      filtered = filtered.filter((project) =>
        project.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (startDate) {
      filtered = filtered.filter((project) => new Date(project.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((project) => new Date(project.createdAt) <= new Date(endDate));
    }
    if (selectedProject) {
      filtered = filtered.filter((project) => project.projectType === selectedProject);
    }

    // Apply client type filter
    if (selectedStatus) {
      filtered = filtered.filter((client) => client.status === selectedStatus);
    }
    setFilteredProjects(filtered);
  };

  const handleClick = () => {
    window.location.href = '/addprojects'; // Programmatically navigate to '/addleads' route

  };

  const handleDelete = async (id) => {


    try {
      await axios.delete(`${API_BASE_URL}/project/deleteprojects/${id}`);
      setProjects(projects.filter((project) => project._id !== id));
      setFilteredProjects(filteredProjects.filter((project) => project._id !== id));
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete project. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className=" mt-4">
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl>

          <Select value={selectedProject} onChange={handleProjectTypeChange} displayEmpty>
            <MenuItem value="">All Project Types</MenuItem>
            {projectfilter.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>

          <Select value={selectedStatus} onChange={handleStatusChange} displayEmpty>
            <MenuItem value="">All Statuses</MenuItem>
            {statusfilter.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleFilterByDate}>
          Apply Filters
        </Button>
        {showAddButton && (
          <Button

            // The target route
            variant="outlined"
            color="inherit"
            endIcon={<IoIosAddCircleOutline />
            } // Use the rounded plus icon
            style={{ marginLeft: "10px" }} // Additional styling
            onClick={handleClick}
          >
            Add Project
          </Button>
        )}
      </div>

      <TableContainer >
        <Table aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Project Type</TableCell>
              <TableCell>Client</TableCell>

              <TableCell>Labels</TableCell>
              <TableCell>Project Web Link</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      sx={{
                        backgroundColor: `${getProjectTypeColor(project.projectType)}20`, // 20 for a lightened color
                        color: getProjectTypeColor(project.projectType), // text color
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {project.projectType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getAvatar(index)}
                        alt="User Avatar"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Box sx={{ fontSize: '0.875rem', marginBottom: '10px' }}>
                          {project.client?.clientname?.owner ? project.client.clientname.owner : 'No Client Assigned'}
                        </Box>

                      </Box>
                    </Stack>
                  </TableCell>


                  <TableCell>
                    <Badge
                      sx={{
                        backgroundColor: `${getLabelColor(project.lables)}20`,
                        color: getLabelColor(project.lables),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {project.lables}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a
                      href={project.weblink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: 'gray' }}
                    >
                      {project.weblink.length > 20 ? `${project.weblink.slice(0, 20)}...` : project.weblink}
                    </a>
                  </TableCell>
                  <TableCell>₹{project.price}</TableCell>
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ color: getDeadlineColor(project.status) }}>
                    {new Date(project.Dedline).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div
                      style={{ width: "100%", height: "5px", backgroundColor: "#ddd", borderRadius: "5px" }}
                    >
                      <div
                        style={{
                          width: project.status === "Completed" ? "100%" : project.status === "In Progress" ? "50%" : "25%",
                          height: "100%",
                          backgroundColor: "#83a4f7",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      sx={{
                        backgroundColor: `${getStatusBackgroundColor(project.status)}20`,
                        color: getStatusBackgroundColor(project.status),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {showEditButton && (
                      <IconButton onClick={() => window.location.href = (`/editprojects/${project._id}`)} >
                        <Edit fontSize="small" color="primary" />
                      </IconButton>
                    )}
                    {showViewButton && (
                      <IconButton onClick={() => window.location.href = (`/projectdetails/${project._id}`)} >
                        <Visibility fontSize="small" color="success" />
                      </IconButton>
                    )}
                    {showDeleteButton && (
                      <IconButton onClick={() => handleDelete(project._id)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    )}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageProjects;
