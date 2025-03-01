import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Badge, IconButton, Typography, TextField, Alert, Button, FormControl, Select, MenuItem } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from "react-icons/io";
import API_BASE_URL from "../components/Config";
const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [serviceFilter, setServiceFilter] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [showViewButton, setShowViewButton] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const teamId = sessionStorage.getItem("loggedInUserId");
  const navigate = useNavigate();
  const UserId = sessionStorage.getItem('useridsrmapp');

  useEffect(() => {
    fetchServices();
  }, []);
  const getDurationColor = (duration) => {
    switch (duration) {
      case 'Short':
        return '#1E90FF';
      case 'Medium':
        return '#FFA500';
      case 'Long':
        return '#20B2AA';
      default:
        return '#A9A9A9';
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
            if (data.module === "manageservices") {
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

  const handleApplyFilter = () => {
    if (serviceFilter) {
      setFilteredServices(services.filter((service) => service.name === serviceFilter));
    } else {
      setFilteredServices(services);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/service/getservicesbyuserid/${UserId}`);
      setServices(response.data);
      setFilteredServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleDelete = async (id) => {

    try {
      await axios.delete(`${API_BASE_URL}/service/deleteservice/${id}`);
      setServices(services.filter(service => service._id !== id));
      setFilteredServices(filteredServices.filter(service => service._id !== id));
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete service. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleClick = () => {
    window.location.href = '/addservices';
  };

  return (
    <div>
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <FormControl sx={{ minWidth: 200 }}>
          <Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Services</MenuItem>
            {services.map((service) => (
              <MenuItem key={service._id} value={service.name}>
                {service.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleApplyFilter}>
          Apply Filters
        </Button>

        {showAddButton && (
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<IoIosAddCircleOutline />}
            style={{ marginLeft: "10px" }}
            onClick={handleClick}
          >
            Add Service
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
              <TableCell><strong>SNo.</strong></TableCell>
              <TableCell><strong>Service Name</strong></TableCell>
              <TableCell><strong>Cost</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.map((service, index) => (
              <TableRow key={service._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>${service.cost}</TableCell>
                <TableCell

                >
                  <Badge
                    sx={{
                      backgroundColor: `${getDurationColor(service.duration)}20`,
                      color: getDurationColor(service.duration),
                      padding: "5px 5px",
                      borderRadius: "5px",
                      fontSize: "0.67rem",
                      fontWeight: "bold",
                    }}
                  > {service.duration || 'N/A'}</Badge >
                </TableCell>
                <TableCell>  {service.description.split(" ").slice(0, 10).join(" ")}...</TableCell>
                <TableCell>
                  {showEditButton && (
                    <IconButton onClick={() => window.location.href = (`/editservices/${service._id}`)}>
                      <Edit fontSize="small" color="primary" />
                    </IconButton>
                  )}
                  {showViewButton && (
                    <IconButton onClick={() => window.location.href = (`/servicedetails/${service._id}`)}>
                      <Visibility fontSize="small" color="success" />
                    </IconButton>
                  )}
                  {showDeleteButton && (
                    <IconButton onClick={() => handleDelete(service._id)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageServices;
