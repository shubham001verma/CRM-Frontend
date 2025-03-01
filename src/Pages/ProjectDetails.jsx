import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { Send } from "@mui/icons-material"; 

import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Badge, Box, Avatar, IconButton, Chip } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function ProjectDetails() {
    const [project, setProject] = useState(null);
    const [domainDaysLeft, setDomainDaysLeft] = useState(null);
    const [hostingDaysLeft, setHostingDaysLeft] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("info");
    const [openAlert, setOpenAlert] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const location = useLocation();
    const id = location.pathname.split("/").pop();
    const [showEditButton, setShowEditButton] = useState(true);
    const teamId = sessionStorage.getItem("loggedInUserId");
     const [message, setMessage] = useState({ type: '', text: '' });
    const getDeadlineColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'black';
            case 'In Progress':
                return 'red';
            case 'On Hold':
                return 'gray';
            default:
                return 'black';
        }
    };

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

    const getLabelColor = (label) => {
        switch (label) {
            case 'highpriority':
                return '#f44336';
            case 'perfect':
                return '#4caf50';
            case 'ontrack':
                return '#03a9f4';
            case 'upcoming':
                return '#ffc107';
            case 'urgent':
                return '#ff5722';
            default:
                return '#6c757d';
        }
    };
    const getProjectTypeColor = (projectType) => {
        switch (projectType) {
            case 'Client Project':
                return '#673ab7'; 
            case 'Internal Project':
                return '#009688'; 
            default:
                return '#6c757d'; 
        }
    };
  
    const calculateRemainingDays = (date) => {
        const today = new Date();
        const targetDate = new Date(date);
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    };
    useEffect(() => {
        const fetchPermission = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
                console.log(response.data.teamMember.subrole.permissions);
                const teamData = response.data.teamMember.subrole;
                if (teamData && teamData.permissions?.length > 0) {
                    teamData.permissions.forEach((data, index) => {
                        if (data.module === "manageprojects") {


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
        axios
            .get(`${API_BASE_URL}/project/singleproject/${id}`)
            .then((response) => {
                const projectData = response.data.project;
                setProject(projectData);
                setDomainDaysLeft(calculateRemainingDays(projectData.domainexpDate));
                setHostingDaysLeft(calculateRemainingDays(projectData.hostingexpDate));
            })
            .catch((error) => {
                console.error("Error fetching project details:", error);
            });
    }, [id]);

    useEffect(() => {
        if (project) {
            let message = "";
            let severity = "info";

            if (domainDaysLeft !== null) {
                if (domainDaysLeft <= 5 && domainDaysLeft > 0) {
                    message = `${project.client?.clientname?.owner || "Client"}: Domain is expiring soon! (${domainDaysLeft} days left)`;
                    severity = "warning";
                } else if (domainDaysLeft <= 0) {
                    message = `${project.client?.clientname?.owner || "Client"}: Domain has expired!`;
                    severity = "error";
                }
            }

            if (hostingDaysLeft !== null) {
                if (hostingDaysLeft <= 5 && hostingDaysLeft > 0) {
                    message = `${project.client?.clientname?.owner || "Client"}: Hosting is expiring soon! (${hostingDaysLeft} days left)`;
                    severity = "warning";
                } else if (hostingDaysLeft <= 0) {
                    message = `${project.client?.clientname?.owner || "Client"}: Hosting has expired!`;
                    severity = "error";
                }
            }

            if (message) {
                setAlertMessage(message);
                setAlertSeverity(severity);
                setOpenAlert(true);
            }
        }
    }, [project, domainDaysLeft, hostingDaysLeft]);


    if (!project) {
        return <div>Loading project details...</div>;
    }

    const sendExpirationEmail = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/project/send-expiration-email/${id}`, {
           
            });
            console.log(response)
           
            setEmailSent(true);
            setMessage({ type: 'success', text: 'Experition Message send on user Email successfully!' });
        } catch (error) {
            setEmailSent(true);
            setMessage({ type: 'error', text: 'Failed to experition message send on user email. Please try again.' });
           
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };


    return (
        <div className="container mt-4">
            <Snackbar
                open={openAlert}
                autoHideDuration={6000}
                onClose={() => setOpenAlert(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenAlert(false)} severity={alertSeverity} sx={{ width: '100%' }}>
                    <AlertTitle>{alertSeverity === "error" ? "Error" : "Warning"}</AlertTitle>
                    {alertMessage}
                </Alert>
            </Snackbar>
             {message.text && <Alert severity={message.type}>{message.text}</Alert>}
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>

                <Avatar
                    src={project.avatar || ""}
                    alt={project.name}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 40,
                        bgcolor: "primary.main",
                    }}
                >
                    {!project.avatar && project.name ? project.name.charAt(0).toUpperCase() : ""}
                </Avatar>
                {showEditButton && (

                    <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
                        <IconButton onClick={() => window.location.href = `/editprojects/${project._id}`}>
                            <Edit fontSize="small" color="primary" />
                        </IconButton>
                    </Box>
                )}
            </Box>
            {(domainDaysLeft <= 0 || hostingDaysLeft <= 0) && (
                <IconButton onClick={sendExpirationEmail} sx={{marginTop:'55px'}}>
                    <Send fontSize="medium" color="primary" />
                </IconButton>
            )}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Project Name</strong></TableCell>
                            <TableCell>{project.name}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell>{project.description}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Project Type</strong></TableCell>
                            <TableCell>
                                <Badge
                                    sx={{
                                        backgroundColor: `${getProjectTypeColor(project.projectType)}20`, 
                                        color: getProjectTypeColor(project.projectType), 
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {project.projectType}
                                </Badge>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Client</strong></TableCell>
                            <TableCell>{project.client?.clientname?.owner || "No Client Assigned"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Price</strong></TableCell>
                            <TableCell>₹{project.price}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Web Link</strong></TableCell>
                            <TableCell>
                                <a
                                    href={project.weblink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'gray', textDecoration: 'none' }}
                                >
                                    {project.weblink.length > 20 ? `${project.weblink.slice(0, 20)}...` : project.weblink}
                                </a>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Start Date</strong></TableCell>
                            <TableCell>{project.startDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Dedline</strong></TableCell>
                            <TableCell sx={{ color: getDeadlineColor(project.status) }}>
                                {new Date(project.Dedline).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Hosting Provider</strong></TableCell>
                            <TableCell>{project.hosting}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Hosting Purchas Date</strong></TableCell>
                            <TableCell>{project.hostingpurchaseDate}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Hosting Expiry Date</strong></TableCell>
                            <TableCell
                                style={{
                                    color: hostingDaysLeft <= 5 ? (hostingDaysLeft <= 0 ? "red" : "orange") : "black",
                                }}
                            >
                                {project.hostingexpDate}
                                {hostingDaysLeft <= 5 && hostingDaysLeft > 0 && `(${hostingDaysLeft} days left)`}
                            </TableCell>
                        </TableRow>


                        <TableRow>
                            <TableCell><strong>Domain Provider</strong></TableCell>
                            <TableCell>{project.domain}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><strong>Domain Purchase Date</strong></TableCell>
                            <TableCell>{project.domainpurchaseDate}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><strong>Domain Expiry Date</strong></TableCell>
                            <TableCell
                                style={{
                                    color: domainDaysLeft <= 5 ? (domainDaysLeft <= 0 ? "red" : "orange") : "black",
                                }}
                            >
                                {project.domainexpDate}
                                {domainDaysLeft <= 5 && domainDaysLeft > 0 && `(${domainDaysLeft} days left)`}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Notes</strong></TableCell>
                            <TableCell>{project.notes}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Client Note</strong></TableCell>
                            <TableCell>{project.clientnotes || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Project Progress</strong></TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        width: '100px',
                                        height: '5px',
                                        backgroundColor: '#ddd',
                                        borderRadius: '5px',
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width:
                                                project.status === 'On Hold'
                                                    ? '25%'
                                                    : project.status === 'Completed'
                                                        ? '100%'
                                                        : project.status === 'In Progress'
                                                            ? '50%'
                                                            : '0%',
                                            height: '100%',
                                            backgroundColor:
                                                project.status === 'Completed'
                                                    ? '#83a4f7'
                                                    : project.status === 'On Hold'
                                                        ? '#83a4f7'
                                                        : project.status === 'In Progress'
                                                            ? '#83a4f7'
                                                            : 'transparent',
                                            borderRadius: '5px',
                                        }}
                                    />
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Labels</strong></TableCell>
                            <TableCell>
                                <Badge
                                    sx={{
                                        backgroundColor: `${getLabelColor(project.lables)}20`, // 20 for a lightened color
                                        color: getLabelColor(project.lables), // text color
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {project.lables}
                                </Badge>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell>
                                <Badge
                                    sx={{
                                        backgroundColor: `${getStatusBackgroundColor(project.status)}20`,
                                        color: getStatusBackgroundColor(project.status),
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {project.status}
                                </Badge>
                            </TableCell>

                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Services</strong></TableCell>
                            <TableCell>  {project.services && project.services.length > 0 
    ? project.services.map(service => service.name).join(", ") 
    : "No Services"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>



            {/* Toast container to show notifications */}
            <ToastContainer />
        </div>
    );
}

export default ProjectDetails;
