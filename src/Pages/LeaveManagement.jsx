import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
    Container, Table, TableHead, TableRow, TableCell, 
    TableBody, Button, TextField, IconButton ,Alert
} from "@mui/material";
import { CheckCircle, Cancel, Delete } from "@mui/icons-material";
import API_BASE_URL from "../components/Config";

const LeaveManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const userId = sessionStorage.getItem("useridsrmapp");
 const [message, setMessage] = useState({ type: '', text: '' });
    useEffect(() => {
        axios.get(`${API_BASE_URL}/leave/getleavbyuserid/${userId}`)
            .then(response => {
                if (Array.isArray(response.data.leave)) {
                    setLeaveRequests(response.data.leave);
                    setFilteredRequests(response.data.leave);
                } else {
                    console.error("Invalid API response:", response.data.leave);
                    setLeaveRequests([]);
                    setFilteredRequests([]);
                }
            })
            .catch(error => console.error("Error fetching leave requests:", error));
    }, [userId]);

    const handleLeaveAction = async (leaveId, status) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/leave/approve`, { leaveId, status });
           
            setLeaveRequests(prev => prev.map(leave => leave._id === leaveId ? { ...leave, status } : leave));
            setFilteredRequests(prev => prev.map(leave => leave._id === leaveId ? { ...leave, status } : leave));
            setMessage({ type: 'success', text: 'Leave Approve successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to  leave approve. Please try again.' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleDeleteLeave = async (leaveId) => {
        try {
            await axios.delete(`${API_BASE_URL}/leave/deleteleave/${leaveId}`);
          
            setLeaveRequests(prev => prev.filter(leave => leave._id !== leaveId));
            setFilteredRequests(prev => prev.filter(leave => leave._id !== leaveId));
            setMessage({ type: 'success', text: 'Leave deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete leave requst. Please try again.' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const applyFilter = () => {
        if (!Array.isArray(leaveRequests)) {
            console.error("leaveRequests is not an array:", leaveRequests);
            return;
        }

        const filtered = leaveRequests.filter(leave => {
            const leaveStartDate = new Date(leave.startDate);
            const leaveEndDate = new Date(leave.endDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || leaveStartDate >= start) && (!end || leaveEndDate <= end);
        });

        setFilteredRequests(filtered);
    };

    const getLabelColor = (status) => {
        switch (status) {
            case "Pending": return "#ffc107"; 
            case "Approved": return "#28a745"; 
            case "Rejected": return "#dc3545"; 
            default: return "#6c757d"; 
        }
    };

    return (
        <Container>
     
  {message.text && <Alert severity={message.type}>{message.text}</Alert>}
          
            <div style={{display: "flex", gap: "20px", marginBottom: "20px" }}>
                <TextField 
                    label="Start Date" 
                    type="date" 
                    InputLabelProps={{ shrink: true }} 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                />
                <TextField 
                    label="End Date" 
                    type="date" 
                    InputLabelProps={{ shrink: true }} 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                />
                <Button variant="contained" color="primary" onClick={applyFilter}>
                    Apply Filter
                </Button>
            </div>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Leave Type</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
                        filteredRequests.map(leave => (
                            <TableRow key={leave._id}>
                                <TableCell>{leave.teamMember?.name || "Unknown"}</TableCell>
                                <TableCell>{leave.leaveType}</TableCell>
                                <TableCell>{new Date(leave.startDate).toDateString()}</TableCell>
                                <TableCell>{new Date(leave.endDate).toDateString()}</TableCell>
                                <TableCell>
                                    <span style={{
                                        backgroundColor: `${getLabelColor(leave.status)}20`,
                                        color: getLabelColor(leave.status),
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        fontSize: "0.67rem",
                                        fontWeight: "bold",
                                    }}>
                                        {leave.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {leave.status === "Pending" && (
                                        <>
                                            <IconButton onClick={() => handleLeaveAction(leave._id, "Approved")}>
                                                <CheckCircle color="success" fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => handleLeaveAction(leave._id, "Rejected")}>
                                                <Cancel color="error" fontSize="small" />
                                            </IconButton>
                                        </>
                                    )}
                                    <IconButton onClick={() => handleDeleteLeave(leave._id)}>
                                        <Delete color="error" fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}>
                                No Data Available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Container>
    );
};

export default LeaveManagement;
