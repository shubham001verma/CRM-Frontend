import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogContent,
  Stack,
  Divider,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { IconSearch, IconX } from "@tabler/icons";
import { Link } from "react-router-dom";
import CustomTextField from "src/components/forms/theme-elements/CustomTextField";
import links from "../sidebar/MenuItems";

const flattenLinks = (linksObj) => {
  return Object.values(linksObj).flat(); 
};

const Search = () => {
  const [showDrawer2, setShowDrawer2] = useState(false);
  const [search, setSearch] = useState("");

  const handleDrawerClose2 = () => {
    setShowDrawer2(false);
  };

  const allRoutes = flattenLinks(links);

  const filterRoutes = (routes, query) => {
    if (!query) return []; 
    return routes.filter(
      (route) =>
        route.title.toLowerCase().includes(query.toLowerCase()) ||
        route.href.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchData = filterRoutes(allRoutes, search);

  return (
    <>
      <IconButton
        aria-label="show search"
        color="inherit"
        onClick={() => setShowDrawer2(true)}
        size="large"
      >
        <IconSearch size="16" />
      </IconButton>
      <Dialog
        open={showDrawer2}
        onClose={handleDrawerClose2}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { position: "fixed", top: 30, m: 0 } }}
      >
        <DialogContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <CustomTextField
              id="tb-search"
              placeholder="Search here..."
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton size="small" onClick={handleDrawerClose2}>
              <IconX size="18" />
            </IconButton>
          </Stack>
        </DialogContent>
        <Divider />
        <Box p={2} sx={{ maxHeight: "60vh", overflow: "auto" }}>
          <Typography variant="h5" p={1}>
            Quick Page Links
          </Typography>
          <List component="nav">
            {searchData.length > 0 ? (
              searchData.map((menu) => (
                <ListItemButton
                  key={menu.id}
                  to={menu.href}
                  component={Link}
                  sx={{ py: 0.5, px: 1 }}
                >
                  <ListItemText
                    primary={menu.title}
                    secondary={menu.href}
                    sx={{ my: 0, py: 0.5 }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Typography p={2} color="text.secondary">
                No results found
              </Typography>
            )}
          </List>
        </Box>
      </Dialog>
    </>
  );
};

export default Search;
