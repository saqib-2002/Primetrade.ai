import DashboardLayout from "../components/dashboard/DashboardLayout";
import UserProfileCard from "../components/dashboard/UserProfileCard";
import UserSettings from "../components/dashboard/UserSettings";
import TaskSection from "../components/dashboard/TaskSection";

const Dashboard = () => {
  const user = {
    name: "Saqib",
    email: "saqib@email.com",
  };

  const tasks = [
    { _id: 1, title: "Build dashboard UI", completed: false },
    { _id: 2, title: "Connect backend APIs", completed: true },
  ];

  return (
    <DashboardLayout
      left={
        <>
          <UserProfileCard user={user} />
          <UserSettings />
        </>
      }
      right={<TaskSection tasks={tasks} />}
    />
  );
};

export default Dashboard;
