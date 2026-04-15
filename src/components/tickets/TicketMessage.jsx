const TicketMessage = ({ msg, isContextAdmin = false }) => {
  const msgFromAdmin = msg.isAdmin;

  const getDisplayName = () => {
    if (isContextAdmin) return msgFromAdmin ? "Support" : "User"; 
    return msgFromAdmin ? "Support" : "You";
  };

  return (
    <div className={`flex ${msgFromAdmin ? "justify-start" : "justify-end"} mb-2`}>
      <div className={`flex flex-col max-w-[90%] md:max-w-[75%] ${msgFromAdmin ? "items-start" : "items-end"}`}>
        <div
          className={`px-3 py-2 md:px-4 md:py-3 rounded-2xl text-[13px] md:text-sm shadow-sm ${
            msgFromAdmin
              ? "bg-white border text-slate-800 rounded-tl-none"
              : "bg-primary text-white rounded-tr-none"
          }`}
        >
          <p className="leading-relaxed break-words">{msg.message}</p>
        </div>
        <span className="text-[9px] mt-1 text-muted-foreground uppercase font-medium px-1">
          {getDisplayName()} • {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Just now"}
        </span>
      </div>
    </div>
  );
};
export default TicketMessage;