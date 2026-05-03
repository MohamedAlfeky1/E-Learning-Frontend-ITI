import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTeachersQuery, useStudentsQuery } from "@/queries/authQueries";
import { useGetAllCourses } from "@/queries/useCourses";
import Logo from "../../assets/logo.jpeg";

const imgStudentsCollaborating =
  "https://placehold.co/600x600/e9edff/3525cd.png?text=Students+Collaborating";
const imgDrSarahJenkins =
  "https://placehold.co/400x500/e9edff/3525cd.png?text=Dr.+Sarah+Jenkins";
const imgMarcusThorne =
  "https://placehold.co/400x500/e9edff/3525cd.png?text=Marcus+Thorne";
const imgElenaRodriguez =
  "https://placehold.co/400x500/e9edff/3525cd.png?text=Elena+Rodriguez";
const imgDrJulianVane =
  "https://placehold.co/400x500/e9edff/3525cd.png?text=Dr.+Julian+Vane";
const imgStudentAvatar =
  "https://placehold.co/100x100/e9edff/3525cd.png?text=Avatar";

export default function AboutPage() {
  const navigate = useNavigate();
  const { data: teachers } = useTeachersQuery();
  const { data: students } = useStudentsQuery();
  const { data: coursesData } = useGetAllCourses();

  const coursesCount = coursesData?.data?.length || 0;
  const teachersCount = teachers?.length || 0;
  const activeStudents = students?.length || 0;

  const teachersList = teachers || [
    {
      avatar: imgDrSarahJenkins,
      firstName: "Dr. Sarah",
      lastName: "Jenkins",
    },
    {
      avatar: imgMarcusThorne,
      firstName: "Marcus",
      lastName: "Thorne",
    },
    {
      avatar: imgElenaRodriguez,
      firstName: "Elena",
      lastName: "Rodriguez",
    },
    {
      avatar: imgDrJulianVane,
      firstName: "Dr. Julian",
      lastName: "Vane",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden font-sans text-slate-800">
      {/* Hero Section */}
      <section className="relative w-full max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-20 lg:py-32 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start gap-6 w-full">
          <p className="text-primary font-bold text-sm tracking-widest uppercase">
            Our Journey
          </p>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Redefining the{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-purple-600">
              Digital Campus
            </span>{" "}
            experience.
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
            We believe that every student deserves a learning environment as
            dynamic and interconnected as the world they live in. Nexora bridges
            the gap between traditional excellence and modern innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a href="#mission-section">
              <Button
                size="lg"
                className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90 rounded-full text-base px-8"
              >
                Explore Our Mission
              </Button>
            </a>
          </div>
        </div>

        <div className="relative w-full max-w-lg mx-auto lg:mx-0">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
          <img
            src={Logo}
            alt="Students collaborating"
            className="relative z-10 w-full h-auto rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </div>
      </section>

      {/* Mission & Vision Bento Grid */}
      <section
        id="mission-section"
        className="w-full bg-slate-50 py-20 lg:py-32"
      >
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 flex flex-col items-center gap-16">
          <div className="text-center max-w-2xl flex flex-col gap-4">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
              Core Principles
            </h2>
            <p className="text-lg text-slate-600">
              Our roadmap is guided by a commitment to student success,
              accessibility, and the relentless pursuit of pedagogical
              innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="md:col-span-3 bg-white rounded-3xl p-10 lg:p-12 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Our Mission
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  To empower high school students with the digital tools and
                  community support they need to transform curiosity into
                  mastery. We're not just building a platform; we're cultivating
                  a lifelong love for learning through immersive, data-driven
                  experiences.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Empowerment", "Innovation", "Community"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-primary/5 text-primary text-sm font-semibold rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-primary mb-2">
                {teachersCount}
              </span>
              <span className="text-sm font-semibold text-slate-600 tracking-wider uppercase">
                Expert Teachers
              </span>
            </div>
            <div className="bg-indigo-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-purple-600 mb-2">
                {activeStudents > 1000
                  ? `${(activeStudents / 1000).toFixed(1)}k+`
                  : activeStudents}
              </span>
              <span className="text-sm font-semibold text-slate-600 tracking-wider uppercase">
                Active Learners
              </span>
            </div>
            <div className="bg-indigo-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-green-600 mb-2">
                {coursesCount}
              </span>
              <span className="text-sm font-semibold text-slate-600 tracking-wider uppercase">
                Online Courses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Showcase */}
      <section className="w-full max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-20 lg:py-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              Led by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-600">
                professional
              </span>{" "}
              educators.
            </h2>
            <p className="text-lg text-slate-600">
              Our curriculum is designed and delivered by industry experts.
            </p>
          </div>
          <Button
            variant="secondary"
            className="bg-indigo-50 text-primary hover:bg-indigo-100 rounded-full"
            onClick={() => navigate("/register?role=teacher")}
          >
            Join our faculty
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachersList.slice(0, 4).map((teacher, idx) => (
            <div key={teacher._id || idx} className="flex flex-col gap-4 group">
              <div className="overflow-hidden rounded-3xl bg-slate-100 aspect-[4/5]">
                <img
                  src={teacher.avatar || imgStudentAvatar}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">
                  {teacher.firstName} {teacher.lastName}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-[1500px] mx-auto px-3 sm:px-4 lg:px-6 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-indigo-100 max-w-xl">
              Join thousands of students who are already experiencing the next
              generation of online learning. Enroll today and unlock your full
              potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-slate-100 rounded-full text-base px-8 h-14"
                onClick={() => navigate("/register")}
              >
                Start Learning Now
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
