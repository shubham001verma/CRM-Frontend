import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../shared/DashboardCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Badge,
  TextField
} from '@mui/material';
import axios from 'axios'
import API_BASE_URL from "../../Config";
const ProductPerformances = () => {
  const [month, setMonth] = React.useState('1');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
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

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);
    if (selectedDate) {
      const filtered = tasks.filter(task =>
        task.createdAt && task.createdAt.startsWith(selectedDate)
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
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
        setFilteredTasks(response.data.getTask);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [Userid]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const grey = theme.palette.grey[300];
  const primarylight = theme.palette.primary.light;
  const greylight = theme.palette.grey[100];


  return (
    <DashboardCard
      title="Running Tasks"
      subtitle="Overview of Running Tasks"
      action={
        <>
          <TextField
            type="date"
            size="small"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </>
      }
    >
      <TableContainer >
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Task Name</TableCell>
              <TableCell>Lable</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.length > 0 ? (
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
    </DashboardCard>
  );
};

export default ProductPerformances;
