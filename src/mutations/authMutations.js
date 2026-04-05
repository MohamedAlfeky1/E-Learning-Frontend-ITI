import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, forgotPassword, resetPassword,googleLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
        
        const role = userData.role;
        toast.success(`Welcome back, ${userData.firstName}!`);
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'teacher') navigate('/teacher/dashboard');
        else if (role === 'student') navigate('/dashboard');
        else navigate('/');
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    }
  });
};

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

        if (userData.role === 'teacher') {
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
    }
  });
};
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Reset link sent to your email!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send reset email");
    },
  });
};

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
export const useGoogleMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: googleLogin, 
    onSuccess: (response) => {
      const userData = response.data?.user || response.user;
      const token = response.data?.token || response.token;

      if (token && userData) {
        localStorage.setItem("token", token);
        queryClient.setQueryData(["auth", "me"], userData);

        toast.success(`Welcome, ${userData.firstName || 'User'}!`);
        
        const role = userData.role;

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'teacher') {
      
          navigate('/teacher/verification'); 
        } else if (role === 'student') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Google Authentication failed");
    }
  });
};