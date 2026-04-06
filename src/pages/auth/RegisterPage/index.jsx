import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useRegisterMutation,
  useGoogleMutation,
} from "../../../mutations/authMutations";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiPhone,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Spinner } from "../../../components/ui/spinner";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import cubesBg from "../../../assets/cubes.png";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = () => {
  const registerMutation = useRegisterMutation();
  const googleMutation = useGoogleMutation();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleMutation.mutate({
        token: tokenResponse.access_token,
        role: role,
      });
    },
    onError: () => {
      setErrors((prev) => ({
        ...prev,
        api: "Google registration failed. Please try again.",
      }));
    },
  });

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required";
        else if (value.trim().length < 2) error = "Min 2 characters required";
        break;
      case "lastName":
        if (!value.trim()) error = "Last name is required";
        break;
      case "email":
        if (!value) error = "Email address is required";
        else if (!emailRegex.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Must be at least 8 characters";
        break;
      case "confirmPassword":
        if (!value) error = "Please confirm your password";
        else if (value !== formData.password) error = "Passwords do not match";
        break;
      case "phone":
        if (value && !/^\+?[0-9\s-]{8,}$/.test(value))
          error = "Invalid phone number";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
    if (errors.api) setErrors((prev) => ({ ...prev, api: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const validateForm = () => {
    let newErrors = {};
    let allTouched = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
      allTouched[key] = true;
    });
    setErrors(newErrors);
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { confirmPassword, ...dataToSend } = formData;
    const payload = {
      ...dataToSend,
      email: dataToSend.email.toLowerCase().trim(),
      role: role,
    };

    registerMutation.mutate(payload, {
      onError: (err) => {
        setErrors((prev) => ({
          ...prev,
          api:
            err.response?.data?.message ||
            "Registration failed. Please try again.",
        }));
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-6xl flex overflow-hidden border border-gray-100 transition-all duration-500">
        <div className="hidden lg:flex w-1/2 bg-purple-600 p-16 flex-col justify-center text-white relative">
          <div
            className="absolute inset-0 opacity-50 "
            style={{ backgroundImage: `url(${cubesBg})` }}
          ></div>
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Nexora.
              <br />
              <span className="text-purple-200">Learn. Grow.</span>
            </h1>
            <p className="text-purple-100 text-lg opacity-80 italic">
              The professional way to start your coding journey.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
              <Link
                to="/login"
                className="text-xs text-purple-600 font-bold hover:underline transition-colors"
              >
                Already have an account?
              </Link>
            </div>

            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
              {["student", "teacher"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${role === r ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* API Errors Display */}
            {(errors.api ||
              googleMutation.isError ||
              registerMutation.isError) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl flex items-center gap-3 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <FiAlertCircle className="text-xl flex-shrink-0" />
                {errors.api ||
                  googleMutation.error?.response?.data?.message ||
                  registerMutation.error?.response?.data?.message ||
                  "Something went wrong."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label
                    className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.firstName && errors.firstName ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <FiUser
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.firstName && errors.firstName ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                    />
                    <Input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="First Name"
                      variant="iconFieldMd"
                      className={
                        touched.firstName && errors.firstName
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                      }
                    />
                  </div>
                  {touched.firstName && errors.firstName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label
                    className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.lastName && errors.lastName ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <FiUser
                      className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.lastName && errors.lastName ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                    />
                    <Input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Last Name"
                      variant="iconFieldMd"
                      className={
                        touched.lastName && errors.lastName
                          ? "border-red-300 bg-red-50 focus:border-red-500"
                          : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                      }
                    />
                  </div>
                  {touched.lastName && errors.lastName && (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="group">
                <label
                  className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.email && errors.email ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.email && errors.email ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                  />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    variant="iconFieldMd"
                    className={
                      touched.email && errors.email
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                    }
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="group">
                <label
                  className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.password && errors.password ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.password && errors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                  />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    variant="iconFieldXl"
                    className={
                      touched.password && errors.password
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="group">
                <label
                  className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.confirmPassword && errors.confirmPassword ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.confirmPassword && errors.confirmPassword ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                  />
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="••••••••"
                    variant="iconFieldXl"
                    className={
                      touched.confirmPassword && errors.confirmPassword
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="group">
                <label
                  className={`block text-[10px] font-bold mb-1 uppercase tracking-wider ${touched.phone && errors.phone ? "text-red-500" : "text-gray-500 group-focus-within:text-purple-600"}`}
                >
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <FiPhone
                    className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${touched.phone && errors.phone ? "text-red-400" : "text-gray-400 group-focus-within:text-purple-500"}`}
                  />
                  <Input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+20 123 456 7890"
                    variant="iconFieldMd"
                    className={
                      touched.phone && errors.phone
                        ? "border-red-300 bg-red-50 focus:border-red-500"
                        : "border-gray-200 focus:border-purple-500 focus:ring-purple-50"
                    }
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {errors.phone}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="purpleBtnXl"
                disabled={
                  registerMutation.isPending || googleMutation.isPending
                }
                className="mt-6"
              >
                {registerMutation.isPending ? (
                  <>
                    <Spinner className="w-5 h-5 border-white" /> Creating
                    Account...
                  </>
                ) : (
                  "Create Free Account"
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">
                  Or Register With
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="whiteBtnMd"
              onClick={() => handleGoogleLogin()}
              disabled={googleMutation.isPending || registerMutation.isPending}
            >
              {googleMutation.isPending ? (
                <>
                  <Spinner className="w-5 h-5 border-purple-600" />{" "}
                  Connecting...
                </>
              ) : (
                <>
                  <FcGoogle size={20} /> Google Account
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
