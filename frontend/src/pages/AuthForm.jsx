import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from "@mui/material";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      console.log("Signup Data:", formData);
    } else {
      console.log("Signin Data:", {
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" align="center" gutterBottom>
            {isSignup ? "Create Account" : "Sign In"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            {isSignup && (
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </Box>

          <Typography align="center" sx={{ mt: 2 }}>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              component="button"
              onClick={() => setIsSignup(!isSignup)}
              underline="hover"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthForm;
