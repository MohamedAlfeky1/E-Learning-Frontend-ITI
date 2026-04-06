import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  googleLogin,
} from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Handles user login.
 * On success, it stores the JWT in LocalStorage, updates the React Query cache
 * with the user session, and automatically navigates the user to their respective
 * dashboard based on their role (admin, teacher, or student).
 */
export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const userData = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (token && userData) {
        localStorage.setItem("token", token);
        queryClient.setQueryData(["auth", "me"], userData);

        const { role, status } = userData; // استخراج الحالة والنوع
        toast.success(`Welcome back, ${userData.firstName}!`);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } 
        else if (role === "teacher") {
          // ✅ إذا كان المدرس غير مقبول بعد، وجهيه لصفحة التحقق
          if (status !== "approved") {
            navigate("/teacher/verification");
          } else {
            navigate("/teacher/dashboard");
          }
        } 
        else if (role === "student") {
          navigate("/dashboard");
        } 
        else {
          navigate("/");
        }
      }
    },
    // ... باقي الكود
  });
};

/**
 * Handles new user registration.
 * On success, stores the JWT and user data, then handles routing:
 * - Teachers are sent to the verification info page.
 * - Students are sent to the main dashboard.
 * - Other cases redirect to the login page.
 */
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      const userData = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (token && userData) {
        localStorage.setItem("token", token);
        queryClient.setQueryData(["auth", "me"], userData);

        toast.success("Account created successfully!");

        if (userData.role === "teacher") {
          navigate("/teacher/verification");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.success("Registered! Please login.");
        navigate("/login");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};
/**
 * Triggers a password reset request.
 * Displays a toast notification indicating if the email was successfully sent.
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Reset link sent to your email!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
      );
    },
  });
};

/**
 * Resets the user's password using a valid token and new password.
 * On success, automaticlly navigates the user back to the login page.
 */
export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }) => resetPassword(token, password),
    onSuccess: () => {
      toast.success("Password updated successfully! Please login.");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    },
  });
};
/**
 * Handles Google Single Sign-On (SSO).
 * Optimized to route teachers based on their verification status.
 */
export const useGoogleMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (response) => {
      // Extract user data and token from common response structures
      const userData = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (token && userData) {
        // 1. Persist the session
        localStorage.setItem("token", token);
        
        // 2. Update the cache so the whole app knows the user is logged in
        queryClient.setQueryData(["auth", "me"], userData);

        toast.success(`Welcome, ${userData.firstName || "User"}!`);

        const { role, status } = userData;

        // 3. Smart Routing Logic
        if (role === "admin") {
          navigate("/admin/dashboard");
        } 
        else if (role === "teacher") {
          // Check if the teacher is already approved by the admin
          if (status === "approved") {
            navigate("/teacher/dashboard");
          } else {
            // New or pending teachers must see the verification/pending status page
            navigate("/teacher/verification");
          }
        } 
        else if (role === "student") {
          // Students usually go straight to their learning dashboard
          navigate("/dashboard");
        } 
        else {
          // Fallback for any undefined roles
          navigate("/");
        }
      }
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Google Authentication failed";
      toast.error(errorMessage);
    },
  });
};