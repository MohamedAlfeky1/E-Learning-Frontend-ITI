import { Card } from "@/components/ui/card";

const StatCard = ({ title, value, icon }) => (
  <Card className="rounded-3xl border bg-card p-5 flex items-center gap-4 hover:shadow-md transition-all">
    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
      {icon}
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  </Card>
);

export default StatCard;