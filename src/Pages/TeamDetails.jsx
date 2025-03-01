import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams,useLocation } from 'react-router-dom';
import { Box, Avatar, Badge, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function TeamDetails() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
      const [showEditButton, setShowEditButton] = useState(true);
      const teamId = sessionStorage.getItem("loggedInUserId");
  const [teamData, setTeamData] = useState(null);


  const getConnectionTypeColor = (connectionType) => {
    switch (connectionType) {
        case 'Manager':
            return '#1E90FF'; 
        case 'Sales Executive':
            return '#FFA500';
        case 'Support':
            return '#20B2AA'; 
        case 'Developer':
            return '#800080'; 
        case 'Editor':
            return '#FF69B4'; 
        case 'Graphic Designer':
            return '#32CD32'; 
        case 'Other':
            return '#708090';
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
            if (data.module === "manageTeam") {
              
             
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
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${id}`);
        console.log(response.data.teamMember); 
        setTeamData(response.data.teamMember);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamDetails();
  }, [id]);

  if (!teamData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
     <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                     <Avatar
                         src={teamData.avatar || ""}
                         alt={teamData.name}
                         sx={{
                             width: 120,
                             height: 120,
                             fontSize: 40,
                             bgcolor: "primary.main",
                         }}
                     >
                        {!teamData.avatar && teamData.name ? teamData.name.charAt(0).toUpperCase() : ""}
                     </Avatar>
                     {showEditButton && (
                  
                     <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
                         <IconButton onClick={() => window.location.href = `/editTeam/${teamData._id}`}>
                             <Edit fontSize="small" color="primary" />
                         </IconButton>
                     </Box>
                     )}
                 </Box>
      <TableContainer component={Paper}>
        <Table>
        
          <TableBody>
          <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell>{teamData.name}<Badge  sx={{
                                                  backgroundColor: `${getConnectionTypeColor (teamData.subrole?.name)}20`, 
                                                  color:getConnectionTypeColor (teamData.subrole?.name),
                                                  padding: "5px 10px",
                                                  borderRadius: "5px",
                                                  fontSize: "0.67rem",
                                                  fontWeight: "bold",
                                                  marginLeft: "10px",
                                                }}>{teamData.subrole?.name ||'N/A'}</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell>{teamData.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Password</strong></TableCell>
              <TableCell>{teamData.password}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell>+{teamData.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell>{new Date(teamData.createdAt).toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell>{teamData.address}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Fixed Salary</strong></TableCell>
              <TableCell>₹{teamData.fixedSalary}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Final Salary</strong></TableCell>
              <TableCell>₹{teamData.finalSalary}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

  
    </div>
  );
}

export default TeamDetails;

