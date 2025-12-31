import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Stack,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import ChecklistIcon from "@mui/icons-material/Checklist";
import DashboardIcon from "@mui/icons-material/Dashboard";

const features = [
  {
    title: "Secure Authentication",
    desc: "JWT-based authentication with protected routes and secure access.",
    icon: <SecurityIcon fontSize="large" />,
    color: "#1976d2", // primary
  },
  {
    title: "Task Management",
    desc: "Create, update, delete, and organize tasks efficiently.",
    icon: <ChecklistIcon fontSize="large" />,
    color: "#2e7d32", // success
  },
  {
    title: "Personal Dashboard",
    desc: "Access your profile and manage all tasks in one place.",
    icon: <DashboardIcon fontSize="large" />,
    color: "#6a1b9a", // secondary
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#f4f6f8" }}>
      <Container>
        {/* Heading */}
        <Stack spacing={1} alignItems="center" mb={6}>
          <Typography variant="overline" color="primary" fontWeight="bold">
            FEATURES
          </Typography>

          <Typography variant="h4" fontWeight="bold" align="center">
            Everything You Need to Stay Productive
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            maxWidth={520}
          >
            A clean and secure platform designed to manage tasks efficiently
            with a modern dashboard experience.
          </Typography>
        </Stack>

        {/* Cards */}
        <Grid container spacing={4}>
          {features.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
