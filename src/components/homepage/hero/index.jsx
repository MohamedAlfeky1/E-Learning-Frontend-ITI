import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../../assets/homepage/hero/hero-image.png";
import "./style.css";

const Hero = () => {
  return (
    <section
      className="mt-6 mx-6 p-8 flex flex-col rounded-[40px] gap-12 sm:p-[64px] xl:flex-row"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="flex flex-col gap-8 xl:justify-between">
        <Badge className="hero-welcome-badge">
          WELCOME TO THE DIGITAL CAMPUS
        </Badge>
        <h2 className="hero-heading text-4xl sm:text-7xl">
          Elevate Your{" "}
          <span style={{ color: "#3525CD", fontStyle: "italic" }}>
            Potential.
          </span>
        </h2>
        <p className="hero-description">
          A modern digital environment designed for high school excellence.
          Experience prestigious curricula with cutting-edge visual clarity.
        </p>
        <div className="btns flex flex-col gap-[16px] sm:flex-row">
          <Button className="hero-btn explore-btn text-[14px] sm:text-[18px]">Explore Catalog</Button>
          <Button
            className="hero-btn demo-btn text-[14px] sm:text-[18px] hover:bg-red-500"
          >
            Watch Demo
            <img src={PlayIcon} style={{ width: "20px", height: "20px" }} />
          </Button>
        </div>
      </div>
      <img src={HeroImage} className="rounded-xl flex-1" />
    </section>
  );
};

export default Hero;
