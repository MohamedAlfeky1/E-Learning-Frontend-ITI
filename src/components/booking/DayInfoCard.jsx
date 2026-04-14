export function DayInfoCard({  dayName }) {
  return (
    <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 animate-in slide-in-from-left duration-300">
      <div className="flex items-center gap-3">
        <span className="text-xl">Day:</span>
        <div>
          <p className="text-sm text-indigo-700 font-medium">
            Selected: <strong className="font-bold">{dayName}</strong>
          </p>
          <p className="text-xs text-indigo-500 mt-0.5">
            This schedule will repeat every {dayName}
          </p>
        </div>
      </div>
    </div>
  )
}