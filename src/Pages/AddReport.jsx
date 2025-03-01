import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Grid, Alert } from "@mui/material";
import API_BASE_URL from "../components/Config";

const AddReport = () => {
  const navigate = useNavigate();
  const teamId = sessionStorage.getItem("loggedInUserId");
  const userId = sessionStorage.getItem("useridsrmapp");

  const [message, setMessage] = useState({ type: "", text: "" });
  const [report, setReport] = useState({
    createdby:userId,
    teamMember: teamId,
    tasksCompleted: "",
    issuesFaced: "",
    nextDayPlan: "",
  });

  const handleChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/report/submit`, report);

      setReport({
        teamMember: teamId,
        tasksCompleted: "",
        issuesFaced: "",
        nextDayPlan: "",
      });

      setMessage({ type: "success", text: "Report submitted successfully!" });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
        navigate(-1);
      }, 2000); 
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to submit report. Please try again.",
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tasks Completed"
              name="tasksCompleted"
              multiline
              rows={3}
              fullWidth
              required
              value={report.tasksCompleted}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Issues Faced"
              name="issuesFaced"
              multiline
              rows={3}
              fullWidth
              value={report.issuesFaced}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Next Day Plan"
              name="nextDayPlan"
              multiline
              rows={3}
              fullWidth
              value={report.nextDayPlan}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit Report
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddReport;
