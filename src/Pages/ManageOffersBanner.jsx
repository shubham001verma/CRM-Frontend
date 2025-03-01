import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, MenuItem, Select, FormControl, Alert } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { IoIosAddCircleOutline } from "react-icons/io";
import API_BASE_URL from "../components/Config";
const ManageOfferBanner = () => {
    const [showAddButton, setShowAddButton] = useState(true);
    const [showEditButton, setShowEditButton] = useState(true);
    const [showDeleteButton, setShowDeleteButton] = useState(true);
    const [showViewButton, setShowViewButton] = useState(true);
    const userId = sessionStorage.getItem('useridsrmapp');
    const teamId = sessionStorage.getItem("loggedInUserId");
    const [banners, setBanners] = useState([]);
    const [filteredBanners, setFilteredBanners] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchBanners();
        fetchPermissions();
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return '#1e90ff';
            case 'inactive':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };
    const fetchBanners = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/banner/getbannerbyuserid/${userId}`);
            setBanners(response.data);
            setFilteredBanners(response.data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    const fetchPermissions = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
            const teamData = response.data.teamMember.subrole;
            if (teamData && teamData.permissions?.length > 0) {
                teamData.permissions.forEach((data) => {
                    if (data.module === "manageoffers") {
                        setShowAddButton(data.subPermissions.add);
                        setShowEditButton(data.subPermissions.edit);
                        setShowViewButton(data.subPermissions.view);
                        setShowDeleteButton(data.subPermissions.delete);
                    }
                });
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const handleApplyFilter = () => {
        if (selectedFilter === "") {
            setFilteredBanners(banners);
        } else {
            setFilteredBanners(banners.filter(banner => banner.title === selectedFilter));
        }
    };

    const handleDelete = async (id) => {


        try {
            await axios.delete(`${API_BASE_URL}/banner/deletebanner/${id}`);
            const updatedBanners = banners.filter((banner) => banner._id !== id);
            setBanners(updatedBanners);
            setFilteredBanners(updatedBanners);
            setMessage({ type: 'success', text: 'Offer Banner deleted successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete offer banner. Please try again.' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    return (
        <div>
            {message.text && <Alert severity={message.type}>{message.text}</Alert>}
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select value={selectedFilter} onChange={handleFilterChange} displayEmpty>
                        <MenuItem value="">All Banners</MenuItem>
                        {banners.map((banner) => (
                            <MenuItem key={banner._id} value={banner.title}>{banner.title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleApplyFilter}>
                    Apply Filter
                </Button>
                {showAddButton && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        endIcon={<IoIosAddCircleOutline />}
                        style={{ marginLeft: "10px" }}
                        onClick={() => window.location.href = "/addoffer"}
                    >
                        Add Offer
                    </Button>
                )}
            </div>

            <TableContainer >
                <Table aria-label="simple table"
                    sx={{
                        whiteSpace: 'nowrap',
                    }} >
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo.</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Banner Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBanners.length > 0 ? (
                            filteredBanners.map((banner, index) => (
                                <TableRow key={banner._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{banner.title}</TableCell>
                                    <TableCell>{banner.description}</TableCell>
                                    <TableCell><span
                                        style={{
                                            backgroundColor: `${getStatusColor(banner.status)}20`,
                                            color: getStatusColor(banner.status),
                                            padding: "5px 10px",
                                            borderRadius: "5px",
                                            fontSize: "0.67rem",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {banner.status}
                                    </span></TableCell>
                                    <TableCell>
                                        <img src={`${API_BASE_URL}/${banner.image}`} alt="banner" width="150" style={{
                                            borderRadius: 8,
                                            filter: 'blur(1px)',
                                            transition: '0.3s ease-in-out'
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        {showEditButton && (
                                            <IconButton onClick={() => window.location.href = `/editoffer/${banner._id}`}>
                                                <Edit fontSize="small" color="primary" />
                                            </IconButton>
                                        )}
                                        {showViewButton && (
                                            <IconButton onClick={() => window.location.href = `/offerdetails/${banner._id}`}>
                                                <Visibility fontSize="small" color="success" />
                                            </IconButton>
                                        )}
                                        {showDeleteButton && (
                                            <IconButton onClick={() => handleDelete(banner._id)}>
                                                <Delete fontSize="small" color="error" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={6}>No banners found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ManageOfferBanner;
