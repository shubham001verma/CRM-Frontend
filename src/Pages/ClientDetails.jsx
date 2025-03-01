import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams,useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Chip, Avatar, Typography, IconButton } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function ClientDetails() {
    const teamId = sessionStorage.getItem("loggedInUserId");
    const location = useLocation();
    const id = location.pathname.split("/").pop();
       const [showEditButton, setShowEditButton] = useState(true);
    const [client, setClient] = useState(null);
    const getLabelColor = (label) => {
        switch (label) {
            case '90% probability':
                return '#4caf50'; 
            case '50% probability':
                return '#ffc107'; 
            case 'call this week':
                return '#03a9f4'; 
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
            default:
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
            .get(`${API_BASE_URL}/client/singleclient/${id}`) 
            .then((response) => {
                setClient(response.data.client);
            })
            .catch((error) => {
                console.error("Error fetching client details:", error);
            });
    }, []);

    if (!client) {
        return <Typography>Loading client details...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
                <Avatar
                    src={client.avatar || ""}
                    alt={client.clientname?.owner}
                    sx={{
                        width: 120,
                        height: 120,
                        fontSize: 40,
                        bgcolor: "primary.main",
                    }}
                >
                    {!client.avatar && client.clientname?.owner ? client.clientname.owner.charAt(0).toUpperCase() : ""}
                </Avatar>
                {showEditButton && (
             
                <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
                    <IconButton onClick={() => window.location.href = `/editclients/${client._id}`}>
                        <Edit fontSize="small" color="primary" />
                    </IconButton>
                </Box>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {Object.entries({
                            'Client Name': client.clientname?.owner,
                            'Primary Connection': ( <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                {client.primeryConnection}
                                <span style={{
                                    backgroundColor: `${getConnectionTypeColor(client.primeryConectiontype)}20`, // 20 for a lightened color
                                    color: getConnectionTypeColor(client.primeryConectiontype), // text color
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "0.67rem",
                                    fontWeight: "bold",
                                }}>
                                    {client.primeryConectiontype}
                                </span>
                            </span>),
                           
                            'Email': client.email,
                            'Phone': `+${client.phone}`,
                            'Password': client.password,
                            'Company': client.company,
                            'Address': client.address,
                            'Projects': client.projects,
                            'Total Invoiced': `₹${client.totalinvoiced}`,
                            'Total Expense': `₹${client.totalexpense}`,
                            'Payment Received': `₹${client.paymentReceived}`,
                            'Due Payment': (
                                <Typography sx={{ color: client.totalinvoiced - client.paymentReceived > 0 ? 'red' : 'green' }}>
                                    ₹{client.totalinvoiced - client.paymentReceived}
                                </Typography>
                            ),
                            'Labels': (
                                <span style={{
                                    backgroundColor: `${getLabelColor(client.lables)}20`, // 20 for a lightened color
                                    color: getLabelColor(client.lables), // text color
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "0.67rem",
                                    fontWeight: "bold",
                                }}>
                                    {client.lables}
                                </span>
                            ),
                          
                            'Client Groups': (
                                <span style={{
                                    backgroundColor: `${getGroupTypeColor(client.clientgroups)}20`, // 20 for a lightened color
                                    color: getGroupTypeColor(client.clientgroups), // text color
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontSize: "0.67rem",
                                    fontWeight: "bold",
                                }}>
                                    {client.clientgroups}
                                </span>
                            ),
                        }).map(([key, value]) => (
                            <TableRow key={key}>
                                <TableCell><strong>{key}</strong></TableCell>
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ClientDetails;
