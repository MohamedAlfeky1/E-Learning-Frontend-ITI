import React from "react";

export const StatCard = ({ icon, badge, badgeColor, label, children }) => (
  <div className="bg-white rounded-[24px] p-6 flex flex-col gap-1 shadow-[0_20px_40px_-12px_rgba(20,27,43,0.04)]">
    <div className="flex items-center justify-between mb-3">
      {icon}
      <span
        className="text-xs font-semibold leading-4 px-2 py-1 rounded-full"
        style={{ color: badgeColor }}
      >
        {badge}
      </span>
    </div>
    <p className="text-slate-600 text-[11px] font-semibold uppercase tracking-[1.2px] mb-0">
      {label}
    </p>
    <div className="text-slate-950 text-3xl font-extrabold mt-1">
      {children}
    </div>
  </div>
);
