import { Button } from "../../components/ui/button";
import Loader from "@/components/ui/loader";
import { useGetUser } from "@/queries/useUserQueries";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useGetAllTeacherCourses } from "@/queries/useCourses";
import { IoFileTrayFullSharp } from "react-icons/io5";

const TeacherPublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetUser(id);
  const { data: teacherCourses } = useGetAllTeacherCourses();

  const userData = data?.data;
  const publishedCourses = teacherCourses?.data.filter(
    (course) => course.status === "published"
  );

  console.log("userData", userData);

  if (isLoading)
    return (
      <div className="col-span-4 flex justify-center items-center min-h-40">
        <Loader />
      </div>
    );

  return (
    <div className="relative p-6 flex flex-col gap-6">
      {/* Back button */}
      <Button
        variant="link"
        className="absolute top-4 left-4 flex items-center gap-1 text-[var(--primary)] hover:cursor-pointer hover:underline group w-fit"
        onClick={() => navigate(-1)}
      >
        <MdArrowBack
          size={13}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span className="text-sm">Back</span>
      </Button>

      {/* Profile card */}
      <div className="flex flex-col md:flex-row gap-8 py-8 px-10 mt-8 items-center rounded-xl border border-[var(--border)] bg-white shadow-sm">

        {/* Avatar with ring */}
        <div className="relative flex-shrink-0">
          <div className="rounded-full p-[3px] border-2 border-[var(--primary)]">
            {userData.avatar ? (
              <img
                className="w-24 h-24 rounded-full object-cover block"
                src={
                  typeof userData.avatar === "string"
                    ? userData.avatar
                    : URL.createObjectURL(userData.avatar)
                }
                alt={userData.firstName}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--primary)] font-medium text-lg">
                {`${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`}
              </div>
            )}
          </div>
          <span className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full bg-[var(--primary)] border-2 border-white" />
        </div>

        {/* Info */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center w-full">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)] capitalize">
              {userData.role}
            </span>
            <h1 className="font-extrabold text-2xl text-[var(--foreground)]">
              Dr. {userData.firstName} {userData.lastName}
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm font-normal max-w-md leading-relaxed">
              {userData.bio}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Email:{" "}
              <span className="text-[var(--primary)] underline">
                {userData.email}
              </span>
            </p>
            {(userData?.role === 'student') ? (<Button
              onClick={() => navigate(`teachers/${id}/book`)}
              className="w-64 mt-1"
            >
              Book 1:1 Appointment
            </Button>) : ''
            }

          </div>

          {/* Stat chips */}
          <div className="flex items-center justify-center gap-3">
            <div className="bg-[var(--secondary)] border border-[var(--border)] px-4 py-3 rounded-xl text-center min-w-[100px]">
              <p className="text-xs text-[var(--primary)] mb-1">Phone</p>
              <p className="font-medium text-sm text-[var(--foreground)]">
                {userData?.phone}
              </p>
            </div>
            <div className="bg-[var(--secondary)] border border-[var(--border)] px-4 py-3 rounded-xl text-center min-w-[100px]">
              <p className="text-xs text-[var(--primary)] mb-1">Joined</p>
              <p className="font-medium text-sm text-[var(--foreground)]">
                {new Date(userData?.createdAt).toLocaleDateString("en-US")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses section */}
      {/* Courses section */}
      <div className="flex flex-col gap-6 py-6 px-10 rounded-xl border border-[var(--border)] bg-white shadow-sm">
        <h2 className="font-medium text-[var(--primary)] flex items-center gap-2 text-lg">
          Published Courses
          <span className="text-xs bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)] rounded-full px-2.5 py-0.5">
            {publishedCourses?.length ?? 0}
          </span>
        </h2>

        {publishedCourses?.length === 0 || !publishedCourses ? (
          // ✅ Empty state box
          <div className="flex flex-col items-center justify-center gap-3 py-12 rounded-xl border border-dashed border-[var(--border)] bg-[var(--secondary)]">
            <div className="w-14 h-14 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-2xl">
              <IoFileTrayFullSharp className="text-[var(--primary)]/20"/>

            </div>
            <p className="font-medium text-[var(--foreground)] text-sm">No Published Courses Yet</p>
            <p className="text-xs text-[var(--muted-foreground)] text-center max-w-xs">
              This teacher hasn't published any courses yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedCourses.map((item) => (
              <div
                key={item._id}
                className="relative group border border-[var(--border)] rounded-2xl overflow-hidden transition-colors duration-200 cursor-pointer"
              >
                <div className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-2xl" />
                <div className="h-36 sm:h-40 w-full bg-[var(--secondary)]">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[var(--muted-foreground)] text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-4 space-y-2">
                  <h4 className="font-medium text-base md:text-[15px] text-[var(--foreground)]">
                    {item.title}
                  </h4>
                  <p className="text-xs md:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {item.description?.slice(0, 90)}...
                  </p>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[var(--secondary)] text-[var(--primary)] border border-[var(--border)]">
                      {item.level || "Beginner"}
                    </span>
                    <span className={`text-sm font-semibold ${item.price === 0 ? "text-green-600" : "text-[var(--primary)]"}`}>
                      {item.price === 0 ? "Free" : `$${item.price}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPublicProfilePage;