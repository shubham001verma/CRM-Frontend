import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../components/Config";
import {
  Container,
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const ManageReportByTeam = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const teamId = sessionStorage.getItem("loggedInUserId");
const [message, setMessage] = useState({ type: '', text: '' });
const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ff9800"; 
      case "Reviewed":
        return "#4caf50"; 
      default:
        return "#6c757d"; 
    }
  };
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/report/team/${teamId}`);
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };

    if (teamId) {
      fetchReports();
    }
  }, [teamId]);

  const filterReports = () => {
    if (!selectedDate) {
      setFilteredReports(reports);
    } else {
      const filtered = reports.filter(
        (report) =>
          new Date(report.reportDate).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
      setFilteredReports(filtered);
    }
  };

  const fetchTodayReports = () => {
    window.location.href = "/addreport";
  };

  const deleteReport = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/report/delete/${id}`);
      const updatedReports = reports.filter((report) => report._id !== id);
      setReports(updatedReports);
      setFilteredReports(updatedReports);
      setMessage({ type: 'success', text: 'Report deleted successfully!' });
    } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete report. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <Container>
      
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <TextField
          label="Select Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={filterReports}>
          Apply Filter
        </Button>
        <Button variant="outlined" color="inherit" onClick={fetchTodayReports}>
          Send Today’s Details
        </Button>
      </div>

      {filteredReports.length === 0 ? (
        <Typography>No reports found</Typography>
      ) : (
        <TableContainer aria-label="simple table"
        sx={{
          whiteSpace: 'nowrap',
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Tasks Completed</strong></TableCell>
                <TableCell><strong>Issues Faced</strong></TableCell>
                <TableCell><strong>Next Day Plan</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{new Date(report.reportDate).toLocaleDateString()}</TableCell>
                  <TableCell>{report.tasksCompleted}</TableCell>
                  <TableCell>{report.issuesFaced}</TableCell>
                  <TableCell>{report.nextDayPlan}</TableCell>
                  <TableCell><span style={{
                      backgroundColor: `${getStatusColor (report.status)}20`, 
                      color: getStatusColor (report.status), 
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "0.67rem",
                      fontWeight: "bold",
                    }}>{report.status}</span></TableCell>
                  <TableCell>
                    <IconButton  onClick={() => deleteReport(report._id)}>
                      <DeleteIcon  color="error" fontSize="small"/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageReportByTeam;

