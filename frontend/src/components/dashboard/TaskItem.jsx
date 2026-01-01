import {
  Checkbox,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const TaskItem = ({ task }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "#f9fafb",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Checkbox checked={task.completed} />
        <Typography
          sx={{
            textDecoration: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </Typography>
      </Stack>

      <IconButton size="small" color="error">
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default TaskItem;
