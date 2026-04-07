import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PlayIcon from "../../../assets/homepage/hero/play-icon.svg";
import HeroImage from "../../../assets/homepage/hero/hero-image.png";

const Hero = () => {
  return (
    <section
      className="p-[64px] flex rounded-[40px]"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="flex flex-col justify-between">
        <Badge
          style={{
            padding: "6px 16px",
            backgroundColor: "#E2DFFF",
            color: "#3323CC",
            fontSize: "11px",
            fontWeight: "700",
            fontFamily: "Inter",
            letterSpacing: "1.1px",
          }}
        >
          WELCOME TO THE DIGITAL CAMPUS
        </Badge>
        <h2
          style={{
            fontSize: "72px",
            fontWeight: "800",
            fontFamily: "Plus Jakarta Sans",
            lineHeight: "72px",
          }}
        >
          Elevate Your{" "}
          <span style={{ color: "#3525CD", fontStyle: "italic" }}>
            Potential.
          </span>
        </h2>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "400",
            color: "#464555",
            fontFamily: "Inter",
          }}
        >
          A modern digital environment designed for high school excellence.
          Experience prestigious curricula with cutting-edge visual clarity.
        </p>
        <div className="btns flex gap-[16px]">
          <Button
            style={{
              padding: "16px 32px",
              background: "linear-gradient(to right, #3525CD, #712AE2)",
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "Plus Jakarta Sans",
              boxShadow: "0 8 10 -6 #3525CD33, 0 20 25 -5 #3525CD33",
            }}
          >
            Explore Catalog
          </Button>
          <Button
            className="hover:bg-red-500"
            style={{
              padding: "16px 32px",
              backgroundColor: "white",
              color: "#3525CD",
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "Plus Jakarta Sans",
            }}
          >
            Watch Demo
            <img src={PlayIcon} style={{ width: "20px", height: "20px" }} />
          </Button>
        </div>
      </div>
      <img src={HeroImage} className="w-128 rounded-xl" />
    </section>
  );
};

export default Hero;