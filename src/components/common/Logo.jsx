import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 group ${className}`}>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Nexora
      </span>
    </Link>
  );
};

export default Logo;
