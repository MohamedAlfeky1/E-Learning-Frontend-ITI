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
      
      {/* Header */}
      <div className="p-3 md:p-5 border-b shrink-0 flex justify-between items-center bg-white z-10">
        <div>
          <h2 className="text-base md:text-xl font-bold text-slate-900">
            Support Tickets
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 mt-1">
            Manage and respond to inquiries
          </p>
        </div>

        <Badge variant="outline" className="bg-slate-50 text-[10px] md:text-xs font-medium">
          {tickets.length} Total
        </Badge>
      </div>

      {/* Scroll Area */}
      <ScrollArea className="flex-1 min-h-0 bg-slate-50/40">
        <div className="p-3 md:p-5 flex flex-col gap-3 md:gap-4">
          
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
                  .toUpperCase();

                return (
                  <div
                    key={ticket._id}
                    onClick={() => onSelect(ticket._id)}
                    className={cn(
                      "group relative p-3 md:p-4 rounded-2xl cursor-pointer transition-all duration-200 border w-full shrink-0",
                      isSelected
                        ? "border-primary bg-white shadow-md scale-[1.01]"
                        : "border-transparent bg-white shadow-sm hover:border-slate-200"
                    )}
                  >
                    {/* status bar */}
                    <div
                      className={cn(
                        "absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 md:h-10 rounded-full transition-colors",
                        ticket.status === "open"
                          ? "bg-orange-500"
                          : "bg-slate-300",
                        isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      )}
                    />

                    <div className="flex gap-2 md:gap-3">
                      
                      {/* avatar */}
                      <div
                        className={cn(
                          "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0",
                          ticket.userRole === "teacher"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-indigo-100 text-indigo-600"
                        )}
                      >
                        {initials}
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        
                        <h3
                          className={cn(
                            "font-bold text-xs md:text-sm truncate mb-1",
                            isSelected
                              ? "text-primary"
                              : "text-slate-800"
                          )}
                        >
                          {ticket.subject}
                        </h3>

                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-2">
                          <span className="text-[10px] md:text-xs font-semibold text-slate-600 truncate">
                            {senderName}
                          </span>

                          <span
                            className={cn(
                              "text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border",
                              ticket.userRole === "teacher"
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-orange-50 text-orange-600 border-orange-100"
                            )}
                          >
                            {ticket.userRole}
                          </span>
                        </div>

                        <div className="flex justify-between items-center border-t pt-2 mt-1">
                          
                          <div className="flex items-center text-[9px] md:text-[10px] text-slate-400 font-medium">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(ticket.createdAt).toLocaleDateString(
                              undefined,
                              { day: "numeric", month: "short" }
                            )}
                          </div>

                          <Badge
                            className={cn(
                              "text-[9px] md:text-[10px] h-5 px-1.5 md:px-2 font-bold uppercase shadow-none",
                              ticket.status === "open"
                                ? "bg-orange-500"
                                : "bg-slate-400"
                            )}
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="h-3 md:h-4" />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdminTicketList;