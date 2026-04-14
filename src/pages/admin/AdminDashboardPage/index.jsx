import { useLogout } from "../../../utils/useLogout";

const AdminDashboardPage = () => {
  const logout = useLogout();

  return (
    <div>
      <h1>AdminDashboardPage</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboardPage;
