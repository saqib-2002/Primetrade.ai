import { Box, Typography, Container, Stack, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#2b2b2b", // dark grey
        color: "#fff",
        py: 5,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          {/* Left */}
          <Typography variant="h6" fontWeight="bold">
            TaskFlow
          </Typography>

          {/* Center */}
          <Typography variant="body2" color="grey.400" align="center">
            Built for Frontend Developer Intern Assignment
          </Typography>

          {/* Right */}
          <Stack direction="row" spacing={2}>
            <Link href="#" underline="none" color="grey.400">
              GitHub
            </Link>
            <Link href="#" underline="none" color="grey.400">
              LinkedIn
            </Link>
          </Stack>
        </Stack>

        <Typography
          variant="caption"
          color="grey.500"
          display="block"
          align="center"
          sx={{ mt: 3 }}
        >
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
