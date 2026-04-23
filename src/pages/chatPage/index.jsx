import ChatRoom from "@/components/chat/ChatRoom";
import ConversitionsList from "@/components/chat/ConversitionsList";
import { useGetConversations } from "@/queries/chatQueries";
import { useUserQuery } from "@/queries/authQueries";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();
  const userid = user?._id;

  // 1. Hooks MUST be called before any conditional early returns!
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    // Automatically select the first conversation when data initially loads
    if (!selectedConversation && data?.data?.length > 0) {
      setSelectedConversation(data.data[0]);
    }
  }, [data, selectedConversation]);

  // 2. Early returns
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Derive the active course and receiver IDs securely from the selection State
  const activeCourseId = selectedConversation?.courseId?._id || selectedConversation?.courseId;
  const activeParticipants = selectedConversation?.participants || [];
  const receiverId = activeParticipants.find((participant) => participant._id !== userid)?._id;

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] w-full rounded-lg border "
    >
      <ResizablePanel defaultSize="25%">
        <ConversitionsList onSelectConversation={onSelectConversation} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <ChatRoom
          key={activeCourseId + receiverId} // Force remount if conversation changes
          courseId={activeCourseId}
          receiverId={receiverId}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
