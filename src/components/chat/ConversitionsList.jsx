import { useGetConversations } from "@/queries/chatQueries";
import { useUserQuery } from "@/queries/authQueries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

export default function ConversitionsList({ onSelectConversation, selectedConversationId }) {
  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();

  const currentUserId = user?._id;

  if (isLoading)
    return (
      <div className="flex flex-col border-r border-border w-full bg-background h-full">
        <div className="p-5 border-b border-border shrink-0 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Messages
          </h2>
        </div>
        <div className="flex items-center justify-center flex-1 text-muted-foreground text-sm font-medium">
          Loading chats...
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full bg-card h-full">
      {/* Sticky Header */}
      <div className="p-5 border-b border-border shrink-0 flex items-center gap-2 bg-card/95 backdrop-blur z-10 supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
          <MessageSquare className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Messages
        </h2>
      </div>

      {/* Scrollable List */}
      <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1">
        {data?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-medium text-muted-foreground">
              No conversations yet
            </p>
          </div>
        ) : (
          data?.data?.map((conversation) => {
            // Get the participant who is not the current user (the receiver)
            const receiver = conversation.participants.find(
              (participant) => participant._id !== currentUserId,
            );

            const receiverName =
              `${receiver?.firstName || ""} ${receiver?.lastName || ""}`.trim();

            return (
              <div
                key={conversation._id}
                onClick={() => onSelectConversation(conversation)}
                className={`group flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedConversationId === conversation._id
                    ? "bg-accent border-border shadow-sm"
                    : "bg-transparent border-transparent hover:bg-accent/50 hover:border-border/50"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0 mt-0.5">
                  <Avatar className="w-11 h-11 border border-border  ">
                    <AvatarImage src={receiver?.avatar} alt={receiverName} />
                    <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                      {receiver?.firstName
                        ? receiver.firstName.charAt(0).toUpperCase()
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full shadow-sm"></span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 overflow-hidden w-full">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate text-[15px]">
                      {receiverName || "Unknown User"}
                    </p>
                  </div>

                  {/* Course Title Badge */}
                  <div className="flex">
                    <p className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 mt-0.5 rounded-full truncate max-w-[90%]">
                      {conversation.courseId?.title || "Unknown Course"}
                    </p>
                  </div>

                  {/* Latest message */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs  mt-0.5 truncate pr-2  transition-colors">
                      {conversation.latestMessage ||
                        "Started a new conversation..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate pr-2  transition-colors">
                      {new Date(conversation.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
