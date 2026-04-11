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
        "p-4 rounded-2xl cursor-pointer transition-all border w-full shrink-0", 
        isActive 
          ? "bg-white border-primary shadow-lg ring-1 ring-primary/5 scale-[1.01]" 
          : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3 className={cn("font-bold text-sm truncate", isActive ? "text-primary" : "text-slate-800")}>
            {ticket.subject}
          </h3>
          <div className="flex items-center">
             <TicketCategoryBadge category={ticket.category} />
          </div>
        </div>
        
        <Badge className={cn("text-[9px] px-2 py-0 h-5 shadow-none capitalize shrink-0 font-bold", getStatusColor(ticket.status))}>
          {ticket.status}
        </Badge>
      </div>

      <p className="text-xs text-slate-400 line-clamp-1 mb-3">
        {ticket.message || "No content provided"}
      </p>

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium border-t pt-2">
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        {isActive && <span className="text-primary font-bold uppercase tracking-tighter">Active View</span>}
      </div>
    </div>
  );
};

export default TicketItem;