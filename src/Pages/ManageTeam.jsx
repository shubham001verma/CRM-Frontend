import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Avatar,
  Badge,
  Box,
  Button,
  Alert

} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Task } from '@mui/icons-material';
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';
import API_BASE_URL from "../components/Config";
function ManageTeam() {
  const userId = sessionStorage.getItem("useridsrmapp");
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [teamData, setTeamData] = useState([]);
  const [permissions, setPermissions] = useState(null);
  const [showAddButton, setShowAddButton] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [showViewButton, setShowViewButton] = useState(true);
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [appliedFilter, setAppliedFilter] = useState(""); 
  const [message, setMessage] = useState({ type: '', text: '' });
  const [userRole, setUserRole] = useState(null);


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        console.log(response)
        setUserRole(response.data.teamMember.role); 
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (userId) {
      fetchUserRole();
    }
  }, [userId]);
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
      case 'Hr':
        return '#FFA500';
      default:
        return '#A9A9A9'; 
    }
  };
  useEffect(() => {
    fetchTeamData();
    fetchRoles();
  }, []);
  const handleClick = () => {
    window.location.href = '/addTeam';

  };
  const handleNavigateClick = () => {
    window.location.href = '/salarymanagement';
  }
  const handleNavigateClick2 = () => {
    window.location.href = '/leavemenagement';
  }
  const handleNavigateClick3 = () => {
    window.location.href = '/managereport';
  }
  // Fetch team data
  const fetchTeamData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/team/getteammemberbyuserid/${userId}`
      );
      setTeamData(response.data.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };
  const handleDelete = async (id) => {

    try {
      await axios.delete(`${API_BASE_URL}/team/deleteteam/${id}`);
      setTeamData((prevData) => prevData.filter((member) => member._id !== id)); 
      setMessage({ type: 'success', text: 'Team deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete team. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/getrolesbyuserid/${userId}`);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
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
    setAppliedFilter(roleFilter);
  };
  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  const filteredTeamData = teamData.filter((member) => {
    const roleMatch = appliedFilter ? member.subrole?.name === appliedFilter : true;
    const searchMatch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });

  return (
    <div >

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "30px", marginBottom: "24px", }}>

        <FormControl sx={{ minWidth: 200 }}>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role.name}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleApplyFilter}>
          Apply Filter
        </Button>
        {userRole !== "Team" ? (
          <Button
            variant="outlined"
            color="inherit"
            style={{ marginLeft: "10px" }} 
            onClick={handleNavigateClick}
          >
            Salary Management
          </Button>
        ) : ''}
        {userRole !== "Team" ? (
          <Button
            variant="outlined"
            color="inherit"
            style={{ marginLeft: "10px" }} 
            onClick={handleNavigateClick2}
          >
            Leave Management
          </Button>
        ) : ''}
          {userRole !== "Team" ? (
          <Button
            variant="outlined"
            color="inherit"
            style={{ marginLeft: "10px" }} 
            onClick={handleNavigateClick3}
          >
            Team Reports
          </Button>
        ) : ''}
        {showAddButton && (
          <Button

            variant="outlined"
            color="inherit"
            endIcon={<IoIosAddCircleOutline />
            } 
            style={{ marginLeft: "10px" }} 
            onClick={handleClick}
          >
            Add Team
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
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Member Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeamData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              filteredTeamData.map((member, index) => (
                <TableRow key={member._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getAvatar(index)}
                        alt="User Avatar"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Box sx={{ fontSize: '0.875rem', marginBottom: '10px' }}>
                          {member.name}
                        </Box>

                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>+{member.phone}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.address}</TableCell>
                  <TableCell>
                    <Badge
                      sx={{
                        backgroundColor: `${getConnectionTypeColor(member.subrole?.name)}20`, 
                        color: getConnectionTypeColor(member.subrole?.name),
                        padding: "5px 5px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",

                      }}
                    >
                      {member.subrole?.name || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {showEditButton && (
                      <IconButton onClick={() => window.location.href = (`/editTeam/${member._id}`)} >
                        <Edit fontSize="small" color="primary" />
                      </IconButton>
                    )}
                    {showViewButton && (
                      <IconButton onClick={() => window.location.href = (`/teamdetails/${member._id}`)} >
                        <Visibility fontSize="small" color="success" />
                      </IconButton>
                    )}
                    {showDeleteButton && (
                      <IconButton onClick={() => handleDelete(member._id)}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    )}
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageTeam;


