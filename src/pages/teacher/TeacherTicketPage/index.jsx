import { useState } from "react";
import TicketList from "@/components/tickets/TicketList";
import TicketChat from "@/components/tickets/TicketChat";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const TeacherTicketPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [view, setView] = useState("list"); 

  const handleSelect = (id) => {
    setSelectedTicketId(id);
    setView("chat");
  };

  const handleBack = () => {
    setView("list");
  };

  return (
    <div className="p-0 md:p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-0 md:gap-6 h-full">
        <Card
          className={`
            w-full md:w-[350px] lg:w-[400px] xl:w-[450px] 
            flex flex-col shadow-none md:shadow-sm border-none md:border-slate-200 
            h-full min-h-0 overflow-hidden bg-white
            ${view === "list" ? "flex" : "hidden md:flex"}
          `}
        >
          <TicketList
            selectedId={selectedTicketId}
            onSelect={handleSelect}
          />
        </Card>
        <Card
          className={`
            flex-1 shadow-none md:shadow-sm border-none md:border-slate-200 relative flex flex-col 
            h-full min-h-0 overflow-hidden bg-white
            ${view === "chat" ? "flex" : "hidden md:flex"}
          `}
        >
          {selectedTicketId ? (
            <div className="flex flex-col h-full">
              <div className="md:hidden p-4 border-b bg-white flex items-center shrink-0">
                <button
                  onClick={handleBack}
                  className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} className="text-primary" />
                </button>
                <span className="font-bold ml-2">Back to Tickets</span>
              </div>

              <div className="flex-1 min-h-0 animate-in slide-in-from-right-5 duration-300">
                <TicketChat ticketId={selectedTicketId} />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50/50">
              <div className="p-4 bg-white rounded-full shadow-sm mb-4 animate-bounce duration-[3000ms]">
                <img src={logo} className="w-20 h-20 rounded-full object-contain" alt="Nexora" />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Nexora Support</h3>
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

export default TeacherTicketPage;