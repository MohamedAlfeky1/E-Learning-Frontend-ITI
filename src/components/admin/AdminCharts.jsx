// src/components/admin/AdminCharts.jsx

import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area } from "recharts";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const chartConfig = {
  value: { color: "var(--primary)" }
};

const GrowthBadge = ({ value }) => {
  const isUp = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
      isUp ? "bg-[#EAF3DE] text-[#3B6D11]" : "bg-[#FCEBEB] text-[#A32D2D]"
    }`}>
      {isUp ? <FaArrowTrendUp size={10} /> : <FaArrowTrendDown size={10} />}
      {Math.abs(value)}%
    </span>
  );
};

const AdminCharts = ({ icon, title, number = 0, chartData, growth = 0 }) => {
  const safeData = Array.isArray(chartData) ? chartData : [];

  // Need at least 2 points to draw a line; pad with zeros if needed
  const chartPoints =
    safeData.length >= 2
      ? safeData
      : safeData.length === 1
      ? [{ value: 0 }, ...safeData]
      : [{ value: 0 }, { value: 0 }];

  // Safe gradient id — no spaces or special chars
  const gradId = `grad-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="bg-[var(--card)] rounded-2xl overflow-hidden flex flex-col relative">

      {/* Top accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] " />

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 pt-5">

        {/* Icon + Badge */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--primary)]/10 text-[var(--primary)]">
            {icon}
          </div>
          <GrowthBadge value={growth} />
        </div>

        {/* Number + Label */}
        <div>
          <p className="text-[28px] font-bold tracking-tight text-[var(--foreground)] leading-none">
            {Number(number).toLocaleString()}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mt-1.5">
            {title}
          </p>
        </div>
      </div>

      {/* Sparkline — flush to bottom */}
      {/* <div className="mt-auto">
        <ChartContainer config={chartConfig} className="h-[70px] w-full">
          <AreaChart
            data={chartPoints}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--primary)"
              strokeWidth={2}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div> */}

    </div>
  );
};

export default AdminCharts;