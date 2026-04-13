import { Link } from "react-router-dom";
import { FiStar } from "react-icons/fi";
import cubesBg from "@/assets/cubes.png";

const AuthSideBar = () => {
  return (
    <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground p-16 flex-col justify-between relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: `url(${cubesBg})` }}
      ></div>

      <div className="relative z-10">
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter mb-10 block"
        >
          NEXORA.
        </Link>

        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Welcome back to your
          <br /> digital campus.
        </h1>

        <p className="text-primary-foreground/80 text-lg">
          Access your personalized learning path and stay connected.
        </p>
      </div>

      <div className="relative z-10 bg-primary-foreground/10 backdrop-blur-md p-6 rounded-2xl border border-primary-foreground/20">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground text-primary p-3 rounded-full shadow-lg">
            <FiStar />
          </div>

          <div>
            <p className="font-bold uppercase tracking-wider text-xs opacity-70">
              Platform Update
            </p>
            <p className="font-medium text-sm">
              AI-Powered insights are now live!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSideBar;