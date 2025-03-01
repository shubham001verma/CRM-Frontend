import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../../shared/DashboardCard";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import {
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  TableContainer,
  Stack,
  Box,
  Badge,
  TextField
} from "@mui/material";
import img1 from "src/assets/images/profile/user-1.jpg";
import img2 from "src/assets/images/profile/user-2.jpg";
import img3 from "src/assets/images/profile/user-3.jpg";
import img4 from "src/assets/images/profile/user-4.jpg";
import API_BASE_URL from "../../Config";

const TopPerformers = () => {
  const userId = sessionStorage.getItem("useridsrmapp");
  const [month, setMonth] = useState("1");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const getLabelColor = (label) => {
    switch (label) {
      case "highpriority": return "#f44336";
      case "perfect": return "#4caf50";
      case "ontrack": return "#03a9f4";
      case "upcoming": return "#ffc107";
      case "urgent": return "#ff5722";
      default: return "#6c757d";
    }
  };

  const getProjectTypeColor = (projectType) => {
    switch (projectType) {
      case 'client project': return '#673ab7';
      case 'internal project': return '#009688';
      default: return '#6c757d';
    }
  };

  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    if (event.target.value) {
      const filtered = projects.filter(project => 
        project.createdAt.startsWith(event.target.value)
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/project/getprojectbyuserid/${userId}`
        );
        setProjects(response.data.data);
        setFilteredProjects(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <DashboardCard
      title="Top Projects"
      subtitle="Best Products"
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
      <TableContainer>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Project Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Labels</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 5).map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{project.name}</TableCell>
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
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={getAvatar(index)} alt="User Avatar" sx={{ width: 40, height: 40 }} />
                      <Box sx={{ fontSize: "0.875rem" }}>
                        {project.client?.clientname?.owner || "No Client Assigned"}
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Badge
                      sx={{
                        backgroundColor: `${getLabelColor(project.lables)}20`,
                        color: getLabelColor(project.lables),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {project.lables}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{project.price}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;

