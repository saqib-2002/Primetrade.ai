import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          ScalableApp
        </Typography>

        <Box>
          <Button component="" to="/login">
            Login
          </Button>
          <Button
            component=""
            to="/register"
            variant="contained"
            sx={{ ml: 1 }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
