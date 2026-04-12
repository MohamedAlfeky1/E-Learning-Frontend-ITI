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
import { Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { toast } from "sonner";

const AdminTicketsPage = () => {
  const [selectedId, setSelectedId] = useState(null);
  const updateStatus = useUpdateTicketStatusMutation();
  const deleteTicket = useDeleteTicketMutation();

  const handleStatusChange = (status) => {
    updateStatus.mutate({ id: selectedId, status });
  };

  const handleDelete = () => {
    toast("Are you sure you want to delete this ticket?", {
      description: "This action cannot be undone.",

      action: {
        label: "Yes, Delete",
        onClick: () => {
          deleteTicket.mutate(selectedId, {
            onSuccess: () => setSelectedId(null),
          });
        },
      },

      cancel: {
        label: "Cancel",
      },

      className: "border-red-100",
    });
  };

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto h-[calc(100vh-80px)]">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full min-h-0 overflow-hidden">
        <Card
          className={`
            w-full md:w-[400px] flex flex-col h-full min-h-0 bg-white rounded-3xl overflow-hidden border border-slate-200
            ${selectedId ? "hidden md:flex" : "flex"}
          `}
        >
          <AdminTicketList selectedId={selectedId} onSelect={setSelectedId} />
        </Card>

        <Card
          className={`
            flex-1 relative flex flex-col h-full min-h-0 bg-white rounded-3xl overflow-hidden border border-slate-200
            ${!selectedId ? "hidden md:flex" : "flex"}
          `}
        >
          {selectedId ? (
            <>
              <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setSelectedId(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50 rounded-xl font-bold transition-all active:scale-95"
                    onClick={() => handleStatusChange("resolved")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Resolved</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl font-bold transition-all active:scale-95"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <TicketChat ticketId={selectedId} isAdmin={true} />
              </div>
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
                Select a ticket to start assisting students and teachers, and
                resolve their inquiries.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminTicketsPage;
