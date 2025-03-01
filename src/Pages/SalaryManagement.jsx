import React, { useState, useEffect } from "react";
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
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { CheckCircle, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import API_BASE_URL from "../components/Config";

const SalaryManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [salary, setSalary] = useState([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [message, setMessage] = useState({ type: "", text: "" });

  const userId = sessionStorage.getItem("useridsrmapp");

  useEffect(() => {
    fetchSalaries();
    fetchTeamMembers();
  }, []);
  const getLabelColor = (status) => {
    switch (status) {
      case "Paid": return "#28a745";
      case "Unpaid": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/salary/salarybyuserid/${userId}`);
      console.log(response)
      setSalary(response.data);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/team/getteammemberbyuserid/${userId}`);
      setTeamMembers(data.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleCalculateSalary = async () => {
    if (!selectedTeamMember) {
      setMessage({ type: "error", text: "Please select a team member!" });
      return;
    }

    const salaryData = {
      createdby: userId,
      teamMemberId: selectedTeamMember,
      month: Number(dayjs(selectedMonth).format("MM")),
      year: Number(dayjs(selectedMonth).format("YYYY")),
      status: "pending",
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/salary/calculate`, salaryData);
      console.log(response);

      setSalaries([...salaries, response.data.salary]);
      setMessage({ type: "success", text: "Salary Calculation successful!" });
      fetchSalaries()
    } catch (error) {
      console.error("Error calculating salary:", error);
      setMessage({ type: "error", text: "Failed to calculate salary. Please try again." });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleMarkAsPaid = async (salaryId) => {
    try {
      await axios.put(`${API_BASE_URL}/salary/pay`, { salaryId });
      setSalaries((prevSalaries) =>
        prevSalaries.map((salary) =>
          salary._id === salaryId ? { ...salary, status: "Paid" } : salary
        )
      );

      setMessage({ type: "success", text: "Salary marked as paid!" });
      fetchSalaries()
    } catch (error) {
      console.error("Error marking salary as paid:", error);
      setMessage({ type: "error", text: "Failed to mark salary as paid." });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDeleteSalary = async (salaryId) => {
    try {
      await axios.delete(`${API_BASE_URL}/salary/delete/${salaryId}`);

      setSalaries((prevSalaries) => prevSalaries.filter((salary) => salary._id !== salaryId));

      setMessage({ type: "success", text: "Salary record deleted!" });

      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error("Error deleting salary:", error);
      setMessage({ type: "error", text: "Failed to delete salary." });
    }
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };


  return (
    <Container>
      {message.text && <Alert severity={message.type}>{message.text}</Alert>}


      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "24px" }}>
        <Select
          value={selectedTeamMember}
          onChange={(e) => setSelectedTeamMember(e.target.value)}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Select Team Member</MenuItem>
          {teamMembers.map((member) => (
            <MenuItem key={member._id} value={member._id}>
              {member.name}
            </MenuItem>
          ))}
        </Select>

        <TextField type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />

        <Button variant="contained" onClick={handleCalculateSalary}>
          Calculate Salary
        </Button>
      </div>

      <TableContainer >
        <Table aria-label="simple table"
          sx={{
            whiteSpace: 'nowrap',
          }}>
          <TableHead>
            <TableRow>
              <TableCell><b>Team Member</b></TableCell>
              <TableCell><b>Month</b></TableCell>
              <TableCell><b>Year</b></TableCell>
              <TableCell><b>Total Days</b></TableCell>
              <TableCell><b>Present Days</b></TableCell>
              <TableCell><b>Deductions</b></TableCell>
              <TableCell><b>Final Salary</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salary.length > 0 ? (
              salary.map((salary) => (
                <TableRow key={salary._id}>
                  <TableCell>{salary.teamMember?.name || "N/A"}</TableCell>
                  <TableCell>{salary.month}</TableCell>
                  <TableCell>{salary.year}</TableCell>
                  <TableCell>{salary.totalDays}</TableCell>
                  <TableCell>{salary.presentDays}</TableCell>
                  <TableCell>{salary.deductionDays}</TableCell>
                  <TableCell>{salary.finalSalary}</TableCell>
                  <TableCell> <span style={{
                    backgroundColor: `${getLabelColor(salary.status)}20`,
                    color: getLabelColor(salary.status),
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "0.67rem",
                    fontWeight: "bold",
                  }}>
                    {salary.status}
                  </span></TableCell>
                  <TableCell>
                    {salary.status !== "Paid" && (
                      <IconButton onClick={() => handleMarkAsPaid(salary._id)}>
                        <CheckCircle color="success" fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteSalary(salary._id)}>
                      <Delete color="error" fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No salary records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SalaryManagement;
