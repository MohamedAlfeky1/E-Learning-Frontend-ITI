import CourseCard from "./CourseCard";
import "./style.css";

const CartPage = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between">
        <h1 className="mb-2 text-dark text-size-3xl font-weight-800 font-plus-jakarta">
          Review Your <span style={{ color: "#712AE2" }}>Academic Path</span>
        </h1>
      </header>
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 rounded-[24px] flex flex-col gap-2 p-2 cursor-pointer">
          <CourseCard />
        </div>
        <div
          className="rounded-4xl"
          style={{ backgroundColor: "#DCE2F7" }}
        ></div>
      </section>
    </div>
  );
};

export default CartPage;
