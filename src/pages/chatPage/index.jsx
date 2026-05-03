import ChatRoom from "@/components/chat/ChatRoom";
import ConversitionsList from "@/components/chat/ConversitionsList";
import { useGetConversations } from "@/queries/chatQueries";
import { useUserQuery } from "@/queries/authQueries";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ChatPage() {
  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();
  const userid = user?._id;
  const location = useLocation();

  // State passed from CoursePlayerPage "Chat with Teacher" button
  const incomingCourseId = location.state?.courseId;
  const incomingReceiverId = location.state?.teacherId;
  const incomingReceiverName = location.state?.teacherName;

  const [selectedConversation, setSelectedConversation] = useState(null);
  // Tracks whether we've handled the incoming navigation state
  const incomingHandledRef = useRef(false);

  useEffect(() => {
    // Wait for BOTH conversations and user data to load
    if (!data?.data || !userid) return;

    // If we arrived from CoursePlayerPage with courseId + teacherId
    if (incomingCourseId && incomingReceiverId && !incomingHandledRef.current) {
      incomingHandledRef.current = true;

      // Search for an existing conversation matching this course + teacher
      const existingConversation = data.data.find((conv) => {
        const convCourseId = conv.courseId?._id || conv.courseId;
        const otherParticipant = conv.participants?.find(
          (p) => p._id !== userid
        );
        return (
          convCourseId === incomingCourseId &&
          otherParticipant?._id === incomingReceiverId
        );
      });

      if (existingConversation) {
        // Found it — select it to load chat history
        setSelectedConversation(existingConversation);
      } else {
        // No conversation yet — set a virtual selection
        setSelectedConversation({
          _isNew: true,
          courseId: incomingCourseId,
          receiverId: incomingReceiverId,
          receiverName: incomingReceiverName,
        });
      }

      // Clear the navigation state
      window.history.replaceState({}, document.title);
      return;
    }

    // Transition virtual conversation to real one if it's now available in data
    if (selectedConversation?._isNew) {
      const realConversation = data.data.find((conv) => {
        const convCourseId = conv.courseId?._id || conv.courseId;
        const otherParticipant = conv.participants?.find((p) => p._id !== userid);
        return (
          convCourseId === selectedConversation.courseId &&
          otherParticipant?._id === selectedConversation.receiverId
        );
      });

      if (realConversation) {
        setSelectedConversation(realConversation);
        return;
      }
    }

    // Default: auto-select the first conversation if nothing is selected
    if (!selectedConversation && data.data.length > 0) {
      setSelectedConversation(data.data[0]);
    }
  }, [data, userid, selectedConversation, incomingCourseId, incomingReceiverId]);

  if (isLoading || !userid) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const onSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  // Derive the active courseId and receiverId from the current selection
  let activeCourseId, receiverId, receiverName;

  if (selectedConversation?._isNew) {
    // Brand-new chat initiated from CoursePlayerPage
    activeCourseId = selectedConversation.courseId;
    receiverId = selectedConversation.receiverId;
    receiverName = selectedConversation.receiverName;
  } else if (selectedConversation) {
    // Existing conversation from the list
    activeCourseId =
      selectedConversation.courseId?._id || selectedConversation.courseId;
    const activeParticipants = selectedConversation.participants || [];
    const otherUser = activeParticipants.find((p) => p._id !== userid);
    receiverId = otherUser?._id;
    receiverName = otherUser
      ? `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim()
      : undefined;
  }

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] w-full rounded-lg border "
    >
      <ResizablePanel defaultSize="25%">
        <ConversitionsList 
          onSelectConversation={onSelectConversation} 
          selectedConversationId={selectedConversation?._id}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        {activeCourseId && receiverId ? (
          <ChatRoom
            key={activeCourseId + receiverId}
            courseId={activeCourseId}
            receiverId={receiverId}
            receiverName={receiverName}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-80px)] text-muted-foreground">
            <p className="text-sm font-medium">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
