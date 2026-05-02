// src/components/admin/AdminMergedChart.jsx

const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminMergedChart = (studentsData = [], coursesData = []) => {
  // Seed all 12 months with zero values so every month shows on the X-axis
  const map = {};
  monthOrder.forEach((month) => {
    map[month] = { month, students: 0, courses: 0 };
  });

  (Array.isArray(studentsData) ? studentsData : []).forEach(({ month, value }) => {
    if (!month || !map[month]) return;
    map[month].students = value ?? 0;
  });

  (Array.isArray(coursesData) ? coursesData : []).forEach(({ month, value }) => {
    if (!month || !map[month]) return;
    map[month].courses = value ?? 0;
  });

  // Return in calendar order — all 12 months always present
  return monthOrder.map((month) => map[month]);
};

export default AdminMergedChart;