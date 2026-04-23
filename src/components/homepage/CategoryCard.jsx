// import Sigma from "../../../assets/homepage/categories/sigma.svg";

const CategoryCard = ({ category }) => {
  return (
    <div className="min-w-[280px] sm:w-[320px] p-8 rounded-2xl bg-[#F1F3FF] flex flex-col justify-between gap-4 hover:scale-[1.01] transition-transform duration-150 cursor-pointer">
      <div className="w-[56px] h-[56px] bg-white flex justify-center items-center rounded-lg">
        {/* <img src={Sigma} /> */}
        {category.icon}
      </div>
      <h3 className="text-[#141B2B] font-extrabold text-lg leading-7">{category.name}</h3>
      <p className="text-[#3525CD] font-bold text-xs leading-4 uppercase">{category.courseCount} COURSES</p>
    </div>
  );
};

export default CategoryCard;
