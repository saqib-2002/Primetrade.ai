import { Card, CardContent, Typography, Switch, Stack } from "@mui/material";

const UserSettings = () => {
  return (
    <Card sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Settings
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Dark Mode</Typography>
          <Switch />
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Email Notifications</Typography>
          <Switch defaultChecked />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserSettings;
