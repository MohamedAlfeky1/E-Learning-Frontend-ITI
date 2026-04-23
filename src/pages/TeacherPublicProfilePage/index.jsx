import { Button } from "../../components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loader from "@/components/ui/loader";
import { useUserQuery } from "@/queries/authQueries";
import { useGetUser } from "@/queries/useUserQueries";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const TeacherPublicProfilePage = () => {

  const { id } = useParams();
  const navigate = useNavigate()

  const { data, isLoading, error } = useGetUser(id)
  const userData = data?.data
  console.log(userData);


  if (isLoading) return <div className="col-span-4 flex justify-center items-center min-h-40"> <Loader /> </div>;

  return (
    <div>

      <div className="relative flex flex-col md:flex-row gap-10 py-6 px-10 m-6 items-center rounded-md shadow-xl shadow-[#3525CD]/20 bg-gray-100">
        <Button variant="link" className="absolute top-0 left-0 flex items-center gap-1 text-[var(--primary)] hover:cursor-pointer hover:underline group"
          onClick={() => { navigate(-1) }}>
          <MdArrowBack size={13}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          <span className="text-sm"> Back</span>
        </Button>
        <div className="py-5">
          {userData.avatar ? (
            <div className="shadow-gray-400 shadow-lg rounded-md">

              <img className="w-64 h-70 rounded-md"
                src={typeof userData.avatar === "string" ? userData.avatar : URL.createObjectURL(userData.avatar)} alt={userData.firstName} />
            </div>
          )
            :
            (
              <span className="text-gray-400">
                {`${userData.firstName?.[0] || ""}${userData.lastName?.[0] || ""}`}
              </span>
            )
          }
        </div>


        <div className="flex flex-col gap-3">
          <Badge variant="lightPruple">{userData.role}</Badge>
          <h1 className="font-extrabold text-4xl">Dr . {userData.firstName} {userData.lastName}</h1>
          <p className="text-[var(--muted-foreground)] text-sm font-normal">{userData.bio}</p>
          <p className="text-black font-semibold">Email : <span className="text-[var(--primary)] text-sm underline">{userData.email}</span></p>
          <Button onClick={() => { navigate(`teachers/${id}/book`) }} className='w-64'>Book 1:1 Appointment</Button>

        </div>
      </div>
    </div>
  );
};

export default TeacherPublicProfilePage;
