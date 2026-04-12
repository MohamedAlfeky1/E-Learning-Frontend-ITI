import { useMyTicketsQuery } from "@/queries/ticketQueries";
import TicketItem from "./TicketItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateTicketModal from "./CreateTicketModal";

const TicketList = ({ selectedId, onSelect }) => {
  const { data, isLoading } = useMyTicketsQuery();
  const tickets = data?.data || [];
  console.log("Fetched Tickets:", tickets);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden"> 
      <div className="p-4 border-b space-y-4 bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-primary tracking-tight">Tickets</h2>
          <CreateTicketModal />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 bg-slate-50/40">
        <div className="flex flex-col gap-3 p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-slate-200/50 animate-pulse rounded-2xl w-full" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm text-slate-400 font-medium">No tickets found.</p>
            </div>
          ) : (
            <>
              {tickets.map((ticket) => (
                <TicketItem
                  key={ticket._id}
                  ticket={ticket}
                  isActive={selectedId === ticket._id}
                  onClick={() => onSelect(ticket._id)}
                />
              ))}
              <div className="h-4 shrink-0" />
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TicketList;