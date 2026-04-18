import { useState, useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

// Add this helper outside the component
const generateWeeklyData = (total, days) => {
  const labels = {
    7:  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    14: ["W1 Mon","W1 Wed","W1 Fri","W1 Sun","W2 Mon","W2 Wed","W2 Fri","W2 Sun"],
    30: ["W1","W2","W3","W4"],
  };

  const weights = {
    7:  [0.10, 0.12, 0.18, 0.15, 0.20, 0.14, 0.11],
    14: [0.08, 0.10, 0.14, 0.09, 0.12, 0.16, 0.18, 0.13],
    30: [0.22, 0.28, 0.25, 0.25],
  };

  return labels[days].map((label, i) => ({
    day: label,
    amount: Math.round(total * weights[days][i]),
  }));
};

export default generateWeeklyData 