import React, { useState } from "react";
import { 
    Container, Grid, TextField, Button, MenuItem, Select, 
    InputLabel, FormControl, Typography, Box ,Alert
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";

const LeaveApply = () => {
    const teamId = sessionStorage.getItem("loggedInUserId");
    const userId = sessionStorage.getItem("useridsrmapp");

    const [formData, setFormData] = useState({
        createdby:userId,
        teamMemberId: teamId,
        startDate: "",
        endDate: "",
        leaveReason: "",
        leaveType: "Paid Leave",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState({ type: '', text: '' });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/leave/apply", formData);
          
            setFormData({ createdby:userId,teamMemberId: teamId, startDate: "", endDate: "", leaveReason: "", leaveType: "Paid Leave" });
            setMessage({ type: 'success', text: 'Leave Requst Submited successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                  navigate(-1);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submited leave requst. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <Container>
          
            <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
                 {message.text && <Alert severity={message.type}>{message.text}</Alert>}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Leave Reason"
                            type="text"
                            name="leaveReason"
                            value={formData.leaveReason}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Leave Type</InputLabel>
                            <Select
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                                label="Leave Type"
                            >
                                <MenuItem value="Paid Leave">Paid Leave</MenuItem>
                                <MenuItem value="Unpaid Leave">Unpaid Leave</MenuItem>
                                <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                                <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" >
                            Apply Leave
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default LeaveApply;
