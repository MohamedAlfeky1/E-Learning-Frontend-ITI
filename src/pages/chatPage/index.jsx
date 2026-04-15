import ChatRoom from "@/components/chat/ChatRoom";
import ConversitionsList from "@/components/chat/ConversitionsList";
import { useGetConversations } from "@/queries/chatQueries";
import { useUserQuery } from "@/queries/authQueries";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ChatPage() {
  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();
  const userid = user?._id;

  const participantsIds = data?.data[0]?.participants.map((item) => item._id);
  const receiverId = participantsIds?.filter((item) => item !== userid)[0];
  console.log("userid", userid);

  console.log("receiverId", receiverId);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize="25%">
          <ConversitionsList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="75%">
          <ChatRoom
            courseId="69d5826c3cfb86707175c9ec"
            receiverId={receiverId}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
