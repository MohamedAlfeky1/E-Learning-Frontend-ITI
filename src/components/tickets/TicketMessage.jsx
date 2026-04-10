const TicketMessage = ({ msg }) => {
  const isAdmin = msg.isAdmin;

  return (
    <div className={`flex ${isAdmin ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex flex-col max-w-[80%] ${isAdmin ? "items-start" : "items-end"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isAdmin
              ? "bg-white border text-slate-800 rounded-tl-none"
              : "bg-primary text-white rounded-tr-none shadow-primary/10"
          }`}
        >
          <p className="leading-relaxed">{msg.message}</p>
        </div>
        <span className="text-[10px] mt-1 text-muted-foreground uppercase tracking-widest font-bold">
          {isAdmin ? "Nexora Support" : "You"} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>
    </div>
  );
};

export default TicketMessage;