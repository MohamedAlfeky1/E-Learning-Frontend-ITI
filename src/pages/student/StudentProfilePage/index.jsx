import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useUserQuery } from "@/queries/authQueries";
import { LuPencilLine } from "react-icons/lu";
import { BiSolidBadgeCheck } from "react-icons/bi";
import { Button } from "../../../components/ui/button";
import { LiaIdCard } from "react-icons/lia";
import { Label } from "@/components/ui/label";
import { Input } from "../../../components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BiShieldQuarter } from "react-icons/bi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useUpdatePasswordMutation, useUpdateProfileMutation } from "@/mutations/profileMutations";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const StudentProfilePage = () => {
  const fileInputRef = useRef();
  const { data, isLoading, error } = useUserQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useUpdatePasswordMutation()
  console.log(data);

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phonenumber: "",
    role: "",
    bio: "",
    avatar: "",
    api: ""
  });


  const handleProfileUpdate = (values) => {
    const formData = new FormData();

    formData.append("email", values.email);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("phone", values.phone);
    formData.append("bio", values.bio);

    if (values.avatar instanceof File) {
      formData.append("avatar", values.avatar);
    }

    console.log(formData);

    updateProfileMutation.mutate(formData, {
      onError: (err) => {
        setErrors((prev) => ({
          ...prev,
          api:
            err.response?.data.message ||
            "Invalid data"
        }))
      }
    })


  }

  let profileFormik = useFormik({
    initialValues: {
      email: data?.email || "",
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      phone: data?.phone || "",
      bio: data?.bio || "",
      avatar: data?.avatar || "",
    },
    enableReinitialize: true,
    onSubmit: handleProfileUpdate

  })

  const [passwordError, setPasswordError] = useState({
    newPassword: "",
    currentPassword: "",
    api: ""
  });


  const handlePasswordUpdate = (values) => {

    changePasswordMutation.mutate(
      {
        newPassword: values.newPassword,
        currentPassword: values.currentPassword,
      },
      {
        onError: (err) => {
          setPasswordError((prev) => ({
            ...prev,
            api:
              err.response?.data.message ||
              "Invalid data"
          }))
        }
      })

  }

  let passwordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    enableReinitialize: true,
    onSubmit: handlePasswordUpdate

  })

  


  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>
  if (error) return <div className="min-h-full min-w-full flex justify-center items-center"><p className="text-red-500">Error loading profile: {error.message}</p></div>

  return (
    <form onSubmit={profileFormik.handleSubmit} className="bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="col-span-4 bg-gradient-to-r from-[#F5F6FA] via-[#EDEBFF] to-[#D9D4FF] shadow-md shadow-[#000000]/10 px-10 py-5 rounded-md">

        <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-10 justify-center md:justify-start items-center">

          {/* Avatar */}
          <div className=" relative flex justify-center items-center bg-black rounded-md w-40 h-30 border-3 border-white shadow-lg shadow-gray-500/50 transform rotate-3">
            {profileFormik.values.avatar ? (
              <div className="w-full h-full overflow-hidden">

                <img className="w-full h-full object-cover rounded-md"
                  src={typeof profileFormik.values.avatar === "string" ? profileFormik.values.avatar : URL.createObjectURL(profileFormik.values.avatar)} alt={profileFormik.values.firstName} />
              </div>
            )
              :
              (
                <span className="text-gray-400">
                  {`${profileFormik.values.firstName?.[0] || ""}${profileFormik.values.lastName?.[0] || ""}`}
                </span>
              )
            }

            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 z-10 overflow-visible bg-white rounded-full p-1 hover:bg-gray-200 transition-all duration-75">
              <LuPencilLine size={14} color={'#3525CD'} />
            </div>

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

          {/* Name + Role */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-[#141B2B] font-extrabold text-xl md:text-2xl">
              {profileFormik.values.firstName + " " + profileFormik.values.lastName}
            </h1>
            <Badge className='capitalize' variant="success"><BiSolidBadgeCheck />{data.role}</Badge>
          </div>

          {/* Buttons */}
          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button className="w-full sm:w-auto px-4 py-2 text-center" variant="white">
              Preview Public Profile
            </Button>
            <Button type="submit" className="w-full sm:w-auto px-4 py-2 text-center" variant="purpleBtnDefault">
              Save Changes
            </Button>
          </div>

        </div>
      </div>

      <div className="col-span-4 md:col-span-3 bg-white col-span-1 gap-4 px-10 py-5 rounded-md">

        <div className="flex gap-3 items-center ">
          <Badge className='py-4' variant="lightPruple">
            <LiaIdCard size={25} />
          </Badge>
          <h1 className="font-bold text-xl">Personal Info</h1>
        </div>

        <div className="flex flex-col w-full gap-4 py-4 px-2">

          <div className="flex flex-col md:flex-row gap-2 w-full items-center justify-between">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label className='ps-5 flex-1 text-gray-500'>FIRST NAME</Label>
                <Input
                  type="text"
                  name="firstName"
                  value={profileFormik.values.firstName}
                  onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              </div>


              <div className="flex flex-col gap-2">
                <Label className='ps-5 text-gray-500'>PHONE NUMBER</Label>
                <Input
                  type="text"
                  name="phone"
                  value={profileFormik.values.phone}
                  onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              </div>

            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label className='ps-5 flex-1 text-gray-500'>LAST NAME</Label>
                <Input
                  type="text"
                  name="lastName"
                  value={profileFormik.values.lastName}
                  onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
              </div>


              <div className="flex flex-col gap-2">
                <Label className='ps-5 text-gray-500'>STATUS</Label>
                <Input
                  readOnly
                  type="text"
                  name="status"
                  placeholder={data.status}
                />
              </div>


            </div>

          </div>

          <div>
            <div className="flex flex-col gap-2">
              <Label className='ps-5 text-gray-500'>EMAIL ADDRESS</Label>
              <Input
                type="text"
                name="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className='ps-5 flex-1 text-gray-500 '>BIO /ABOUT ME</Label>
            <Textarea
              className='border border-transparent bg-secondary'
              rows='100'
              name='bio'
              placeholder='Enter You Bio / About'
              value={profileFormik.values.bio}
              onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
          </div>

        </div>
      </div>

      <div className="col-span-4 md:col-span-1 flex flex-row md:flex-col  gap-5  ">
        <div className="flex flex-col gap-3 px-2 py-5 rounded-md bg-white">

          <div className="flex gap-3 items-center ">
            <Badge className='py-3' variant="lightPruple">
              <BiShieldQuarter size={17} />
            </Badge>
            <h1 className="font-bold text-md">Account Security</h1>
          </div>

          <form onSubmit={passwordFormik.handleSubmit} className="bg-[#F1F3FF] flex justify-between p-2 rounded-md">
            <h3 className="text-sm px-2">Change Password</h3>

            <Dialog>
              <DialogTrigger asChild>
                <button className="text-gray-500 text-xl">
                  <MdKeyboardArrowRight />
                </button>
              </DialogTrigger>

              <DialogContent className='p-6'>
                <DialogHeader>
                  <DialogTitle className='font-semibold'>Change Your Password</DialogTitle>
                  <DialogDescription>
                    Enter your new password below
                  </DialogDescription>
                </DialogHeader>

                {/* الفورم هنا */}
                <form className="flex flex-col gap-2 mt-2">
                  <Input
                    type="password"
                    placeholder="Current Password"
                    name="currentPassword"
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  <Input
                    type="password"
                    placeholder="New Password"
                    name="newPassword"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  <Button type="submit" >
                    Save
                  </Button>
                </form>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>

          {/* <Button variant='destructiveOutline'>Deactive Account</Button> */}
        </div>

        <div className="flex flex-col gap-3 py-5 px-2 justify-center items-center rounded-md bg-white">

          <div className="flex gap-3 items-center ">
            <Badge className='py-3' variant="lightBrown">
              <MdOutlineNotificationsActive size={17} />
            </Badge>
            <h1 className="font-bold text-md">Notifications</h1>
          </div>

          <div className="flex flex-col min-w-full px-2 gap-3 items-center">
            <div className="flex justify-between items-center w-full">
              <Label className='text-[#464555]'>Course Announcements</Label>
              <div><Input className='h-4 w-4' type='checkbox' /></div>
            </div>

            <div className="flex justify-between items-center w-full">
              <Label className='text-[#464555]'>Assignment Deadlines</Label>
              <div><Input className='h-4 w-4' type='checkbox' /></div>
            </div>

            <div className="flex justify-between items-center w-full">
              <Label className='text-[#464555]'>Grade Updates</Label>
              <div><Input className='h-4 w-4' type='checkbox' /></div>
            </div>

            <div className="flex justify-between items-center w-full">
              <Label className='text-[#464555]'>Social Mentions</Label>
              <div><Input className='h-4 w-4' type='checkbox' /></div>
            </div>
          </div>

        </div>


      </div>


    </form>
  );
};

export default StudentProfilePage;