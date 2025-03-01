import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import {
    TextField, Button, Select, MenuItem, InputLabel, TableContainer, FormControl, Table, Avatar, Stack, Alert,
    Box, TableHead, TableRow, TableCell, TableBody, Card, CardContent, Typography, Badge, IconButton,
} from "@mui/material";
import API_BASE_URL from "../components/Config";
import { IoIosAddCircleOutline } from "react-icons/io";
function AssignedTasks() {
    const userId = sessionStorage.getItem('loggedInUserId');
    const projectuserId = sessionStorage.getItem('useridsrmapp');
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [showAddButton, setShowAddButton] = useState(true);
    const [showEditButton, setShowEditButton] = useState(true);
    const [showDeleteButton, setShowDeleteButton] = useState(true);
    const [showViewButton, setShowViewButton] = useState(true);
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
    const getLabelColor = (label) => {
        switch (label) {
            case 'Bug':
                return '#f44336'; // Red
            case 'Design':
                return '#03a9f4'; // Blue
            case 'Enhancement':
                return '#4caf50'; // Green
            case 'Feedback':
                return '#ffc107'; // Yellow
            default:
                return '#6c757d'; // Default Gray
        }
    };


    const statusfilter = [
        "Completed",
        "In Progress",
        "Pending"
    ]

    const getStatusBackgroundColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#4caf50'; 
            case 'In Progress':
                return '#ffc107';
            case 'On Hold':
                return '#9e9e9e'; 
            case 'Pending':
                return '#ff5722'; 
            default:
                return '#6c757d'; 
        }
    };
    const handleClick = () => {
        window.location.href = '/addTasks'; 

    };
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/task/getassignedtask/${userId}`);
                setTasks(response.data.data);
                setFilteredTasks(response.data.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        const filtered = tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(value) ||
                task.assignedTo.name.toLowerCase().includes(value)
        );
        setFilteredTasks(filtered);
    };
    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/team/singleteam/${userId}`);
                console.log(response.data.teamMember.subrole.permissions);
                const teamData = response.data.teamMember.subrole;
                if (teamData && teamData.permissions?.length > 0) {
                    teamData.permissions.forEach((data, index) => {
                        if (data.module === "assignedtasks") {

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
    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${API_BASE_URL}/task/deletetasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
            setFilteredTasks(filteredTasks.filter(task => task._id !== taskId));
            setMessage({ type: 'success', text: 'Task deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete task. Please try again.' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/project/getprojectbyuserid/${projectuserId}`);
                console.log(response.data.data)
                setProjects(response.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProjects();
    }, []);
    const handleFilter = () => {
        let filtered = tasks;

        if (startDate) {

            filtered = filtered.filter((task) => new Date(task.createdAt) >= new Date(startDate));
        }

        if (endDate) {

            filtered = filtered.filter((task) => new Date(task.createdAt) <= new Date(endDate));
        }

        if (search) {
            filtered = filtered.filter(
                (task) =>
                    task.title.toLowerCase().includes(search.toLowerCase()) ||
                    task.assignedTo.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selectedProject) {
            filtered = filtered.filter(
                (task) => task.project?.name.toLowerCase() === selectedProject.toLowerCase()
            );
        }

        if (selectedStatus) {
            filtered = filtered.filter(
                (task) => task.status.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        setFilteredTasks(filtered);
    };
    const handleProjectTypeChange = (e) => {
        setSelectedProject(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };
    return (
        <div style={{ padding: '20px' }}>
            {message.text && <Alert severity={message.type}>{message.text}</Alert>}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <FormControl>

                    <Select value={selectedProject} onChange={handleProjectTypeChange} displayEmpty>
                        <MenuItem value="">All Projects</MenuItem>
                        {projects.map((project) => (
                            <MenuItem key={project._id} value={project?.name}>{project?.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>

                    <Select value={selectedStatus} onChange={handleStatusChange} displayEmpty>
                        <MenuItem value="">All Statuses</MenuItem>
                        {statusfilter.map((status) => (
                            <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleFilter}>Apply Filters</Button>
                {showAddButton && (
                    <Button


                        variant="outlined"
                        color="inherit"
                        endIcon={<IoIosAddCircleOutline />
                        }
                        style={{ marginLeft: "10px" }}
                        onClick={handleClick}
                    >
                        Add Task
                    </Button>
                )}
            </div>
            <TableContainer>
                <Table aria-label="simple table"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>SNo.</TableCell>
                            <TableCell>Task</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>Deadline</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task, index) => (
                                <TableRow key={task._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.project?.name || 'N/A'}</TableCell>
                                    <TableCell> <Badge sx={{
                                        backgroundColor: `${getLabelColor(task.lables)}20`,
                                        color: getLabelColor(task.lables),
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}>{task.lables}</Badge></TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{new Date(task.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={{ color: getDeadlineColor(task.status) }}>{new Date(task.Dedline).toLocaleDateString()}</TableCell>
                                    <TableCell> <Badge sx={{
                                        backgroundColor: `${getStatusBackgroundColor(task.status)}20`,
                                        color: getStatusBackgroundColor(task.status),
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}>{task.status}</Badge></TableCell>
                                    <TableCell>
                                        {showEditButton && (
                                            <IconButton onClick={() => (window.location.href = `/edittaskbyteammember/${task._id}`)}>
                                                <Edit fontSize="small" color="primary" />
                                            </IconButton>
                                        )}
                                        {showViewButton && (
                                            <IconButton onClick={() => (window.location.href = `/teammembertaskdetails/${task._id}`)}>
                                                <Visibility fontSize="small" color="success" />
                                            </IconButton>
                                        )}
                                        {showDeleteButton && (
                                            <IconButton onClick={() => handleDelete(task._id)}>
                                                <Delete fontSize="small" color="error" />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center">No tasks found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default AssignedTasks;
