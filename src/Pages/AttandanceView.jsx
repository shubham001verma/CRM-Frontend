import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Alert,
  IconButton
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { Edit, Visibility, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";

const AttendanceView = () => {
  const teamMemberId = sessionStorage.getItem("loggedInUserId"); 
  const [attendanceData, setAttendanceData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [leaveData, setLeaveData] = useState([]); 
  const [filteredLeaveData, setFilteredLeaveData] = useState([]); 
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [fromDateFilter, setFromDateFilter] = useState(""); 
  const [toDateFilter, setToDateFilter] = useState("");
    const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAttendance();
    fetchLeaveDetails();
  }, []);

  const handleClick = () => {
    window.location.href = "/leaveapplay"; 
  };

  const fetchAttendance = async () => {
    if (!teamMemberId) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/attendance/all/${teamMemberId}`
      );
      console.log("Attendance Data:", response.data);

      setAttendanceData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchLeaveDetails = async () => {
    if (!teamMemberId) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/leave/getleavbyteamid/${teamMemberId}`
      );
      console.log("Leave Records:", response.data.leave);
      setLeaveData(response.data.leave);
      setFilteredLeaveData(response.data.leave);
    } catch (error) {
      console.error("Error fetching leave details:", error);
    }
   
  };

  const applyFilter = () => {
    const filtered = attendanceData.filter(
      (record) => dayjs(record.clockIn).format("YYYY-MM") === month
    );
    setFilteredData(filtered);
  };

  const deleteAttendance = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/attendance/deleteattandance/${id}`);
      const updatedAttendance = attendanceData.filter((attendance) =>attendance._id !== id);
      setAttendanceData(updatedAttendance);
      setFilteredData(updatedAttendance);
      setMessage({ type: 'success', text: 'Attendence deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete attendance. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const deleteLeave = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/leave/deleteleave/${id}`);
      const updatedleaves = leaveData.filter((leave) => leave._id !== id);
      setLeaveData(updatedleaves);
      setFilteredData(updatedleaves);
      setMessage({ type: 'success', text: 'Leave deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete leave. Please try again.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const applyLeaveFilter = () => {
    const filtered = leaveData.filter((leave) => {
      const leaveStart = dayjs(leave.fromDate);
      const leaveEnd = dayjs(leave.toDate);
      const fromDate = fromDateFilter ? dayjs(fromDateFilter) : null;
      const toDate = toDateFilter ? dayjs(toDateFilter) : null;

      return (
        (!fromDate || leaveEnd.isAfter(fromDate) || leaveEnd.isSame(fromDate)) &&
        (!toDate || leaveStart.isBefore(toDate) || leaveStart.isSame(toDate))
      );
    });

    setFilteredLeaveData(filtered);
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "#32CD32";
      case "Absent":
        return "#FF4500";
      case "Half Day":
        return "#FFD700";
      default:
        return "#A9A9A9";
    }
  };

  const getLabelColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFD700"; 
      case "Approved":
        return "#32CD32"; 
      case "Rejected":
        return "#FF4500"; 
      default:
        return "#6c757d"; 
    }
  };

  return (
    <Box sx={{ p: 3 }}>
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
      <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Month"
          >
            {[...Array(12).keys()].map((i) => {
              const monthValue = dayjs().month(i).format("YYYY-MM");
              return (
                <MenuItem key={i} value={monthValue}>
                  {dayjs(monthValue).format("MMMM YYYY")}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

       
        <Button variant="contained" color="primary" onClick={applyFilter}>
          Apply Filter
        </Button>
        <Button variant="outlined" color="inherit" onClick={handleClick}>
          Apply Leave
        </Button>

      </Box>

      <Typography variant="h6" gutterBottom>
        Attendance Records
      </Typography>
      <TableContainer sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((record, index) => (
                <TableRow key={record._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {dayjs(record.clockIn).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: `${getAttendanceStatusColor(record.status)}20`,
                        color: getAttendanceStatusColor(record.status),
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "0.67rem",
                        fontWeight: "bold",
                      }}
                    >
                      {record.status}
                    </span>
                  </TableCell>
                  <IconButton onClick={() => deleteAttendance(record._id)} >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No Attendance Records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          type="date"
          label="From Date"
          InputLabelProps={{ shrink: true }}
          value={fromDateFilter}
          onChange={(e) => setFromDateFilter(e.target.value)}
        />
        <TextField
          type="date"
          label="To Date"
          InputLabelProps={{ shrink: true }}
          value={toDateFilter}
          onChange={(e) => setToDateFilter(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={applyLeaveFilter}>
          Apply Filter
        </Button>
      </Box>
      <Typography variant="h6" gutterBottom>
        Leave Records
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SNo.</TableCell>
              <TableCell>From Date</TableCell>
              <TableCell>To Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaveData.length > 0 ? (
              filteredLeaveData.map((leave, index) => (
                <TableRow key={leave._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{dayjs(leave.fromDate).format("DD MMM YYYY")}</TableCell>
                  <TableCell>{dayjs(leave.toDate).format("DD MMM YYYY")}</TableCell>
                  <TableCell>{leave.leaveReason}</TableCell>
                  <TableCell>
                    <span style={{ backgroundColor: `${getLabelColor(leave.status)}20`, color:getLabelColor(leave.status), padding: "5px 10px", borderRadius: "5px", fontSize: "0.67rem", fontWeight: "bold" }}>
                      {leave.status}
                    </span>
                  </TableCell>
                  <IconButton onClick={() => deleteLeave(leave._id)} >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Leave Records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceView;


