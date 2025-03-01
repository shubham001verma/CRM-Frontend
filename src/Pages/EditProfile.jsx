import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, TextField, Button, Typography, Grid, InputLabel, Avatar ,Alert} from "@mui/material";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import API_BASE_URL from "../components/Config";
const EditProfile = () => {
  const [user, setUser] = useState({
    profileName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [image, setImage] = useState(null);
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/").pop();
   const [message, setMessage] = useState({ type: '', text: '' });
  useEffect(() => {
    const fetchRoleAndUser = async () => {
      let userRole = ""; 
      
    
      const apiUrls = [
        { url: `${API_BASE_URL}/user/singleuser/${id}`, role: "Admin" },
        { url: `${API_BASE_URL}/team/singleteam/${id}`, role: "Team" },
        { url: `${API_BASE_URL}/client/singleclient/${id}`, role: "Client" }
      ];
      
      for (let api of apiUrls) {
        try {
          const response = await axios.get(api.url);
          if (response.data) {
            userRole = api.role;
            setRole(userRole);
            break;
          }
        } catch (error) {
          console.log(`Role not found in ${api.role} API`);
        }
      }

    if (userRole === "Admin") {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/singleuser/${id}`);
        setUser({
          profileName: response.data.profileName,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
        });
        setImage(response.data.image);
      } catch (error) {
        console.error("Error fetching Admin data:", error);
      }
    } else if (userRole === "Team") {
      try {
        const response = await axios.get(`${API_BASE_URL}/team/singleteam/${id}`);
        console.log(response.data);

        setUser({
          profileName: response.data.teamMember.profileName,
          email: response.data.teamMember.email,
          phone: response.data.teamMember.phone,
          address: response.data.teamMember.address,
        });
        setImage(response.data.teamMember.image);
      } catch (error) {
        console.error("Error fetching Team data:", error);
      }
    } else if (userRole === "Client") {
      try {
        const response = await axios.get(`${API_BASE_URL}/client/singleclient/${id}`);
        console.log(response)
        setUser({
          profileName: response.data.client.profileName,
          email: response.data.client.email,
          phone: response.data.client.phone,
          address: response.data.client.address,
        });
        setImage(response.data.client.image);
      } catch (error) {
        console.error("Error fetching Client data:", error);
      }
    } else {
      setRole("Unknown");
    }
  };

  fetchRoleAndUser();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profileName", user.profileName);
    formData.append("phone", user.phone);
    formData.append("email", user.email);
    formData.append("address", user.address);
    if (image) {
      formData.append("image", image);
    }

    let updateUrl = "";
    if (role === "Admin") {
      updateUrl = `${API_BASE_URL}/user/update/${id}`;
    } else if (role === "Team") {
      updateUrl = `${API_BASE_URL}/team/updateteammemberprofile/${id}`;
    } else if (role === "Client") {
      updateUrl = `${API_BASE_URL}/client/updateclients/${id}`;
    }

    if (updateUrl) {
      try {
        await axios.put(updateUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        navigate(-1);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } else {
      alert("Invalid role. Update failed.");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
           
            <TextField
              fullWidth
              id="profileName"
              name="profileName"
              variant="outlined"
              value={user.profileName}
              onChange={handleChange}
              required
              label="Profile Name"
            />
          </Grid>
          <Grid item xs={12} md={6}>
        
            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              variant="outlined"
              value={user.email}
              onChange={handleChange}
              required
                label="Email"
            />
          </Grid>
          <Grid item xs={12} md={6}>
                      <Typography variant="body1">Phone</Typography>
          <ReactPhoneInput country="in" value={user.phone} onChange={(phone) => setUser({ ...user, phone })} inputProps={{ name: "phone", required: true }} />
          </Grid>
          <Grid item xs={12} md={6}>
        
            <TextField
              fullWidth
              id="address"
              name="address"
              variant="outlined"
              value={user.address}
              onChange={handleChange}
              required
              label="Address"
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="image">Profile Picture</InputLabel>
            <TextField
              fullWidth
              id="image"
              name="image"
              type="file"
              inputProps={{ accept: "image/*" }}
              onChange={handleImageChange}
            />
            {image && (
              <img
                src={image instanceof File ? URL.createObjectURL(image) : `${API_BASE_URL}/${image}`}
                alt="Profile"
                style={{ mt: 2, width: 130, height: 90, marginTop:'10px',borderRadius:'8px' }}
              />
            )}
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Update Profile
        </Button>
      </form>
    </Container>
  );
};

export default EditProfile;
