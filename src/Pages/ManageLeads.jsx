import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaUser, FaPlus, FaGoogle, FaYoutube, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaEye } from 'react-icons/fa';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import axios from 'axios';
import { Link, NavLink } from 'react-router-dom';
import { FaUserPlus, FaUserTie } from "react-icons/fa6";
import AddIcon from '@mui/icons-material/Add';
import API_BASE_URL from "../components/Config";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Box,
  Avatar,
  IconButton,
  Alert
} from "@mui/material";
import { IoIosAddCircleOutline } from "react-icons/io";
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';
import { useNavigate } from 'react-router-dom';

function ManageLeads({ lead }) {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showAddButton, setShowAddButton] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [showDeleteButton, setShowDeleteButton] = useState(true);
  const [showViewButton, setShowViewButton] = useState(true);
  const userId = sessionStorage.getItem('useridsrmapp');
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [message, setMessage] = useState({ type: '', text: '' });
  const labelOptions = [
    '90% probability',
    '50% probability',
    'call this week',
    'corporate',
    'potential',
    'referral',
    'satisfied',
    'unsatisfied',
    'inactive',
  ];
  const statusOptions = [
    'New',
    'Discussion',
    'Qualified',
    'Negotiation',
    'Lost',
    'Won',
    'Pending',
    'On Hold',
    'Closed',
  ];
  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return '#1e90ff';
      case 'Discussion':
        return '#20c997';
      case 'Qualified':
        return '#28a745';
      case 'Negotiation':
        return '#ffc107';
      case 'Lost':
        return '#dc3545';
      case 'Won':
        return '#6f42c1';
      default:
        return '#6c757d';
    }
  };

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
  const getLabelColor = (label) => {
    switch (label) {
      case '90% probability':
        return '#28a745';
      case '50% probability':
        return '#ffc107';
      case 'call this week':
        return '#17a2b8';
      case 'corporate':
        return '#9c27b0';
      case 'potential':
        return '#ff5722';
      case 'referral':
        return '#8bc34a';
      case 'satisfied':
        return '#4caf50';
      case 'unsatisfied':
        return '#f44336';
      case 'inactive':
        return '#9e9e9e';
      default:
        return '#6c757d';
    }
  };
  const renderSourceIcon = (source) => {
    switch (source) {
      case 'google':
        return <FaGoogle style={{ color: '#4285F4' }} />;
      case 'youtube':
        return <FaYoutube style={{ color: '#FF0000' }} />;
      case 'instagram':
        return <FaInstagram style={{ color: '#C13584' }} />;
      case 'facebook':
        return <FaFacebook style={{ color: '#1877F2' }} />;
      case 'twitter':
        return <FaTwitter style={{ color: '#1DA1F2' }} />;
      case 'linkedin':
        return <FaLinkedin style={{ color: '#0077B5' }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead/getledsbyuserid/${userId}`);
        console.log(response)
        setLeads(response.data.data);
        setFilteredLeads(response.data.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        console.log(response.data.teamMember.subrole.permissions);
        const teamData = response.data.teamMember.subrole;
        if (teamData && teamData.permissions?.length > 0) {
          teamData.permissions.forEach((data, index) => {
            if (data.module === "manageleads") {

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

  const handleDelete = async (id) => {

    try {
      await axios.delete(`${API_BASE_URL}/lead/deleteleads/${id}`);
      const updatedLeads = leads.filter((lead) => lead._id !== id);
      setLeads(updatedLeads);
      setFilteredLeads(updatedLeads);
      setMessage({ type: 'success', text: 'Lead deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete lead. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(value)
    );
    setFilteredLeads(filtered);
  };

  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
  };

  const handleLabelFilterChange = (e) => {
    const value = e.target.value;
    setSelectedLabel(value);
  };

  const handleFilterByDate = () => {
    applyFilters();
  };

  const applyFilters = () => {
    let filtered = leads;

    if (search) {
      filtered = filtered.filter((lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter((lead) => new Date(lead.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((lead) => new Date(lead.createdAt) <= new Date(endDate));
    }

    if (selectedLabel) {
      filtered = filtered.filter((lead) => lead.lables === selectedLabel);
    }


    if (selectedStatus) {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }

    setFilteredLeads(filtered);
  };


  const handleClick = () => {
    window.location.href = '/addleads';
  };


  return (
    <div className="mt-4">
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
        />
        <Select value={selectedLabel} onChange={handleLabelFilterChange} displayEmpty>
          <MenuItem value="">All Labels</MenuItem>
          {labelOptions.map((label) => (
            <MenuItem key={label} value={label}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <Select value={selectedStatus} onChange={handleStatusFilterChange} displayEmpty>
          <MenuItem value="">All Statuses</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={handleFilterByDate}>
          Apply Filters
        </Button>
        {showAddButton && (
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<IoIosAddCircleOutline />}
            onClick={handleClick}
            style={{ marginLeft: "10px" }}
          >
            Add Lead
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
              <TableCell>Primary Connection</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <TableRow key={lead.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell> {lead.name}</TableCell>
                  <TableCell>

                    {lead.primeryConection}
                    <span
                      style={{
                        backgroundColor: `${getConnectionTypeColor(lead.primeryConectiontype)}20`,
                        color: getConnectionTypeColor(lead.primeryConectiontype),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                        marginLeft: "5px",
                      }}
                    >
                      {lead.primeryConectiontype}
                    </span>
                  </TableCell>
                  <TableCell>
                    {renderSourceIcon(lead.source)} {lead.source}
                  </TableCell>
                  <TableCell>+{lead.phone}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={getAvatar(index)}
                        alt="User Avatar"
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Box sx={{ fontSize: '0.875rem', marginBottom: '10px' }}>
                          {lead.owner}
                        </Box>

                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: `${getLabelColor(lead.lables)}20`,
                        color: getLabelColor(lead.lables),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {lead.lables}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: `${getStatusColor(lead.status)}20`,
                        color: getStatusColor(lead.status),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {showEditButton && (
                      <IconButton onClick={() => window.location.href = (`/editleads/${lead._id}`)} >
                        <Edit fontSize="small" color="primary" />
                      </IconButton>
                    )}
                    {showViewButton && (
                      <IconButton onClick={() => window.location.href = (`/leaddetails/${lead._id}`)}  >
                        <Visibility fontSize="small" color="success" />
                      </IconButton>
                    )}
                    {showDeleteButton && (
                      <IconButton onClick={() => handleDelete(lead._id)} >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    )}
                  </TableCell>


                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} style={{ textAlign: "center" }}>
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManageLeads;
