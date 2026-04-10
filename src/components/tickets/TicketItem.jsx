import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TicketCategoryBadge from "./TicketCategoryBadge";
const TicketItem = ({ ticket, isActive, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return "bg-blue-500/10 text-blue-600 border-blue-200";
      case 'resolved': return "bg-green-500/10 text-green-600 border-green-200";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-2xl cursor-pointer transition-all border mb-2 mx-2",
        isActive 
          ? "bg-white border-primary shadow-md translate-x-1" 
          : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className={cn("font-bold text-sm truncate flex-1", isActive ? "text-primary" : "text-slate-700")}>
          {ticket.subject}
        </h3>
        <div className="mt-1">
            <TicketCategoryBadge category={ticket.category} />
          </div>
        <Badge className={cn("text-[9px] px-2 py-0 h-4 shadow-none capitalize", getStatusColor(ticket.status))}>
          {ticket.status}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-1">{ticket.message}</p>
      <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-medium">
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TicketItem;