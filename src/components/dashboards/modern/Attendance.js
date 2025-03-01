import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import dayjs from "dayjs";
import { Card, CardContent, Typography } from "@mui/material";
import API_BASE_URL from "../../Config";
import DashboardCard from "../../shared/DashboardCard";

const Attendance = () => {
  const teamMemberId = sessionStorage.getItem("loggedInUserId");
  const [attendanceDates, setAttendanceDates] = useState(new Set());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/attendance/all/${teamMemberId}`);
        console.log("API Response:", response.data);

        const presentDates = new Set(
          response.data
            .filter(record => record.status === "Present")
            .map(record => dayjs(record.clockIn).format("YYYY-MM-DD"))
        );

        setAttendanceDates(presentDates);
        console.log("Processed Attendance Dates:", presentDates);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [teamMemberId]);

  return (
    <DashboardCard
    >
      <CardContent>
        <Typography variant="h5">
          Attendance Calendar
        </Typography>
        <Typography variant="h8" color="textSecondary" sx={{ mb: 6, }}>
          Your Attandances
        </Typography>
        <div style={{ display: "flex", justifyContent: "center", marginTop: '20px', marginBottom: '20px' }}>
          <Calendar
            tileClassName={({ date }) => {
              const formattedDate = dayjs(date).format("YYYY-MM-DD");
              return attendanceDates.has(formattedDate) ? "present-day" : "today-date";
            }}
          />
        </div>
      </CardContent>

      <style>{`
        /* Remove Calendar Border */
        .react-calendar {
          border: none !important;
          width: 100%;
          background-color:transparent !important;
          
        }
       /* Remove text decoration and adjust styles for weekday names */
       .react-calendar__month-view__weekdays__weekday {
         text-decoration: none !important;
         font-weight: bold;
         text-transform: capitalize ; 
         display: flex;
         justify-content: center;
         align-items: center;
         color:gray
        }

       .react-calendar__month-view__weekdays__weekday abbr {
        text-decoration: none !important; 
         cursor: default; /* Prevents hover text styles */
        }
        /* Highlight Present Days */
        .present-day {
          background-color: #759aff !important;
          color: white !important;
          border-radius: 50%;
          transition: 0.3s ease-in-out;
        }

        /* Hover effect for all calendar dates */
        .react-calendar__tile:hover {
          background-color: #dce4ff !important;
          border-radius: 50%;
           color:#5c87ff !important;
          transition: 0.3s ease-in-out;
        }

        /* Transparent background for Today's Date */
        .today-date {
          background-color: transparent !important;
           color:gray !important;
        }
       .react-calendar__navigation button {
         border-radius: 12px !important; /* Rounded corners */
        transition: 0.3s ease-in-out;
        }

        /* Change border radius on hover */
      .react-calendar__navigation button:hover {
        background-color: #dce4ff !important; /* Light gray hover effect */
        border-radius: 12px !important; /* More rounded on hover */
        color:#5c87ff !important;
       transition: 0.3s ease-in-out;
 
        }
       .react-calendar__navigation button{
      color:gray ! important
   }
      `}</style>
    </DashboardCard>
  );
};

export default Attendance;


