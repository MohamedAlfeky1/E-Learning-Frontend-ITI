import { useLogout } from "../../../utils/useLogout";
const StudentDashboardPage = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>StudentDashboardPage</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default StudentDashboardPage;
