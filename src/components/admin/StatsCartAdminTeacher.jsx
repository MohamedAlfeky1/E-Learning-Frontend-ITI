import { Card, CardContent } from "@/components/ui/card";

const StatCardAdminTeacher = ({ title, value, icon }) => (
  <Card className="rounded-3xl border-none shadow-sm bg-background/50">
    <CardContent className="p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-black">{value}</h2>
      </div>
      <div className="p-3 bg-card rounded-2xl shadow-inner text-muted-foreground">
        {icon}
      </div>
    </CardContent>
  </Card>
);
export default StatCardAdminTeacher;