import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Typography,
  Stack,
} from "@mui/material";
import { IconClock, IconLogout } from "@tabler/icons-react";
import API_BASE_URL from "../../Config";
import DashboardCard from "../../shared/DashboardCard";

const Clockinout = () => {
  const teamId = sessionStorage.getItem("loggedInUserId");
  const [teamMember, setTeamMember] = useState({});
  const [attendance, setAttendance] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [disableClockIn, setDisableClockIn] = useState(false);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/team/singleteam/${teamId}`
        );
        setTeamMember(response.data.teamMember);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchTeamDetails();
  }, [teamId]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/attendance/status/${teamId}`
        );

        if (response.data) {
          setAttendance(response.data);
          setIsClockedIn(!response.data.clockOut);

          if (response.data.clockOut) {
            const clockOutDate = new Date(response.data.clockOut).toDateString();
            const todayDate = new Date().toDateString();

            if (clockOutDate === todayDate) {
              setDisableClockIn(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    if (teamMember._id) {
      fetchAttendance();
    }
  }, [teamMember]);

  const handleClockIn = async () => {
    if (disableClockIn) {
      alert("You have already clocked out today. You can clock in tomorrow.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/attendance/clock-in`, {
        teamMemberId: teamMember._id,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error during Clock-In!", error);
    }
  };

  const handleClockOut = async () => {
    try {
      await axios.put(`${API_BASE_URL}/attendance/clock-out`, {
        attendanceId: attendance?._id,
      });

      window.location.reload();
    } catch (error) {
      console.error("Error during Clock-Out!", error);
    }
  };

  return (
    <DashboardCard>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ backgroundColor: "#759aff", width: 60, height: 60, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconClock size={32} color="white" />
        </div>
        <div >
          <button
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              color: isClockedIn ? "gray" : "#5c87ff",
              fontSize: "16px",
              border: 'none',
              borderRadius: "8px",
              cursor: disableClockIn ? "not-allowed" : "pointer",
              outline: "none",
              background: 'transparent',

            }}
            disabled={disableClockIn}
          >
            <IconLogout size={24} style={{ marginRight: "8px", color: isClockedIn ? "gray" : "#5c87ff" }} />
            {disableClockIn ? "Clock In Disabled" : isClockedIn ? "Clock Out" : "Clock In"}
          </button>

          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            {disableClockIn ? (
              "You have already clocked out today. You can clock in tomorrow."
            ) : isClockedIn ? (
              <>
                <b>Clock In:</b> {new Date(attendance?.clockIn).toLocaleString()}
              </>
            ) : (
              "You are currently clocked out."
            )}
          </Typography>
        </div>
      </div>
    </DashboardCard>
  );
};

export default Clockinout;
