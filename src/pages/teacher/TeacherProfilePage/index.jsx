
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
import { MdKeyboardArrowRight, MdOutlineStarOutline, MdOutlineNotificationsActive, MdKey, MdOutlineShare } from "react-icons/md";
import { useUpdatePasswordMutation, useUpdateProfileMutation } from "@/mutations/profileMutations";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { Popover } from "@/components/ui/popover";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IoEyeOutline } from "react-icons/io5";
import { useTeacherCourses } from "@/queries/teacherCoursesQueries";
import { IoPeople } from "react-icons/io5";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import { PiBank } from "react-icons/pi";
import { MdAlternateEmail } from "react-icons/md";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";



const TeacherProfilePage = () => {

  const fileInputRef = useRef();
  const { data, isLoading, error } = useUserQuery();
  const { data: myCourses, isLoading: coursesLoading, error: coursesError } = useTeacherCourses();
  console.log(myCourses);
  const profileUrl = `${window.location.origin}/teacher/profile/${data?._id}`;



  console.log("data", data);

  const updateProfileMutation = useUpdateProfileMutation();
  const changePasswordMutation = useUpdatePasswordMutation()
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
      bio: "" || "",
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

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
  };


  if (isLoading) return <div className="min-h-full min-w-full flex justify-center items-center"><Loader /></div>
  if (error) return

  return (
    <form onSubmit={profileFormik.handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 col-span-1 bg-gradient-to-r from-[#F5F6FA] via-[#EDEBFF] to-[#D9D4FF] shadow-md shadow-[#000000]/10 px-10 py-5 rounded-md">
        <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-10 justify-center md:justify-start items-center">

          {/* Avatar */}
          <div className=" relative flex justify-center items-center bg-black rounded-md w-40 h-30 shadow-lg shadow-gray-500/50">
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
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <h1 className="text-[#141B2B] font-extrabold text-xl md:text-2xl">
              {profileFormik.values.firstName + " " + profileFormik.values.lastName}
            </h1>
            <p className="text-sm text-gray-500">{profileFormik.data || 'No BIO Provided'}</p>
            <Badge className='capitalize' variant="success"><BiSolidBadgeCheck />{data.role}</Badge>

            {/* Buttons */}
            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              {/* {data.teacherData.targetCategories.map((category)=>{
            <Badge className='capitalize' variant="lightPruple">{category}</Badge>
            })} */}
            </div>

            <div className="flex gap-4 ">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MdAlternateEmail color="#464555" size={22} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{data.email}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <MdOutlineShare color="#464555" size={22} />
                    </span>
                  </TooltipTrigger>

                  <TooltipContent className="flex items-center gap-2">
                    <span className="text-xs truncate max-w-[150px]">
                      {profileUrl}
                    </span>

                    <button
                      onClick={handleCopy}
                      className="text-xs text-gray-500 bg-[#F1F3FF] px-2 py-1 rounded hover:bg-gray-300"
                    >
                      Copy
                    </button>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <form onSubmit={profileFormik.handleSubmit} >

                <Dialog>
                  <DialogTrigger asChilds>
                    <LuPencilLine color="#464555" size={22} />
                  </DialogTrigger>

                  <DialogContent className='p-6'>
                    <DialogHeader>
                      <DialogTitle className='font-semibold'>Update Your Profile Data</DialogTitle>

                    </DialogHeader>

                    {/* الفورم هنا */}
                    <form className="flex flex-col gap-2 mt-2">
                      <Input
                        type="text"
                        name="firstName"
                        value={profileFormik.values.firstName}
                        onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
                      <Input
                        type="text"
                        name="lastName"
                        value={profileFormik.values.lastName}
                        onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
                      <Input
                        type="text"
                        name="phone"
                        value={profileFormik.values.phone}
                        onChange={profileFormik.handleChange} onBlur={profileFormik.handleBlur} />
                      <Input
                        readOnly
                        type="text"
                        name="status"
                        placeholder={data.status}
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


            </div>
          </div>




        </div>
      </div>

      <div className="col-span-1 bg-gradient-to-r from-[#3525CD]  to-[#712AE2] shadow-md shadow-[#000000]/10 px-3 py-5 rounded-md">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="flex justify-between items-center gap-5">
            <span className="text-[#F6EFEF] text-sm">Student View Preview</span>
            <IoEyeOutline color="white" />
          </div>

          <div className="bg-[#d6bdfe] gap-2 rounded-md w-full p-2 shadow-lg shadow-gray-500/50">
            <div className="flex gap-2 items-center">
              <Badge variant="lightPruple" className='rounded-full py-2'><MdOutlineStarOutline size={13} color="white" /></Badge>
              <h3 className="text-white text-md font-light">Total Review</h3>
            </div>
            <p className="ms-10 text-white font-cold">{myCourses.IoPeople || 0}/{myCourses.totalStudents || 0}</p>
          </div>

          <div className="bg-[#d6bdfe] gap-2 rounded-md w-full p-2 shadow-lg shadow-gray-500/50">
            <div className="flex gap-2 items-center">
              <Badge variant="lightPruple" className='rounded-full py-2'><IoPeople size={13} color="white" /></Badge>
              <h3 className="text-white text-md font-light">Total Student</h3>
            </div>
            <p className="ms-10 text-white font-cold">{myCourses.totalStudents || 0}+</p>
          </div>
        </div>

        <Button variant="white" className='w-full rounded-md'>
          View Full Public Profile
        </Button>



      </div>

      <div className="col-span-1 gap-4 bg-[#F1F3FF] px-2 py-5 rounded-md">
        <div className="flex gap-3 items-center pb-3 ">
          <Badge className='py-4 rounded-md' variant="payment">
            <PiBank size={17} color="#25005A" />
          </Badge>
          <h1 className="font-bold text-md">Payouts</h1>
        </div>

        <div className="flex flex-col min-w-full gap-5 items-center">
          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>Course Enrollments</Label>
            <Switch />
          </div>

          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>Student Comments</Label>
            <Switch />
          </div>

          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>System Updates</Label>
            <Switch />
          </div>

        </div>


      </div>

      <div className="col-span-1 gap-4 bg-[#F1F3FF] px-2 py-5 rounded-md">
        <div className="flex gap-3 items-center pb-3 ">
          <Badge className='py-4 rounded-md' variant="lightPruple">
            <MdOutlineNotificationsActive size={17} color="#25005A" />
          </Badge>
          <h1 className="font-bold text-md">Notifications</h1>
        </div>

        <div className="flex flex-col min-w-full gap-5 items-center">
          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>Course Enrollments</Label>
            <Switch />
          </div>

          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>Student Comments</Label>
            <Switch />
          </div>

          <div className="flex justify-between items-center w-full">
            <Label className='text-[#464555]'>System Updates</Label>
            <Switch />
          </div>

        </div>


      </div>

      <div className="col-span-1 flex flex-col gap-5">
        <div className="flex flex-col gap-3 px-2 py-5 rounded-md bg-[#F1F3FF]">

          <div className="flex gap-3 items-center ">
            <Badge className='py-4 rounded-md' variant="lightPruple">
              <BiShieldQuarter size={17} color="#0F0069" />
            </Badge>
            <h1 className="font-bold text-md"> Security</h1>
          </div>

          <form onSubmit={passwordFormik.handleSubmit} className="bg-white flex justify-between py-4 px-2 rounded-md">

            <Dialog>
              <DialogTrigger asChilds className='flex'>
                <Badge variant="destructive" className='py-3 rounded-sm'>
                  <MdKey />
                </Badge>
                <h3 className="text-sm px-2"> Password</h3>
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




      </div>

      <div className="col-span-3 border-t pt-5 flex justify-between items-center">
        <div>
          <p className="font-thin text-sm">
            Teacher ID: {data ? data._id : 'Loading...'}
          </p>
        </div>
        <div>
          <Button type="submit" className="w-full bg-gradient-to-r from-[#3525CD]  to-[#712AE2]  sm:w-auto px-15 text-center">
            Save All Changes
          </Button>
        </div>

      </div>


    </form >
  );
};

export default TeacherProfilePage;
