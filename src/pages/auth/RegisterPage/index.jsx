import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  useRegisterMutation,
  useGoogleMutation,
} from "../../../mutations/authMutations";

import { useGoogleLogin } from "@react-oauth/google";

import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import AuthFormField from "@/components/auth/AuthFormField";
import AuthErrorMessage from "@/components/auth/AuthErrorMessage";
import AuthSideBar from "@/components/auth/AuthSideBar";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const registerMutation = useRegisterMutation();
  const googleMutation = useGoogleMutation();

  const [role, setRole] = useState(searchParams.get("role") || "student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = (data) => {
    const { confirmPassword, ...rest } = data;
    const payload = {
      ...rest,
      email: data.email.toLowerCase().trim(),
      role,
    };

    registerMutation.mutate(payload);
  };
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (res) => {
      googleMutation.mutate({
        token: res.access_token,
        role,
      });
    },
  });

  const isLoading = registerMutation.isPending || googleMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="bg-card text-card-foreground rounded-3xl shadow-2xl w-full max-w-6xl flex overflow-hidden border border-border h-[94vh]">
        <AuthSideBar />
        <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between items-center mb-3 pt-2">
              <h2 className="text-3xl font-bold">Create Account</h2>

              <Link
                to="/login"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Login
              </Link>
            </div>

            <p className="text-muted-foreground mb-4 text-sm">
              Join our campus and start your learning journey today.
            </p>

            <div className="flex bg-muted/50 p-1 rounded-xl border border-border/40 mb-4">
              {["student", "teacher"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                    role === r
                      ? "bg-background shadow-sm text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <AuthErrorMessage
              message={
                registerMutation.error?.response?.data?.message ||
                googleMutation.error?.response?.data?.message
              }
            />

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3"
              noValidate
            >
              <div className="grid grid-cols-2 gap-3">
                <AuthFormField
                  label="First Name"
                  icon={FiUser}
                  error={errors.firstName}
                  {...register("firstName", {
                    required: "Required",
                    minLength: {
                      value: 2,
                      message: "Min 2 chars",
                    },
                  })}
                  placeholder="Safa"
                />

                <AuthFormField
                  label="Last Name"
                  icon={FiUser}
                  error={errors.lastName}
                  {...register("lastName", {
                    required: "Required",
                  })}
                  placeholder="Mousa"
                />
              </div>

              <AuthFormField
                label="Email"
                type="email"
                icon={FiMail}
                error={errors.email}
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: emailRegex,
                    message: "Invalid email",
                  },
                })}
                placeholder="name@nexora.com"
              />

              <div className="grid grid-cols-2 gap-3">
                <AuthFormField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={FiLock}
                  error={errors.password}
                  {...register("password", {
                    required: "Required",
                    minLength: {
                      value: 8,
                      message: "Min 8 chars",
                    },
                  })}
                  placeholder="********"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FiEyeOff size={14} />
                      ) : (
                        <FiEye size={14} />
                      )}
                    </button>
                  }
                />

                <AuthFormField
                  label="Confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  icon={FiLock}
                  error={errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="********"
                  rightElement={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={14} />
                      ) : (
                        <FiEye size={14} />
                      )}
                    </button>
                  }
                />
              </div>

              <AuthFormField
                label="Phone (optional)"
                icon={FiPhone}
                error={errors.phone}
                {...register("phone")}
                placeholder="+20..."
              />

              <Button
                className="w-full h-11 font-bold mt-2"
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : "Create Account"}
              </Button>
            </form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>

              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-11 font-bold gap-3"
              onClick={() => handleGoogleLogin()}
              disabled={isLoading}
            >
              <FcGoogle size={18} /> Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
