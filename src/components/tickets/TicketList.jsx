import { useMyTicketsQuery } from "@/queries/ticketQueries";
import TicketItem from "./TicketItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateTicketModal from "./CreateTicketModal";

const TicketList = ({ selectedId, onSelect }) => {
  const { data, isLoading } = useMyTicketsQuery();
  const tickets = data?.data || [];

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">

      {/* HEADER */}
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">
            Tickets
          </h2>
          <CreateTicketModal />
        </div>
      </div>

      {/* LIST */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 flex flex-col gap-2">

          {isLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-20 bg-slate-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-sm text-slate-400 py-10">
              No tickets
            </div>
          ) : (
            tickets.map(t => (
              <TicketItem
                key={t._id}
                ticket={t}
                isActive={selectedId === t._id}
                onClick={() => onSelect(t._id)}
              />
            ))
          )}

        </div>
      </ScrollArea>

    </div>
  );
};

export default TicketList;