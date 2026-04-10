import { useMyTicketsQuery } from "@/queries/ticketQueries";
import TicketItem from "./TicketItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateTicketModal from "./CreateTicketModal";

const TicketList = ({ selectedId, onSelect }) => {
  const { data, isLoading } = useMyTicketsQuery();
  const tickets = data?.data || [];

  return (
    <>
      <div className="p-4 border-b space-y-4 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-primary">Tickets</h2>
          <CreateTicketModal />
        </div>
      </div>

      <ScrollArea className="flex-1 p-2 bg-slate-50/30">
        {isLoading ? (
          <div className="space-y-3 p-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className=" flex flex-col gap-3 pb-32">
            {tickets.map((ticket) => (
              <TicketItem
                key={ticket._id}
                ticket={ticket}
                isActive={selectedId === ticket._id}
                onClick={() => onSelect(ticket._id)}
              />
            ))}
          </div>
          
        )}
      </ScrollArea>
    </>
  );
};

export default TicketList;

