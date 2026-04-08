import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../../assets/homepage/hero/hero-image.png";
import "./style.css";

const Hero = () => {
  return (
    <section
      className="p-[64px] flex rounded-[40px]"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="flex flex-col justify-between">
        <Badge className="hero-welcome-badge">
          WELCOME TO THE DIGITAL CAMPUS
        </Badge>
        <h2 className="hero-heading">
          Elevate Your{" "}
          <span style={{ color: "#3525CD", fontStyle: "italic" }}>
            Potential.
          </span>
        </h2>
        <p className="hero-description">
          A modern digital environment designed for high school excellence.
          Experience prestigious curricula with cutting-edge visual clarity.
        </p>
        <div className="btns flex gap-[16px]">
          <Button className="hero-btn explore-btn">Explore Catalog</Button>
          <Button
            className="hero-btn demo-btn hover:bg-red-500"
            style={{
            }}
          >
            Watch Demo
            <img src={PlayIcon} style={{ width: "20px", height: "20px" }} />
          </Button>
        </div>
      </div>
      <img src={HeroImage} className="w-150 rounded-xl" />
    </section>
  );
};

export default Hero;
