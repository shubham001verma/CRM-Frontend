import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Container,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Typography,
    Grid,
    Paper,
    Alert
} from "@mui/material";
import API_BASE_URL from "../components/Config";
const permissionsList = [
    "manageleads",
    "manageclients",
    "manageprojects",
    "manageTeam",
    "manageTasks",
    "manageservices",
    "manageoffers",
    "assignedtasks",
    "dashboard",
];

const initializePermissions = () => {
    let permissions = {};
    permissionsList.forEach((perm) => {
        permissions[perm] = {
            selected: false,
            add: false,
            edit: false,
            view: false,
            delete: false,
        };
    });
    return permissions;
};

const EditRole = () => {
    const location = useLocation();
    const id = location.pathname.split("/").pop();
    const navigate = useNavigate();
    const userid = sessionStorage.getItem("useridsrmapp");

    const [roleName, setRoleName] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState(initializePermissions());

    const [error, setError] = useState("");
      const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchRoleData = async () => {
        if (!id) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/role/singleroles/${id}`);
            const roleData = response.data;

            setRoleName(roleData.name);

            let updatedPermissions = initializePermissions();

            roleData.permissions.forEach((perm) => {
                if (updatedPermissions.hasOwnProperty(perm.module)) {
                    updatedPermissions[perm.module] = {
                        selected: true,
                        add: perm.subPermissions?.add === true, 
                        edit: perm.subPermissions?.edit === true,
                        view: perm.subPermissions?.view === true,
                        delete: perm.subPermissions?.delete === true,
                    };
                }
            });

            setSelectedPermissions(updatedPermissions);
        } catch (err) {
            setError("Failed to load role details.");
        }
    };

    fetchRoleData();
}, [id]);

    const handlePermissionChange = (module) => {
        setSelectedPermissions((prev) => ({
            ...prev,
            [module]: {
                ...prev[module],
                selected: !prev[module].selected,
                add: prev[module].selected ? false : prev[module].add,
                edit: prev[module].selected ? false : prev[module].edit,
                view: prev[module].selected ? false : prev[module].view,
                delete: prev[module].selected ? false : prev[module].delete,
            },
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
      
  
        const formattedPermissions = Object.keys(selectedPermissions)
            .filter((moduleName) => selectedPermissions[moduleName].selected)         
            .map((moduleName) => {
                console.log('Module:', selectedPermissions[moduleName]);
                console.log('SubPermissions:', selectedPermissions[moduleName].selected); 
        
                return {
                    module: moduleName,
                    subPermissions: {
                    add: selectedPermissions[moduleName].add == true,
                    edit: selectedPermissions[moduleName].edit == true,
                    view: selectedPermissions[moduleName].view == true,
                    delete: selectedPermissions[moduleName].delete == true,
                    }
                };
            });

        try {
            console.log(formattedPermissions)
            await axios.put(`${API_BASE_URL}/role/updateroles/${id}`, {
                name: roleName,
                permissions: formattedPermissions,
              
            });

            setMessage({ type: 'success', text: 'Role updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            navigate(-1); 
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to updated role. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <Container maxWidth="md">
          
            <form onSubmit={handleSubmit}>
                 {message.text && <Alert severity={message.type}>{message.text}</Alert>}
                <Typography variant="h6" gutterBottom>
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

                <Typography variant="h6" gutterBottom>
                    Permissions
                </Typography>
                {permissionsList.map((perm) => (
                    <Paper key={perm} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedPermissions[perm].selected}
                                    onChange={() => handlePermissionChange(perm)}
                                />
                            }
                            label={perm}
                        />
                        {selectedPermissions[perm].selected &&
                            perm !== "dashboard" &&
                            perm !== "teamdashboard" && (
                                <Grid container spacing={2} sx={{ marginLeft: 3 }}>
                                    {["add", "edit", "view", "delete"].map((subPermission) => (
                                        <Grid item xs={6} key={`${perm}-${subPermission}`}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedPermissions[perm][subPermission]}
                                                        onChange={() =>
                                                            handleSubPermissionChange(perm, subPermission)
                                                        }
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
                    Update Role
                </Button>
            </form>
        </Container>
    );
};

export default EditRole;
