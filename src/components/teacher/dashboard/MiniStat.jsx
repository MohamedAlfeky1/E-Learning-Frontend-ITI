import React from "react";

const MiniStat = ({ icon: Icon, label, value, color = "text-indigo-600" }) => (
  <div className="bg-slate-50 rounded-2xl p-4 flex flex-col gap-2">
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm ${color}`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-[0.8px]">
      {label}
    </p>
    <p className="text-slate-900 text-xl font-extrabold leading-none">
      {value}
    </p>
  </div>
);

export default MiniStat;
