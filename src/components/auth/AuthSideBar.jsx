import { Link, useLocation } from "react-router-dom";
import { FiBookOpen, FiZap, FiVideo, FiTarget } from "react-icons/fi";
import cubesBg from "@/assets/cubes.png";

const AuthSideBar = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const content = isLogin 
    ? {
        title: "Ready to level up your skills?",
        desc: "Welcome back! Your courses and live sessions are waiting for you. Let's finish what we started.",
        badge: "Next Live Session",
        badgeText: "Join the discussion right now!",
        icon: <FiZap className="animate-pulse" />
      }
    : {
        title: "The future of learning is in your hands.",
        desc: "Join Nexora today. Learn from top tutors through interactive live sessions and recorded courses.",
        badge: "Live Learning",
        badgeText: "Real-time interaction with expert tutors!",
        icon: <FiVideo />
      };

  return (
    <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground p-16 flex-col justify-between relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${cubesBg})` }}
      ></div>

      <div className="relative z-10">
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter mb-10 block hover:opacity-80 transition-opacity"
        >
          NEXORA.
        </Link>

        {/* Dynamic Content */}
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          {content.title.split('your').map((text, index, array) => (
            <span key={index}>
              {text}
              {index < array.length - 1 && <><br /> your</>}
            </span>
          ))}
        </h1>

        <p className="text-primary-foreground/80 text-lg max-w-md leading-relaxed font-medium">
          {content.desc}
        </p>
      </div>

      {/* Badge Section - Focus on Live Interaction */}
      <div className="relative z-10 bg-primary-foreground/10 backdrop-blur-md p-6 rounded-2xl border border-primary-foreground/20 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground text-primary p-3 rounded-full shadow-lg text-xl">
            {content.icon}
          </div>

          <div>
            <p className="font-bold uppercase tracking-wider text-[10px] opacity-70">
              {content.badge}
            </p>
            <p className="font-semibold text-sm">
              {content.badgeText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSideBar;