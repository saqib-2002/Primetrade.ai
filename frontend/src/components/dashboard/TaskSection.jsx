import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import TaskItem from "./TaskItem";
import { useState } from "react";

const TaskSection = ({ tasks }) => {
  const [title, setTitle] = useState("");

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          My Tasks
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="New task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="contained">Add</Button>
        </Stack>

        <Stack spacing={1}>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskSection;
