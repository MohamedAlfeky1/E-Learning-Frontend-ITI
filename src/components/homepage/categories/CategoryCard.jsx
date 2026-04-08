import Sigma from "../../../assets/homepage/categories/sigma.svg";
import "./style.css";

const CategoryCard = () => {
  return (
    <div
      className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col gap-4"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
        <img src={Sigma} />
      </div>
      <h3 className="category-title">Mathematics</h3>
      <p className="category-description">
        From Algebra to Advanced Calculus and beyond.
      </p>
      <p className="category-num-courses">42 COURSES</p>
    </div>
  );
};

export default CategoryCard;
