import Categories from "@/components/homepage/categories";
import Hero from "../../components/homepage/hero";

const HomePage = () => {
  return (
    <main className="p-[24px] flex flex-col gap-20" style={{ backgroundColor: "#F9F9FF" }}>
      <Hero />
      <Categories />
    </main>
  );
};

export default HomePage;
