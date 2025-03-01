import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
  Badge,
  Alert
} from "@mui/material";
import { Edit, Delete, Visibility, AddCircleOutline } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
const ManageRoles = () => {
  const userId = sessionStorage.getItem("useridsrmapp")
  const [roles, setRoles] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
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
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/getrolesbyuserid/${userId}`);
      setRoles(response.data);
      setFilteredRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const deleteRole = async (id) => {

    try {
      await axios.delete(`${API_BASE_URL}/role/deleteroles/${id}`);
      setRoles(roles.filter((role) => role._id !== id));
      setFilteredRoles(filteredRoles.filter((role) => role._id !== id));
      setMessage({ type: 'success', text: 'Role deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete role. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };


  const handleApplyFilter = () => {
    if (roleFilter) {
      setFilteredRoles(roles.filter((role) => role.name === roleFilter));
    } else {
      setFilteredRoles(roles);
    }
  };
  const handleClick = () => {
    window.location.href = '/addrole';

  };
  return (
    <div>

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

        <Button
          variant="outlined"
          color="inherit"
          endIcon={<AddCircleOutline />}
          onClick={handleClick}
        >
          Add Role
        </Button>
      </div>

      <TableContainer >
        <Table aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Role Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role, index) => (
                <TableRow key={role._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell><Badge
                    sx={{
                      backgroundColor: `${getConnectionTypeColor(role.name)}20`,
                      color: getConnectionTypeColor(role.name),
                      padding: "5px 5px",
                      borderRadius: "5px",
                      fontSize: "0.67rem",
                      fontWeight: "bold",

                    }}
                  >
                    {role.name}
                  </Badge></TableCell>
                  <TableCell>
                    {Array.isArray(role.permissions) && role.permissions.length > 0
                      ? role.permissions
                        .slice(0, 2)
                        .map((permission) => permission.module)
                        .join(", ") + (role.permissions.length > 2 ? " and more..." : "")
                      : "No Permissions"}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => window.location.href = (`/editrole/${role._id}`)}>
                      <Edit fontSize="small" color="primary" />
                    </IconButton>
                    <IconButton onClick={() => window.location.href = (`/roledetails/${role._id}`)} >
                      <Visibility fontSize="small" color="success" />
                    </IconButton>
                    <IconButton onClick={() => deleteRole(role._id)}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageRoles;
