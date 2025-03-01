import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
  Box,
  Alert
} from "@mui/material";
import { Delete as DeleteIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import API_BASE_URL from "../components/Config"; 

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

const ManageReport = () => {
  const [reports, setReports] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const [message, setMessage] = useState({ type: '', text: '' });
  const userId = sessionStorage.getItem("useridsrmapp");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/report/user/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const applyFilter = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/report/user/${userId}?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReports(data);
    } catch (error) {
      console.error("Error fetching filtered reports", error);
    }
  };

  const markReviewed = async (id) => {
    setActionLoading(id);
    try {
      await axios.put(
        `${API_BASE_URL}/report/review/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setReports(
        reports.map((report) =>
          report._id === id ? { ...report, status: "Reviewed" } : report
        )
      );
    } catch (error) {
      console.error("Error marking report as reviewed", error);
    }
    setActionLoading(null);
  };

  const deleteReport = async (id) => {
  
    try {
      await axios.delete(`${API_BASE_URL}/report/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setReports(reports.filter((report) => report._id !== id));
      setMessage({ type: 'success', text: 'Report deleted successfully!' });
    } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete report. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <Container>
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <Box display="flex" gap={2} my={2} alignItems="center">
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={applyFilter}>
          Apply Filter
        </Button>
      </Box>

      {reports.length === 0 ? (
        <Typography variant="body1">No reports found</Typography>
      ) : (
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Team Member</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Tasks Completed</strong></TableCell>
                <TableCell><strong>Issues Faced</strong></TableCell>
                <TableCell><strong>Next Day Plan</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.teamMember?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(report.reportDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{report.tasksCompleted}</TableCell>
                  <TableCell>{report.issuesFaced}</TableCell>
                  <TableCell>{report.nextDayPlan}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: `${getStatusColor(report.status)}20`,
                        color: getStatusColor(report.status),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="success"
                      size="small"
                      onClick={() => markReviewed(report._id)}
                      disabled={report.status === "Reviewed" || actionLoading === report._id}
                    >
                      {actionLoading === report._id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <CheckCircleIcon fontSize="small" />
                      )}
                    </IconButton>

                    <IconButton onClick={() => deleteReport(report._id)}>
                      <DeleteIcon color="error" fontSize="small" />
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

export default ManageReport;
