const TicketMessage = ({ msg }) => {
  const isAdmin = msg.isAdmin;

  return (
    <div className={`flex ${isAdmin ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isAdmin ? "items-start" : "items-end"}`}>
        
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm transition ${
            isAdmin
              ? "bg-white border text-slate-800 rounded-tl-none"
              : "bg-primary text-white rounded-tr-none shadow-primary/20"
          }`}
        >
          <p className="leading-relaxed break-words">{msg.message}</p>
        </div>

        <span className="text-[10px] mt-1 text-muted-foreground uppercase tracking-wider font-medium px-1">
          {isAdmin ? "Support" : "You"} •{" "}
          {msg.timestamp ? (
            new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          ) : (
            "Just now" 
          )}
        </span>

      </div>
    </div>
  );
};

export default TicketMessage;