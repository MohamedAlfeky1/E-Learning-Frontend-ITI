import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TicketCategoryBadge from "./TicketCategoryBadge";

const TicketItem = ({ ticket, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 sm:p-4 rounded-2xl cursor-pointer border transition-all w-full shrink-0",
        isActive
          ? "bg-white border-primary shadow-md ring-1 ring-primary/5 scale-[1.01]"
          : "bg-transparent border-transparent hover:bg-white hover:border-slate-200"
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h3 className={cn(
          "font-bold text-sm truncate flex-1", 
          isActive ? "text-primary" : "text-slate-800"
        )}>
          {ticket.subject}
        </h3>

        <Badge className={cn(
          "text-[9px] px-2 py-0 h-5 shadow-none capitalize shrink-0 font-bold",
          ticket.status === 'open' ? "bg-sidebar-primary" : "bg-slate-400"
        )}>
          {ticket.status}
        </Badge>
      </div>
      <div className="flex items-center">
        <TicketCategoryBadge category={ticket.category} />
      </div>

      <p className="text-xs text-slate-400 mt-2 line-clamp-1 mb-3">
        {ticket.message || "No content provided"}
      </p>

      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium border-t pt-2 mt-auto">
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
        {isActive && <span className="text-primary font-bold uppercase tracking-tighter">Active View</span>}
      </div>
    </div>
  );
};

export default TicketItem;