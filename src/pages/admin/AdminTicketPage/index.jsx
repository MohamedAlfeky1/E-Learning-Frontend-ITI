// pages/admin/AdminTicketsPage.jsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AdminTicketList from "@/components/tickets/AdminTicketList";
import TicketChat from "@/components/tickets/TicketChat";
import {
  useUpdateTicketStatusMutation,
  useDeleteTicketMutation,
} from "@/mutations/ticketMutations";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const AdminTicketsPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const updateStatus = useUpdateTicketStatusMutation();
  const deleteTicket = useDeleteTicketMutation();

  const handleStatusChange = (status) => {
    updateStatus.mutate({ id: selectedId, status });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      deleteTicket.mutate(selectedId, {
        onSuccess: () => setSelectedId(null),
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-100px)]">
      <div className="flex flex-col md:flex-row gap-6 h-full overflow-hidden">
        <Card className="w-full md:w-[400px] flex flex-col shadow-sm border-slate-200 h-full min-h-0 bg-white">
          <AdminTicketList selectedId={selectedId} onSelect={setSelectedId} />
        </Card>

        <Card className="flex-1 shadow-sm border-slate-200 relative flex flex-col h-full min-h-0 bg-white">
          {selectedId ? (
            <>
              <div className="p-3 border-b bg-slate-50/50 flex justify-end gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleStatusChange("resolved")}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Mark Resolved
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>

              <TicketChat ticketId={selectedId} isAdmin={true} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50/50 animate-in fade-in duration-500">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4 animate-bounce duration-[3000ms]">
                <img
                  src={logo}
                  className="w-20 h-20 rounded-full object-contain"
                  alt="Nexora"
                />
              </div>

              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Nexora Support
              </h3>

              <p className="text-muted-foreground max-w-[240px] mt-2 text-sm">
                Select a ticket from the list to start chatting with our team.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
