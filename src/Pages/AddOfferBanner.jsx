import React, { useState} from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, Grid,Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../components/Config";
const AddOfferBanner = () => {
  const UserId = sessionStorage.getItem('useridsrmapp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const [createdby, setCreatedBy] = useState(UserId);
   const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

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
    formData.append('image', image);
    formData.append('createdby', createdby);

    try {
      const response = await axios.post(`${API_BASE_URL}/banner/addbanner`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ type: 'success', text: 'Offer Banner Created successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setTitle('');
      setDescription('');
      setStatus('active');
      setImage(null);
      setPreview(null);
      setCreatedBy(UserId);
      navigate(-1)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create Offer Banner. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
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
          <Grid item xs={12} sm={6}>
            <InputLabel htmlFor="image">Upload Banner Image</InputLabel>
            <TextField fullWidth id="image" name="image" type="file" inputProps={{ accept: 'image/*' }} onChange={handleImageChange} />
          </Grid>
          {preview && (
            <Grid item xs={12}>
              <img src={preview} alt="Banner Preview" style={{ width: '150px', borderRadius: 8, marginBottom: 10 }} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary"  disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Offer'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddOfferBanner;

