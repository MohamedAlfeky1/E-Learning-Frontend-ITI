import Categories from "@/components/homepage/categories";
import Hero from "../../components/homepage/hero";
import Courses from "@/components/homepage/courses";

const HomePage = () => {
  return (
    <main className="py-20 flex flex-col gap-20" style={{ backgroundColor: "#F9F9FF" }}>
      <Hero />
      <Categories />
      <Courses />
    </main>
  );
};

export default HomePage;
