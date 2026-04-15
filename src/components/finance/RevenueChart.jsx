const RevenueChart = ({ teacherShare }) => {
  return (
    <div className="flex justify-center">
      <div className="relative w-44 h-44 md:w-60 md:h-60">
        <div
          className="w-full h-full rounded-full flex items-center justify-center transition-all duration-500"
          style={{
            background: `conic-gradient(var(--color-primary) ${teacherShare}%, var(--color-muted) ${teacherShare}%)`,
          }}
        >
          <div className="w-[80%] h-[80%] bg-background rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Teacher
            </span>
            <span className="text-3xl font-black text-primary">
              {teacherShare}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;