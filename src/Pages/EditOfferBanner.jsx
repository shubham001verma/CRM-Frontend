import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useLocation,useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, Grid,Avatar,Alert } from '@mui/material';
import API_BASE_URL from "../components/Config";
const EditOfferBanner = () => {
    const location = useLocation();
    const id = location.pathname.split("/").pop();
 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/banner/singlebanner/${id}`);
        console.log(response)
        const { title, description, status,image } = response.data.banner;
        setTitle(title);
        setDescription(description);
        setStatus(status);
        setImage(image);
      
      } catch (error) {
        setMessage('Error fetching banner details');
      }
    };
    fetchBanner();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('status', status);
    if (image) formData.append('image', image);
  
    try {
      const response = await axios.put(`${API_BASE_URL}/banner/updatebanner/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ type: 'success', text: 'Offer Banner updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
navigate(-1)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update Offer Banner. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    

      <form onSubmit={handleSubmit} encType="multipart/form-data">
         {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}sm={6}>
            <InputLabel htmlFor="image">Edit Banner Image</InputLabel>
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
                style={{ width: '150px', borderRadius: 8, marginTop: 10 }}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Edit Offer'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditOfferBanner;
