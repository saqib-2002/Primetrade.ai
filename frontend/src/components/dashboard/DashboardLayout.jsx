import { Container, Grid } from "@mui/material";

const DashboardLayout = ({ left, right }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {left}
        </Grid>
        <Grid item xs={12} md={8}>
          {right}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardLayout;
