import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography, Chip, Box, IconButton, Avatar } from "@mui/material";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
const LeadDetails = () => {

  const teamId = sessionStorage.getItem("loggedInUserId");
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditButton, setShowEditButton] = useState(true);
  const [error, setError] = useState(null);
  const getConnectionTypeColor = (connectionType) => {
    switch (connectionType) {
      case 'Manager':
        return '#1E90FF'; // Dodger Blue
      case 'Sales Executive':
        return '#FFA500'; // Orange
      case 'Support':
        return '#20B2AA'; // Light Sea Green
      case 'Developer':
        return '#800080'; // Purple
      case 'Editor':
        return '#FF69B4'; // Hot Pink
      case 'Graphic Designer':
        return '#32CD32'; // Lime Green
      case 'Other':
        return '#708090'; // Slate Gray
      default:
        return '#A9A9A9'; // Dark Gray for undefined roles
    }
  };
  const getLabelColor = (label) => {
    switch (label) {
      case '90% probability':
        return '#28a745'; // Green
      case '50% probability':
        return '#ffc107'; // Yellow
      case 'call this week':
        return '#17a2b8'; // Teal
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
  const renderSourceIcon = (source) => {
    switch (source) {
      case 'google':
        return <FaGoogle style={{ color: '#4285F4' }} />; // Google Blue
      case 'youtube':
        return <FaYoutube style={{ color: '#FF0000' }} />; // YouTube Red
      case 'instagram':
        return <FaInstagram style={{ color: '#C13584' }} />; // Instagram Purple
      case 'facebook':
        return <FaFacebook style={{ color: '#1877F2' }} />; // Facebook Blue
      case 'twitter':
        return <FaTwitter style={{ color: '#1DA1F2' }} />; // Twitter Blue
      case 'linkedin':
        return <FaLinkedin style={{ color: '#0077B5' }} />; // LinkedIn Blue
      default:
        return null;
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return '#1e90ff'; // Bright Blue
      case 'Discussion':
        return '#20c997'; // Teal
      case 'Qualified':
        return '#28a745'; // Green
      case 'Negotiation':
        return '#ffc107'; // Amber/Yellow
      case 'Lost':
        return '#dc3545'; // Red
      case 'Won':
        return '#6f42c1'; // Purple
      default:
        return '#6c757d'; // Gray
    }
  };
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lead/singlelead/${id}`);
        setLead(response.data);
      } catch (error) {
        setError("Failed to fetch lead details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [id]);
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        console.log(response.data.teamMember.subrole.permissions);
        const teamData = response.data.teamMember.subrole;
        if (teamData && teamData.permissions?.length > 0) {
          teamData.permissions.forEach((data, index) => {
            if (data.module === "manageleads") {


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
  if (loading) return <Typography>Loading lead details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3, }}>
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={lead?.avatar || ""}
          alt={lead?.name}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {!lead?.avatar && lead?.name ? lead.name.charAt(0).toUpperCase() : ""}
        </Avatar>
        {showEditButton && (
          <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
            <IconButton onClick={() => window.location.href = `/editleads/${lead._id}`}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Box>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {Object.entries({
              'Name': lead?.name,
              'Primary Connection': (<span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{lead?.primeryConection}<span
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
              </span></span>),
              'Phone': `+${lead?.phone}`,
              'Owner': lead?.owner,
              'Source': lead?.source,
              'Address': lead?.address,
              'City': lead?.city,
              'State': lead?.state,
              'Zip': lead?.zip,
              'Comments': lead?.comments
            }).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell><strong>{key}</strong></TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell><strong>Status</strong></TableCell>
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
            </TableRow>
            <TableRow>
              <TableCell><strong>Labels</strong></TableCell>
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
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


    </Box>
  );
};

export default LeadDetails;


