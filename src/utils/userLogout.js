import { logout } from "../services/authService";

/**
 * Plain utility function to log a user out of the application.
 * Removes the auth token from storage and navigates safely back to the login screen.
 */
export const userLogout = () => {
  logout();
  window.location.href = "/login";
};
