import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { Edit, Visibility, Delete } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Badge, Box, Avatar, IconButton, Chip } from "@mui/material";
import API_BASE_URL from "../components/Config";
const OfferBannerDetails = () => {
  const location = useLocation();
  const id = location.pathname.split("/").pop();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditButton, setShowEditButton] = useState(true);
  const teamId = sessionStorage.getItem("loggedInUserId");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/banner/singlebanner/${id}`);
        setBanner(response.data.banner);
      } catch (error) {
        setError('Error fetching banner details');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${teamId}`);
        console.log(response.data.teamMember.subrole.permissions);
        const teamData = response.data.teamMember.subrole;
        if (teamData && teamData.permissions?.length > 0) {
          teamData.permissions.forEach((data, index) => {
            if (data.module === "manageoffers") {


              const hasEditPermission = teamData.permissions[index].subPermissions.edit;
              setShowEditButton(hasEditPermission);

            }
          });
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchPermission();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={banner.avatar || ""}
          alt={banner.title}
          sx={{
            width: 120,
            height: 120,
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {!banner.avatar && banner.title ? banner.title.charAt(0).toUpperCase() : ""}
        </Avatar>
        {showEditButton && (

          <Box sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#fff' }}>
            <IconButton onClick={() => window.location.href = `/editoffer/${banner._id}`}>
              <Edit fontSize="small" color="primary" />
            </IconButton>
          </Box>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>{banner.title}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{banner.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell><Badge color={banner.status === 'Active' ? 'success' : 'error'}>{banner.status}</Badge></TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Banner Image</TableCell>
              <TableCell> {banner.image && <img src={`${API_BASE_URL}/` + banner.image} alt={banner.title} width="150" />}</TableCell>
            </TableRow>
          </TableBody>


        </Table>
      </TableContainer >

    </div>
  );
};

export default OfferBannerDetails;
