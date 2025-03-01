import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Badge
} from "@mui/material";
import { Edit, Visibility } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";
function ClientTasks() {
  const [projects, setProjects] = useState([]);

  const [tasks, setTasks] = useState([]);
  const Userid = sessionStorage.getItem("useridsrmapp");
  const getLabelColor = (label) => {
    switch (label) {
      case 'Bug':
        return '#f44336';
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
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/task/gettaskforclient/${Userid}`
        );
        console.log(response);
        setTasks(response.data.getTask
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [Userid]);



  const handleEdit = (id) => {
    console.log("Edit Task:", id);
  };

  const handleView = (id) => {
    console.log("View Task:", id);
  };

  return (
    <Box >

      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Lable</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TableRow key={task._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{task.title}</TableCell>
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
                    <TableCell>{task.assignedTo?.name || "N/A"} <Badge sx={{
                      backgroundColor: `${getConnectionTypeColor(task.assignedTo?.subrole?.name || 'N/A')}20`,
                      color: getConnectionTypeColor(task.assignedTo?.subrole?.name || 'N/A'),
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.67rem",
                      fontWeight: "bold",
                      marginLeft: "10px",
                    }}>{task.assignedTo?.subrole?.name || 'N/A'}</Badge></TableCell>
                    <TableCell>{task.project.name || "N/A"}</TableCell>
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
                    <TableCell>
                      <IconButton onClick={() => window.location.href = (`/edittaskbyclient/${task._id}`)} >
                        <Edit fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton onClick={() => window.location.href = (`/taskdetails/${task._id}`)} >
                        <Visibility fontSize="small" color="success" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No tasks found for this project.
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ClientTasks;
