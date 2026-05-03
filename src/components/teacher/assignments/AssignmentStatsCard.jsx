import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AssignmentStatsCard = ({ title, count, icon: Icon, iconColor, className }) => {
  return (
    <Card className={cn("p-6 flex flex-col justify-between h-40", className)}>
      <div className={cn("size-10 rounded-xl flex items-center justify-center bg-gray-50/50 mb-auto", iconColor)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-1">{count}</h3>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      </div>
    </Card>
  );
};

export default AssignmentStatsCard;
