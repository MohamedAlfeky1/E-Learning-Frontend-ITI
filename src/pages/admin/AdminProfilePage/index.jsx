import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useUserQuery } from "@/queries/authQueries";
import { LuPencilLine } from "react-icons/lu";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdatePasswordMutation, useUpdateProfileMutation } from "@/mutations/profileMutations";

const AdminProfilePage = () => {
  const fileInputRef = useRef();
  const { data, isLoading, error } = useUserQuery();

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useUpdatePasswordMutation();

  const [profileApiError, setProfileApiError] = useState("");
  const [passwordApiError, setPasswordApiError] = useState("");

  /* ─── Profile Formik ─── */
  const profileFormik = useFormik({
    initialValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      role: data?.role || "",
      bio: data?.bio || "",
      avatar: data?.avatar || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("bio", values.bio);
      if (values.avatar instanceof File) formData.append("avatar", values.avatar);

      updateProfileMutation.mutate(formData, {
        onError: (err) =>
          setProfileApiError(err.response?.data?.message || "Failed to update profile"),
      });
    },
  });

  /* ─── Password Formik ─── */
  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: (values) => {
      if (values.newPassword !== values.confirmNewPassword) {
        setPasswordApiError("New passwords do not match");
        return;
      }
      changePasswordMutation.mutate(
        { currentPassword: values.currentPassword, newPassword: values.newPassword },
        {
          onError: (err) =>
            setPasswordApiError(err.response?.data?.message || "Failed to change password"),
        }
      );
    },
  });

  if (isLoading)
    return (
      <div className="min-h-full min-w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  if (error) return null;

  const fullName =
    `${profileFormik.values.firstName} ${profileFormik.values.lastName}`.trim();

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Avatar + Name + Role */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200 shadow-md flex-shrink-0">
            {profileFormik.values.avatar ? (
              <img
                className="w-full h-full object-cover"
                src={
                  typeof profileFormik.values.avatar === "string"
                    ? profileFormik.values.avatar
                    : URL.createObjectURL(profileFormik.values.avatar)
                }
                alt={fullName}
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                {`${profileFormik.values.firstName?.[0] || ""}${profileFormik.values.lastName?.[0] || ""}`}
              </span>
            )}
            {/* Edit pencil */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-full"
            >
              <LuPencilLine size={16} color="white" />
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files[0];
                profileFormik.setFieldValue("avatar", file);
              }}
            />
          </div>

          {/* Name / Role / Bio */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-extrabold text-[#141B2B]">{fullName || "Your Name"}</h1>
            <Badge variant="success" className="capitalize w-fit text-xs flex items-center gap-1">
              <BiSolidBadgeCheck />
              {data.role}
            </Badge>
            <p className="text-xs text-gray-400 mt-0.5">
              {profileFormik.values.bio || "No bio provided"}
            </p>
          </div>
        </div>

        {/* Save Changes button (header) */}
          <Button
          type="button"
          onClick={() => profileFormik.handleSubmit()}
          disabled={updateProfileMutation.isLoading}
          className="bg-gradient-to-r from-[#3525CD] to-[#712AE2] text-white px-10 rounded-lg"
        >
          {updateProfileMutation.isLoading ? "Saving…" : "Save All Changes"}
        </Button>
      </div>

      {/* ── Body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Personal Information ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
          <div>
            <h2 className="font-bold text-[#141B2B] text-base">Personal Information</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your public profile and contact details.</p>
          </div>

          {profileApiError && (
            <p className="text-sm text-red-500">{profileApiError}</p>
          )}

          {/* Full Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Full Name
              </Label>
              <div className="flex gap-2">
                <Input
                  name="firstName"
                  placeholder="First"
                  value={profileFormik.values.firstName}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                  className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
                />
                <Input
                  name="lastName"
                  placeholder="Last"
                  value={profileFormik.values.lastName}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                  className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                Email Address
              </Label>
              <Input
                name="email"
                type="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
              />
            </div>
          </div>

          {/* Role / Job Title */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Role / Job Title
            </Label>
            <Input
              readOnly
              value={data.role}
              className="bg-[#F5F6FA] border-0 text-gray-500 cursor-not-allowed capitalize"
            />
          </div>

          {/* Biography */}
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Biography
            </Label>
            <Textarea
              name="bio"
              rows={4}
              placeholder="Write a short bio about yourself…"
              value={profileFormik.values.bio}
              onChange={profileFormik.handleChange}
              onBlur={profileFormik.handleBlur}
              className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD] resize-none"
            />
          </div>
        </div>

        {/* ── Update Password ── */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5 h-fit">
          <div>
            <h2 className="font-bold text-[#141B2B] text-base">Update Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Changing your password will log you out of all other sessions.
            </p>
          </div>

          {passwordApiError && (
            <p className="text-sm text-red-500">{passwordApiError}</p>
          )}

          <form onSubmit={passwordFormik.handleSubmit} className="flex flex-col gap-3">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={passwordFormik.values.currentPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={passwordFormik.values.newPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
            />
            <Input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={passwordFormik.values.confirmNewPassword}
              onChange={passwordFormik.handleChange}
              onBlur={passwordFormik.handleBlur}
              className="bg-[#F5F6FA] border-0 focus-visible:ring-1 focus-visible:ring-[#3525CD]"
            />
            <Button
              type="submit"
              disabled={changePasswordMutation.isLoading}
              className="mt-1 bg-gradient-to-r from-[#3525CD] to-[#712AE2] text-white rounded-lg"
            >
              {changePasswordMutation.isLoading ? "Changing…" : "Change Password"}
            </Button>
          </form>
        </div>
      </div>

      {/* ── Footer save ── */}
      <div className="mt-8 border-t pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs font-light text-gray-400">Admin ID: {data._id}</p>
      </div>
    </div>
  );
};

export default AdminProfilePage;