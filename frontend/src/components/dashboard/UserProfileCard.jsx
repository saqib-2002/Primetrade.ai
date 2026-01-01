import { Card, CardContent, Typography, Avatar, Stack } from "@mui/material";

const UserProfileCard = ({ user }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={2} alignItems="center">
          <Avatar sx={{ width: 72, height: 72 }}>
            {user?.name?.[0]}
          </Avatar>

          <Typography variant="h6" fontWeight="bold">
            {user?.name}
          </Typography>

          <Typography color="text.secondary">
            {user?.email}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
