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
    <div className="flex h-full items-center justify-center bg-white">
      <Loader2 className="animate-spin text-primary" size={30} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden"> 
      <div className="p-3 md:p-4 border-b flex items-center justify-between bg-white shrink-0 z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Headset size={18} />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-sm md:text-base truncate">
              {ticket?.subject || "Support Ticket"}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TicketCategoryBadge category={ticket?.category} />
              <span className="text-[10px] text-slate-300">|</span>
              <p className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground">
                {ticket?.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0 bg-[#f8fafc]">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {(ticket?.conversation || []).map((msg, i) => (
            <TicketMessage key={i} msg={msg} isContextAdmin={isAdmin} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 md:p-4 border-t bg-white shrink-0">
        <div className="flex gap-2 max-w-4xl mx-auto relative items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your reply..."
            disabled={isPending}
            className="flex-1 rounded-2xl bg-slate-50 border-slate-200 h-11 md:h-12 pr-12 text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={isPending || !message.trim()}
            className="absolute right-1 w-9 h-9 md:w-10 md:h-10 rounded-xl"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketChat;