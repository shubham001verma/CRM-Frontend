import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaEdit } from 'react-icons/fa';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Badge, Avatar, Box, IconButton } from '@mui/material';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function TeamMemberTaskDetails() {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [showEditButton, setShowEditButton] = useState(true);
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [task, setTask] = useState(null);

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

  const getLabelColor = (label) => {
    switch (label) {
      case 'Bug':
        return '#324659';
      case 'Design':
        return '#03a9f4';
      case 'Enhancement':
        return '#4caf50';
      case 'Feedback':
        return '#ffc107';
      default:
        return '#6c757d';
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
            if (data.module === "assignedtasks") {


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
      .get(`${API_BASE_URL}/task/singletask/${id}`)
      .then((response) => setTask(response.data.task))
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  if (!task) {
    return <div>Loading task details...</div>;
  }

  return (
    <div className="container mt-4">

      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={task.avatar || ""}
          alt={task.project?.name}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {!task.avatar && task.project?.name ? task.project?.name.charAt(0).toUpperCase() : ""}
        </Avatar>
        {showEditButton && (

          <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
            <IconButton onClick={() => window.location.href = `/edittaskbyteammember/${task._id}`}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Task Title</strong></TableCell>
              <TableCell>{task.title}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell>{task.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Project</strong></TableCell>
              <TableCell>{task.project?.name || "No Project Assigned"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Assigned To</strong></TableCell>
              <TableCell>{task.assignedTo?.name || "Not Assigned"}<Badge sx={{
                backgroundColor: `${getConnectionTypeColor(task.assignedTo?.subrole?.name)}20`,
                color: getConnectionTypeColor(task.assignedTo?.subrole?.name),
                padding: "5px 10px",
                borderRadius: "5px",
                fontSize: "0.67rem",
                fontWeight: "bold",
                marginLeft: "10px",
              }}>{task.assignedTo?.subrole?.name || 'N/A'}</Badge></TableCell>
            </TableRow>

            <TableRow>
              <TableCell><strong>Start Date</strong></TableCell>
              <TableCell>{new Date(task.startDate).toLocaleDateString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Deadline</strong></TableCell>
              <TableCell style={{ color: getDeadlineColor(task.status) }}>{task.Dedline}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell>
                <Badge sx={{
                  backgroundColor: `${getStatusBackgroundColor(task.status)}20`,
                  color: getStatusBackgroundColor(task.status),
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "0.67rem",
                  fontWeight: "bold",
                }}>{task.status}</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Labels</strong></TableCell>
              <TableCell>
                <Badge sx={{
                  backgroundColor: `${getLabelColor(task.lables)}20`,
                  color: getLabelColor(task.lables),
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "0.67rem",
                  fontWeight: "bold",
                }}>{task.lables}</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><strong>Client Notes</strong></TableCell>
              <TableCell>{task.clientnotes || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </TableContainer>


    </div>
  );
}

export default TeamMemberTaskDetails;
