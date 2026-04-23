import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useResetPasswordMutation } from "@/mutations/authMutations";
import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiCheck,
  FiArrowLeft,
  FiX,
  FiLock,
} from "react-icons/fi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const resetMutation = useResetPasswordMutation();

  const isMinLength = password.length >= 8;
  const isPasswordMatch =
    password === confirmPassword && confirmPassword !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPasswordMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    resetMutation.mutate(
      { token, password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully! Please login.");
          navigate("/login");
        },
        onError: (err) => {
          toast.error(
            err.response?.data?.message || "Link expired or invalid"
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiShield size={26} />
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Secure Your Account
          </h1>

          <p className="text-sm text-muted-foreground">
            Create a strong password to continue
          </p>
        </div>

        {/* Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Reset Password</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label>New Password</Label>

                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 text-muted-foreground" />

                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label>Confirm Password</Label>

                <div className="relative">
                  <FiShield
                    className={`absolute left-3 top-3.5 ${
                      isPasswordMatch || !confirmPassword
                        ? "text-muted-foreground"
                        : "text-destructive"
                    }`}
                  />

                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className={`pl-10 ${
                      confirmPassword && !isPasswordMatch
                        ? "border-destructive"
                        : ""
                    }`}
                  />
                </div>

                {confirmPassword && !isPasswordMatch && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <FiX /> Passwords do not match
                  </p>
                )}
              </div>

              <Alert>
                <FiCheck className="text-primary" />
                <AlertDescription>
                  Minimum 8 characters and both passwords must match
                </AlertDescription>
              </Alert>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  resetMutation.isPending ||
                  !isPasswordMatch ||
                  !isMinLength
                }
              >
                {resetMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80"
              >
                <FiArrowLeft size={16} />
                Back to Login
              </Link>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordForm;