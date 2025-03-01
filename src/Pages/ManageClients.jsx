import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
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
import { Edit, Visibility, Delete } from "@mui/icons-material";
import axios from 'axios';
import { FaUserPlus, FaUserTie } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import img1 from 'src/assets/images/profile/user-1.jpg';
import img2 from 'src/assets/images/profile/user-2.jpg';
import img3 from 'src/assets/images/profile/user-3.jpg';
import img4 from 'src/assets/images/profile/user-4.jpg';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../components/Config";
function ManageClients() {
    const userId = sessionStorage.getItem('useridsrmapp');
    const teamId = sessionStorage.getItem("loggedInUserId");
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const [selectedClientType, setSelectedClientType] = useState('');
    const [showAddButton, setShowAddButton] = useState(true);
    const [showEditButton, setShowEditButton] = useState(true);
    const [showDeleteButton, setShowDeleteButton] = useState(true);
    const [showViewButton, setShowViewButton] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const images = [img1, img2, img3, img4];
    const getAvatar = (index) => images[index % images.length];
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
    const clienttypes = [
        'VIP',
        'Gold',
        'Silver',
    ];
    // Fetch clients data from API
    const getLabelColor = (label) => {
        switch (label) {
            case '90% probability':
                return '#4caf50'; // Green
            case '50% probability':
                return '#ffc107'; // Yellow
            case 'call this week':
                return '#03a9f4'; // Blue
            case 'corporate':
                return '#9c27b0'; // Purple
            case 'potential':
                return '#ff5722'; // Orange
            case 'referral':
                return '#8bc34a'; // Light Green
            case 'satisfied':
                return '#4caf50'; // Green
            case 'unsatisfied':
                return '#f44336'; // Red
            case 'inactive':
                return '#9e9e9e'; // Gray
            default:
                return '#6c757d'; // Default Gray
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
            default:
                return '#A9A9A9';
        }
    };
    const getGroupTypeColor = (groupType) => {
        switch (groupType) {
            case 'VIP':
                return '#007bff';
            case 'Gold':
                return '#ffc107';
            case 'Silver':
                return '#6c757d';

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
                        if (data.module === "manageclients") {

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
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/client/getclientsbyuserid/${userId}`); // Replace with your API URL
                console.log(response)
                setClients(response.data.data);
                setFilteredClients(response.data.data);

            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients();
    }, []);

    const handleDelete = async (id) => {

        try {
            await axios.delete(`${API_BASE_URL}/client/deleteclients/${id}`);
            const updatedClients = clients.filter((client) => client._id !== id);
            setClients(updatedClients);
            setFilteredClients(updatedClients);
            setMessage({ type: 'success', text: 'client deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete client. Please try again.' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = clients.filter(
            (client) =>
                client.clientname.owner.toLowerCase().includes(value)

        );
        setFilteredClients(filtered);
    };

    const handleLabelFilterChange = (e) => {
        const value = e.target.value;
        setSelectedLabel(value);

    };

    const handleClientTypeFilterChange = (e) => {
        const value = e.target.value;
        setSelectedClientType(value);

    };

    const handleFilterByDate = () => {
        applyFilters();
    };

    const applyFilters = () => {
        let filtered = clients;

        if (search) {
            filtered = filtered.filter((client) =>
                client.clientname.owner.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (startDate) {
            filtered = filtered.filter((client) => new Date(client.createdAt) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter((client) => new Date(client.createdAt) <= new Date(endDate));
        }

        if (selectedLabel) {
            filtered = filtered.filter((client) => client.lables === selectedLabel);
        }

        if (selectedClientType) {
            filtered = filtered.filter((client) => client.clientgroups === selectedClientType);
        }

        setFilteredClients(filtered);
    };
    const handleClick = () => {
        window.location.href = '/addclient';

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

                <Select value={selectedClientType} onChange={handleClientTypeFilterChange} displayEmpty>
                    <MenuItem value="">All Client Types</MenuItem>
                    {clienttypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                </Select>


                <Select value={selectedLabel} onChange={handleLabelFilterChange} displayEmpty>
                    <MenuItem value="">All Labels</MenuItem>
                    {labelOptions.map((label) => (
                        <MenuItem key={label} value={label}>{label}</MenuItem>
                    ))}
                </Select>

                <Button variant="contained" color="primary" onClick={handleFilterByDate}>
                    Apply Filters
                </Button>
                {showAddButton && (
                    <Button


                        variant="outlined"
                        color="inherit"
                        endIcon={<IoIosAddCircleOutline />
                        }
                        style={{ marginLeft: "10px" }}
                        onClick={handleClick}
                    >
                        Add Client
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
                            <TableCell>Primary Connection</TableCell>
                            <TableCell>Client Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Labels</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Expense Price</TableCell>
                            <TableCell>Payment Received</TableCell>
                            <TableCell>Due</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client, index) => (
                                <TableRow key={client._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            {client.primeryConnection}
                                            <span style={{
                                                backgroundColor: `${getConnectionTypeColor(client.primeryConectiontype)}20`,
                                                color: getConnectionTypeColor(client.primeryConectiontype),
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                                fontSize: "0.67rem",
                                                fontWeight: "bold",
                                            }}>
                                                {client.primeryConectiontype}
                                            </span>
                                        </span>
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
                                                    {client.clientname?.owner ? client.clientname?.owner : 'null'}

                                                </Box>

                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    <TableCell>+{client.phone}</TableCell>
                                    <TableCell>
                                        <span style={{
                                            backgroundColor: `${getGroupTypeColor(client.clientgroups)}20`,
                                            color: getGroupTypeColor(client.clientgroups),
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            fontSize: "0.67rem",
                                            fontWeight: "bold",
                                        }}>
                                            {client.clientgroups}
                                        </span>
                                    </TableCell>
                                    <TableCell>{client.company}</TableCell>
                                    <TableCell>
                                        <span style={{
                                            backgroundColor: `${getLabelColor(client.lables)}20`,
                                            color: getLabelColor(client.lables),
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            fontSize: "0.67rem",
                                            fontWeight: "bold",
                                        }}>
                                            {client.lables}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>₹{client.totalinvoiced}</TableCell>
                                    <TableCell>₹{client.totalexpense}</TableCell>
                                    <TableCell>₹{client.paymentReceived}</TableCell>
                                    <TableCell style={{ color: client.totalinvoiced - client.paymentReceived > 0 ? 'red' : 'green' }}>
                                        ₹{client.totalinvoiced - client.paymentReceived}
                                    </TableCell>
                                    <TableCell>
                                        {showEditButton && (
                                            <IconButton onClick={() => window.location.href = (`/editclients/${client._id}`)} >
                                                <Edit fontSize="small" color="primary" />
                                            </IconButton>
                                        )}
                                        {showViewButton && (
                                            <IconButton onClick={() => window.location.href = (`/clientdetails/${client._id}`)} >
                                                <Visibility fontSize="small" color="success" />
                                            </IconButton>
                                        )}
                                        {showDeleteButton && (
                                            <IconButton onClick={() => handleDelete(client._id)}>
                                                <Delete fontSize="small" color="error" />
                                            </IconButton>
                                        )}
                                    </TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={12} style={{ textAlign: "center" }}>
                                    No clients found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default ManageClients;
