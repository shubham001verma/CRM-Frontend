import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Box, Avatar, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import API_BASE_URL from "../components/Config";
function RoleDetails() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [roleData, setRoleData] = useState(null);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/role/singleroles/${id}`);
        console.log(response.data);
        setRoleData(response.data);
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    };

    fetchRoleDetails();
  }, [id]);

  if (!roleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>

        <Avatar
          src={roleData.avatar || ""}
          alt={roleData.name}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {!roleData.avatar && roleData.name ? roleData.name.charAt(0).toUpperCase() : ""}
        </Avatar>

        <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
          <IconButton onClick={() => window.location.href = `/editrole/${roleData._id}`}>
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell>{roleData.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Permissions</strong></TableCell>
              <TableCell>
                {roleData.permissions && roleData.permissions.length > 0 ? (
                  <Typography variant="subtitle1">
                    {roleData.permissions.map((permission, index) => permission.module).join(', ')}
                  </Typography>
                ) : (
                  <span>No permissions available</span>
                )}
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RoleDetails;
