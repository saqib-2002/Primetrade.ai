import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Stack,
  Divider,
  Chip,
} from "@mui/material";

const HeroSection = () => {
  return (
    <Container sx={{ py: 10 }}>
      <Grid container spacing={6} alignItems="center">
        {/* Left */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Manage Your Tasks Efficiently
          </Typography>

          <Typography color="text.secondary" gutterBottom>
            A secure dashboard-based application to manage tasks with
            authentication and real-time updates.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" size="large">
              Get Started
            </Button>
            <Button size="large" sx={{ ml: 2 }}>
              Login
            </Button>
          </Box>
        </Grid>

        {/* Right - Dashboard Preview */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 300,
              backgroundColor: "#f9fafb",
              borderRadius: 4,
              p: 3,
              boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography fontWeight="bold">Dashboard</Typography>
              <Chip label="Active" color="success" size="small" />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Stats */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
                  <Typography variant="h6" fontWeight="bold">
                    12
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tasks
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
                  <Typography variant="h6" fontWeight="bold">
                    7
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#fff" }}>
                  <Typography variant="h6" fontWeight="bold">
                    5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Task List Preview */}
            <Box mt={3}>
              <Typography variant="body2" fontWeight="bold" mb={1}>
                Recent Tasks
              </Typography>

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  • Finish dashboard UI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Integrate authentication
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • Deploy backend API
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HeroSection;
