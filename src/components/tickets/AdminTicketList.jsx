import { useAllTicketsQuery } from "@/queries/ticketQueries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare } from "lucide-react"; 
import { cn } from "@/lib/utils";

const AdminTicketList = ({ selectedId, onSelect, filterStatus }) => {
  const { data: apiResponse, isLoading } = useAllTicketsQuery(filterStatus);
  const tickets = apiResponse?.tickets || [];

  return (
    <div className="flex flex-col h-full min-h-0 bg-white overflow-hidden">
      <div className="p-4 border-b shrink-0 flex justify-between items-center bg-white z-10">
        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-bold text-slate-900 leading-tight truncate">
            Support Tickets
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 truncate">
            Manage and respond to inquiries
          </p>
        </div>
        <Badge variant="outline" className="ml-2 bg-slate-50 text-[10px] md:text-xs font-medium shrink-0">
          {tickets.length} Total
        </Badge>
      </div>
      <ScrollArea className="flex-1 min-h-0 bg-slate-50/40">
        <div className="p-3 md:p-4 flex flex-col gap-3">
          
          {isLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 md:h-28 bg-white border border-slate-200 animate-pulse rounded-2xl"
              />
            ))
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-20 text-slate-400">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 mb-3 opacity-20" />
              <p className="text-xs md:text-sm font-medium">No tickets found</p>
            </div>
          ) : (
            <>
              {tickets.map((ticket) => {
                const isSelected = selectedId === ticket._id;
                const senderName = ticket.userId
                  ? `${ticket.userId.firstName} ${ticket.userId.lastName}`
                  : "Deleted User";

                const initials = senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={ticket._id}
                    onClick={() => onSelect(ticket._id)}
                    className={cn(
                      "group relative p-3 md:p-4 rounded-2xl cursor-pointer transition-all duration-200 border w-full shrink-0",
                      isSelected
                        ? "border-primary bg-white shadow-md scale-[1.01] z-10"
                        : "border-slate-100 bg-white shadow-sm hover:border-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 md:h-10 rounded-full transition-all",
                        ticket.status === "open" ? "bg-orange-500" : "bg-slate-300",
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                    />

                    <div className="flex gap-2 md:gap-3 items-start">
                      <div
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-black shrink-0",
                          ticket.userRole === "teacher"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-orange-100 text-orange-600"
                        )}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className={cn(
                            "font-bold text-xs md:text-sm truncate flex-1",
                            isSelected ? "text-primary" : "text-slate-800"
                          )}>
                            {ticket.subject}
                          </h3>
                          <Badge
                            className={cn(
                              "text-[8px] md:text-[9px] h-4 md:h-5 px-1.5 font-bold uppercase shadow-none shrink-0",
                              ticket.status === "open" ? "bg-orange-500" : "bg-slate-400"
                            )}
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] md:text-xs font-medium text-slate-600 truncate max-w-[120px] md:max-w-none">
                            {senderName}
                          </span>
                          <span className={cn(
                            "text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider border shrink-0",
                            ticket.userRole === "teacher"
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : "bg-orange-50 text-orange-600 border-orange-100"
                          )}>
                            {ticket.userRole}
                          </span>
                        </div>
                        <div className="flex items-center text-[9px] md:text-[10px] text-slate-400 font-medium border-t pt-2">
                          <Clock className="w-3 h-3 mr-1 shrink-0" />
                          <span className="truncate">
                            {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="h-4" />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminTicketList;