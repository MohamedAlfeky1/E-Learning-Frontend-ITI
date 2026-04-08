import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import { GoogleOAuthProvider } from "@react-oauth/google"; // 1. استيراد المكتبة
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import router from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, 
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="136478097339-2bi830r415h06g5jp67hn3bht90s8t1s.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" richColors closeButton/>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);