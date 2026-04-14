import { useLogout } from "../../../utils/useLogout";

const TeacherDashboardPage = () => {
  const logout = useLogout();
  return (
    <div>
      <h1>TeacherDashboardPage</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default TeacherDashboardPage;
