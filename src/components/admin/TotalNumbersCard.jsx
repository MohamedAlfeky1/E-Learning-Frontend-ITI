import React from 'react'
import { ChartContainer } from "@/components/ui/chart"
import { BarChart, Bar, Cell } from "recharts"
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";

const chartConfig = {
    value: { color: "#7C3AED" }
}
function TotalNumbersCard({ icon, title, number, chartData=[] , growth  }) {

    const coloredData = chartData.map((item, index) => ({
        ...item,
        fill: index === chartData.length - 1 ? "#7C3AED" : "#DDD6FE"
    }))
    return (
        <div className="bg-white rounded-xl p-4 flex flex-col justify-center gap-3">

            <div className="flex justify-between items-start">
                <div className="w-10 flex justify-center bg-[var(--ring)]/30 p-2 rounded-md text-[var(--primary)]">
                    {icon}
                </div>
                {growth !== undefined && (
                    <span className={`text-xs font-semibold ${growth >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                        {growth >= 0 ? <FaArrowTrendUp/> : <FaArrowTrendDown/>} {Math.abs(growth)}%
                    </span>
                )}
            </div>

            <h3 className="text-[var(--chart-3)] text-sm">{title}</h3>
            <h3 className="text-2xl font-extrabold">{number}</h3>


            {coloredData.length > 0 && (
                <ChartContainer config={chartConfig} className="h-[60px] w-full">
                    <BarChart data={coloredData} barSize={28} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {coloredData.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            )}


        </div>
    )
}

export default TotalNumbersCard
