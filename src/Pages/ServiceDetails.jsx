import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Avatar, Badge, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function ServiceDetails() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [showEditButton, setShowEditButton] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [serviceFilter, setServiceFilter] = useState("");
  const teamId = sessionStorage.getItem("loggedInUserId");

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        const teamData = response.data.teamMember.subrole;
        if (teamData && teamData.permissions?.length > 0) {
          teamData.permissions.forEach((data, index) => {
            if (data.module === "manageservices") {
              const hasEditPermission = teamData.permissions[index].subPermissions.edit;
              setShowEditButton(hasEditPermission);
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
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/service/singleservice/${id}`);
        setServiceData(response.data);
      } catch (error) {
        console.error('Error fetching service data:', error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  if (!serviceData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={serviceData.icon || ""}
          alt={serviceData.name}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {!serviceData.icon && serviceData.name ? serviceData.name.charAt(0).toUpperCase() : ""}
        </Avatar>
        {showEditButton && (
          <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
            <IconButton onClick={() => window.location.href = `/editservices/${serviceData._id}`}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Service Name</strong></TableCell>
              <TableCell>{serviceData.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Cost</strong></TableCell>
              <TableCell>{serviceData.cost}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Duration</strong></TableCell>
              <TableCell>{serviceData.duration || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell>{serviceData.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell>{new Date(serviceData.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ServiceDetails;
