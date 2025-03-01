import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography, Grid, Paper,Alert } from "@mui/material";
import { useParams, useNavigate,useLocation } from 'react-router-dom';
import API_BASE_URL from "../components/Config";
const permissionsList = [
    "manageleads",
    "manageclients",
    "manageprojects",
    "manageTeam",
    "manageTasks",
    "manageservices",
    "assignedtasks",
    "manageoffers",
    "dashboard",
  
];

const AddRole = () => {
    const userid = sessionStorage.getItem("useridsrmapp");
    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState({});
  
    const [error, setError] = useState("");
    const navigate = useNavigate();
     const [message, setMessage] = useState({ type: '', text: '' });

    const handlePermissionChange = (module) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [module]: prev[module] ? undefined : { add: false, edit: false, view: false, delete: false },
        }));
    };

    const handleSubPermissionChange = (module, subPermission) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [module]: {
                ...prev[module],
                [subPermission]: !prev[module][subPermission],
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
      

        const formattedPermissions = Object.keys(selectedPermissions).map((module) => ({
            module,
            subPermissions: selectedPermissions[module],
        }));

        try {
            await axios.post(`${API_BASE_URL}/role/createroles`, {
                name: roleName,
                permissions: formattedPermissions,
                createdby: userid
            });

          
            setRoleName("");
            setSelectedPermissions({});
            setMessage({ type: 'success', text: 'Role createdd successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            navigate(-1);

        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create role. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <Container maxWidth="md">
       
       
        <form onSubmit={handleSubmit}>
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}
        <Typography variant="h7" gutterBottom>
            Role Name
            </Typography>
            <TextField
                fullWidth
                label="Role Name"
                variant="outlined"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                margin="normal"
            />

            <Typography variant="h7" gutterBottom>
            Permissions
            </Typography>
            {permissionsList.map((perm) => (
                <Paper key={perm} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!selectedPermissions[perm]}
                                onChange={() => handlePermissionChange(perm)}
                            />
                        }
                        label={perm}
                    />
                    {selectedPermissions[perm] && perm !== "dashboard" && perm !== "teamdashboard" && (
                        <Grid container spacing={2} sx={{ marginLeft: 3 }}>
                            {["add", "edit", "view", "delete"].map((subPermission, index) => (
                                <Grid item xs={6} key={`${perm}-${subPermission}`}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedPermissions[perm][subPermission]}
                                                onChange={() => handleSubPermissionChange(perm, subPermission)}
                                            />
                                        }
                                        label={subPermission.charAt(0).toUpperCase() + subPermission.slice(1)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            ))}

            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                Create Role
            </Button>
        </form>
    </Container>
    );
};

export default AddRole;
