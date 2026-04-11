// components/tickets/TicketChat.jsx
import { useTicketQuery } from "@/queries/ticketQueries";
import { useReplyTicketMutation } from "@/mutations/ticketMutations";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Headset, Loader2 } from "lucide-react";
import TicketMessage from "./TicketMessage";
import TicketCategoryBadge from "./TicketCategoryBadge";

const TicketChat = ({ ticketId, isAdmin = false }) => {
  const { data, isLoading } = useTicketQuery(ticketId);
  const { mutate, isPending } = useReplyTicketMutation();
  const [message, setMessage] = useState("");
  
  const messagesEndRef = useRef(null);
  const ticket = data?.data || data;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticket?.conversation]);

  const handleSend = () => {
    if (!message.trim()) return;
    mutate({ id: ticketId, message }, { 
      onSuccess: () => {
        setMessage("");
        setTimeout(scrollToBottom, 100);
      } 
    });
  };

  if (isLoading) return (
    <div className="flex h-full items-center justify-center bg-slate-50/30">
      <Loader2 className="animate-spin text-primary" size={30} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden"> 
      
      <div className="p-4 border-b flex items-center justify-between bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Headset size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm md:text-base line-clamp-1">
              {ticket?.subject || "Support Ticket"}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <TicketCategoryBadge category={ticket?.category} />
              <span className="text-[10px] text-slate-300">|</span>
              <p className="text-[10px] uppercase font-bold text-muted-foreground">
                Status: {ticket?.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 bg-[#f8fafc]">
        <div className="p-4 md:p-6 space-y-6">
          {(ticket?.conversation || []).map((msg, i) => (
            <TicketMessage 
              key={i} 
              msg={msg} 
              isContextAdmin={isAdmin} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto relative items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isAdmin ? "Type your response as Support..." : "Type your reply..."}
            disabled={isPending}
            className="flex-1 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-primary h-12 pr-14"
          />
          <Button
            onClick={handleSend}
            disabled={isPending || !message.trim()}
            className="absolute right-1.5 w-10 h-10 rounded-xl shadow-lg transition-transform active:scale-95"
          >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </Button>
        </div>
        
        <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
          {isAdmin 
            ? "Your response will be visible to the user immediately" 
            : "Our team usually responds within a few hours"}
        </p>
      </div>
    </div>
  );
};

export default TicketChat;