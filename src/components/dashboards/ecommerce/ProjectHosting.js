import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../../shared/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Badge,
  Snackbar,
  Alert,
  AlertTitle,
  TextField
} from "@mui/material";
import API_BASE_URL from "../../Config";
const ProjectHosting = () => {
  const userId = sessionStorage.getItem("useridsrmapp");
  const [month, setMonth] = useState("1");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const getLabelColor = (domain) => {
    switch (domain) {
      case 'GoDaddy':
        return '#f44336';
      case 'Namecheap':
        return '#4caf50';
      case 'Dynadot':
        return '#03a9f4';
      case 'IONOS':
        return '#ffc107';
      case 'Hostinger':
        return '#ff5722';
      case 'Name.com':
        return '#9c27b0';
      case 'Domain.com':
        return '#009688';
      case 'Network Solutions':
        return '#3f51b5';
      case 'Bluehost':
        return '#2196f3';
      default:
        return '#6c757d';
    }
  };
  const getHostingLabelColor = (hosting) => {
    switch (hosting) {
      case 'Bluehost':
        return '#2196f3';
      case 'HostGator':
        return '#ff9800';
      case 'GoDaddy':
        return '#f44336';
      case 'InMotion Hosting':
        return '#3f51b5';
      case 'Hostinger':
        return '#ff5722';
      default:
        return '#6c757d';
    }
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
          `${API_BASE_URL}/project/getprojectbyclientid/${userId}`
        );
        const projectData = response.data.project;
        setProjects(projectData);
        setFilteredProjects(projectData);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProjects();
  }, []);

  const calculateRemainingDays = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    let message = "";
    let severity = "info";

    projects.forEach((project) => {
      const domainDaysLeft = calculateRemainingDays(project.domainexpDate);
      const hostingDaysLeft = calculateRemainingDays(project.hostingexpDate);

      if (domainDaysLeft <= 5 && domainDaysLeft > 0) {
        message = `Your Domain for "${project.name}" is expiring soon! (${domainDaysLeft} days left)`;
        severity = "warning";
      } else if (domainDaysLeft <= 0) {
        message = `Your Domain for "${project.name}" has expired! Please renew it.`;
        severity = "error";
      }
      if (hostingDaysLeft <= 5 && hostingDaysLeft > 0) {
        message = `Your Hosting for "${project.name}" is expiring soon! (${hostingDaysLeft} days left)`;
        severity = "warning";
      } else if (hostingDaysLeft <= 0) {
        message = `Your Hosting for "${project.name}" has expired! Please renew it.`;
        severity = "error";
      }
    });

    if (message) {
      setAlertMessage(message);
      setAlertSeverity(severity);
      setOpenAlert(true);
    }
  }, [projects]);

  return (
    <DashboardCard
      title="Project Hosting"
      subtitle="Hosting details"
      action={
        <TextField
          type="date"
          size="small"
          value={selectedDate}
          onChange={handleDateChange}
        />
      }
    >
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

      <TableContainer>
        <Table aria-label="simple table" sx={{ whiteSpace: "nowrap" }}>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Domain Provider</TableCell>
              <TableCell>Domain Expiry</TableCell>
              <TableCell>Hosting Provider</TableCell>
              <TableCell>Hosting Expiry</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, 4).map((project, index) => {
                const domainDaysLeft = calculateRemainingDays(project.domainexpDate);
                const hostingDaysLeft = calculateRemainingDays(project.hostingexpDate);
                return (
                  <TableRow key={project.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>
                      {project.services && project.services.length > 0 ? (
                        <>
                          {project.services.slice(0, 1).map((service, index) => (
                            <div key={index}>{service.name}</div>
                          ))}
                          {project.services.length > 1 && <span>and More.</span>}
                        </>
                      ) : (
                        "No Services"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge sx={{
                        backgroundColor: `${getLabelColor(project.domain)}20`,
                        color: getLabelColor(project.domain),
                        padding: "5px 5px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}>  {project.domain}</Badge>
                    </TableCell>
                    <TableCell
                      style={{
                        color: domainDaysLeft <= 5
                          ? domainDaysLeft <= 0
                            ? "red"
                            : "orange"
                          : "black",
                      }}
                    >
                      {project.domainexpDate}
                    </TableCell>
                    <TableCell>
                      <Badge sx={{
                        backgroundColor: `${getHostingLabelColor(project.hosting)}20`,
                        color: getHostingLabelColor(project.hosting),
                        padding: "5px 5px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}> {project.hosting}</Badge>
                    </TableCell>
                    <TableCell
                      style={{
                        color: hostingDaysLeft <= 5
                          ? hostingDaysLeft <= 0
                            ? "red"
                            : "orange"
                          : "black",
                      }}
                    >
                      {project.hostingexpDate}
                    </TableCell>
                    <TableCell>${project.price}</TableCell>
                    <TableCell>
                      <div
                        style={{ width: "100%", height: "5px", backgroundColor: "#ddd", borderRadius: "5px" }}
                      >
                        <div
                          style={{
                            width: project.status === "Completed" ? "100%" : project.status === "In Progress" ? "50%" : "25%",
                            height: "100%",
                            backgroundColor: "#83a4f7",
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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

export default ProjectHosting;
