import { useState } from "react";
import { Link } from "react-router-dom";
import { useLoginMutation, useGoogleMutation } from "@/mutations/authMutations";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import AuthSideBar from "@/components/auth/AuthSideBar";
import AuthFormField from "@/components/auth/AuthFormField";
import AuthErrorMessage from "@/components/auth/AuthErrorMessage";

const LoginPage = () => {
  const loginMutation = useLoginMutation();
  const googleMutation = useGoogleMutation();

  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleMutation.mutate({ token: tokenResponse.access_token });
    },
    onError: () => {
      setApiError("Google authentication failed. Please try again.");
    },
  });

  const onSubmit = (data) => {
    setApiError("");

    loginMutation.mutate(data, {
      onError: (err) => {
        setApiError(
          err.response?.data?.message ||
            "Invalid email or password. Please try again.",
        );
      },
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-background flex items-center justify-center p-4 font-sans">
      <div className="bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden border border-border scale-[0.96] lg:scale-100">
        <AuthSideBar />
        <div className="w-full lg:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold mb-2">Sign In</h2>

            <p className="text-muted-foreground mb-6">
              Enter your credentials to manage your dashboard.
            </p>

            <AuthErrorMessage
              message={
                apiError || googleMutation.error?.response?.data?.message
              }
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <AuthFormField
                label="Email Address"
                type="email"
                placeholder="name@nexora.com"
                icon={FiMail}
                error={errors.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />

              <AuthFormField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={FiLock}
                error={errors.password}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                }
              />

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Forget Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full py-5 rounded-xl text-lg"
                disabled={loginMutation.isPending || googleMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Spinner className="w-5 h-5" /> Authenticating...
                  </>
                ) : (
                  "Sign In Account"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-muted-foreground text-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full py-5 rounded-xl"
              onClick={handleGoogleLogin}
            >
              {googleMutation.isPending ? (
                <>
                  <Spinner className="w-5 h-5" /> Connecting...
                </>
              ) : (
                <>
                  <FcGoogle size={22} /> Sign in with Google
                </>
              )}
            </Button>

            <p className="text-center text-muted-foreground mt-8 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-bold border-b border-primary/30 hover:border-primary"
              >
                Create Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
