import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Merge both datasets by month
const AdminMergedChart = (studentsData = [], coursesData = []) => {
  const map = {};

  studentsData.forEach(({ month, value }) => {
    map[month] = { month, students: value, courses: 0 };
  });

  coursesData.forEach(({ month, value }) => {
    if (map[month]) {
      map[month].courses = value;
    } else {
      map[month] = { month, students: 0, courses: value };
    }
  });

  return Object.values(map).sort((a, b) =>
    new Date(`${a.month} 1, 2026`) - new Date(`${b.month} 1, 2026`)
  );
};

export default AdminMergedChart;