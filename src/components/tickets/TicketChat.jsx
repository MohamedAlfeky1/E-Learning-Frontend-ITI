import { useTicketQuery } from "@/queries/ticketQueries";
import { useReplyTicketMutation } from "@/mutations/ticketMutations";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Headset } from "lucide-react";
import TicketMessage from "./TicketMessage";
import TicketCategoryBadge from "./TicketCategoryBadge";

const TicketChat = ({ ticketId }) => {
  const { data, isLoading } = useTicketQuery(ticketId);
  const { mutate, isPending } = useReplyTicketMutation();
  const [message, setMessage] = useState("");
  const ticket = data;

  const handleSend = () => {
    if (!message.trim()) return;
    mutate({ id: ticketId, message }, { 
        onSuccess: () => setMessage("") 
    });
  };

  if (isLoading) return <div className="p-8 text-center animate-pulse text-muted-foreground">Loading Conversation...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-slate-50/50">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Headset size={20} />
        </div>
        <div className="flex items-center gap-2">
  <h2>{ticket.subject}</h2>
  <TicketCategoryBadge category={ticket.category} />
</div>
      </div>

      <ScrollArea className="flex-1 p-4 bg-[#f8fafc]">
        <div className="space-y-4">
          {(ticket?.conversation || []).map((msg, i) => (
            <TicketMessage key={i} msg={msg} />
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your reply..."
            className="flex-1 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-primary"
          />
          <Button 
            onClick={handleSend} 
            disabled={isPending || !message.trim()}
            className="rounded-full w-12 h-12 p-0 shadow-lg shadow-primary/20"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketChat;