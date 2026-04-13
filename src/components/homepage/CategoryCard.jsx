// import Sigma from "../../../assets/homepage/categories/sigma.svg";
import "../../pages/HomePage/categories.css";

const CategoryCard = ({ category }) => {
  return (
    <div
      className="category-card w-75 p-8 rounded-2xl text-wrap flex flex-col justify-between gap-4 hover:scale-101 duration-150 cursor-pointer"
      style={{ backgroundColor: "#F1F3FF" }}
    >
      <div className="category-icon w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
        {/* <img src={Sigma} /> */}
        {category.icon}
      </div>
      <h3 className="category-title">{category.name}</h3>
      {/* <p className="category-description">
        From Algebra to Advanced Calculus and beyond.
      </p> */}
      <p className="category-num-courses">{category.courseCount} COURSES</p>
    </div>
  );
};

export default CategoryCard;
