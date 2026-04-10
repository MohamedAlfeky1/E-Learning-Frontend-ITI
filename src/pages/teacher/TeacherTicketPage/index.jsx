import { useState } from "react";
import TicketList from "@/components/tickets/TicketList";
import TicketChat from "@/components/tickets/TicketChat";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const TeacherTicketPage = () => {
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showList, setShowList] = useState(true);

  const handleSelect = (id) => {
    setSelectedTicketId(id);
    setShowList(false); 
  };

  const handleBack = () => {
    setShowList(true); 
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6 h-full">

        <Card
          className={`
    w-full md:w-[400px] lg:w-[450px] xl:w-[500px] 
    
    flex flex-col shadow-sm border-slate-200 
    h-full min-h-0 overflow-hidden bg-white
    transition-all duration-300 ease-in-out

    ${showList ? "block md:flex" : "hidden md:flex"}
  `}
        >
          <TicketList
            selectedId={selectedTicketId}
            onSelect={handleSelect}
          />
        </Card>

        <Card
          className={`
            flex-1 shadow-sm border-slate-200 relative flex flex-col 
            h-full min-h-0 overflow-hidden bg-white
            transition-all duration-300 ease-in-out

            ${!showList ? "block md:flex" : "hidden md:flex"}
          `}
        >
          {selectedTicketId ? (
            <>
              <div className="md:hidden p-3 border-b bg-white">
                <button
                  onClick={handleBack}
                  className="text-sm font-bold text-primary flex items-center gap-1"
                >
                  ← Back
                </button>
              </div>

              <div className="animate-in fade-in slide-in-from-right-5 duration-300 h-full">
                <TicketChat ticketId={selectedTicketId} />
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