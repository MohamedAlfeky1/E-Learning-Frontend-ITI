import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUserQuery } from "../../queries/authQueries";
import { Send, Loader2, MessageCircle, Check, CheckCheck } from "lucide-react";
import { useGetConversations } from "@/queries/chatQueries";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_URL = "https://e-learning-platform-api-production.up.railway.app";

const ChatRoom = ({ courseId, receiverId, receiverName }) => {
  console.log("courseId", courseId);
  console.log("receiverId", receiverId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [inputText, setInputText] = useState("");

  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();
  const currentUserId = user?._id;
  const queryClient = useQueryClient();

  const currentConversation = data?.data?.find(
    (c) => c.courseId?._id === courseId || c.courseId === courseId
  );
  
  const matchedReceiver = currentConversation?.participants?.find(
    (participant) => participant._id !== currentUserId
  );
  
  const displayReceiverName = receiverName || 
    (matchedReceiver ? `${matchedReceiver.firstName || ''} ${matchedReceiver.lastName || ''}`.trim() : "Chat");

  const messagesContainerRef = useRef(null);

  // Get Chat History
  useEffect(() => {
    if (!courseId || !receiverId) return;

    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/chat/${courseId}/history/${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          setMessages(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [courseId, receiverId]);

  // Connect to Socket
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(BACKEND_URL, {
      auth: { token: token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket.");
    });

    newSocket.on("error", (err) => {
      console.error("❌ Socket Error from Backend:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Receive New Messages
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (newMessage) => {
      if (
        newMessage.courseId === courseId &&
        (newMessage.from === receiverId || newMessage.to === receiverId)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }

      // Update the conversations list instantly
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const handleMessagesRead = (payload) => {
      if (payload.courseId === courseId && payload.receiverId === receiverId) {
        setMessages((prev) =>
          prev.map((msg) => {
            const isMyMessage =
              msg.senderId?._id === currentUserId ||
              msg.senderId === currentUserId ||
              msg.from === currentUserId;
            if (isMyMessage) {
              return { ...msg, isRead: true };
            }
            return msg;
          }),
        );
      }
    };

    socket.on("receive_message", handleIncomingMessage);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleIncomingMessage);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, courseId, receiverId]);

  // Mark messages as read automatically when array length changes or on load
  useEffect(() => {
    if (socket && courseId && receiverId && messages.length > 0) {
      socket.emit("mark_messages_read", { courseId, senderId: receiverId });
    }
  }, [socket, courseId, receiverId, messages.length]);

  // Auto-scroll
  useEffect(() => {
    if (messagesContainerRef.current) {
      // Use scrollTop to prevent the whole browser window from scrolling
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // === 4: إرسال الرسالة ===
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!socket || !inputText.trim() || !courseId || !receiverId) return;

    const payload = {
      to: receiverId,
      courseId: courseId,
      message: inputText,
    };

    const messageText = inputText;
    setInputText("");

    socket.emit("send_message", payload, (response) => {
      if (response && response.success) {
        setMessages((prev) => [...prev, response.message]);

        // Update the conversations list instantly
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } else {
        console.error("❌ Send failed:", response);
        setInputText(messageText);
      }
    });
  };

  if (loading)
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-5 text-muted-foreground bg-background h-[calc(100vh-80px)] border-l border-border">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-foreground">
          Loading your messages...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-80px)] border-l border-border bg-background">
      {/* Sleek chat header */}
      <div className="p-4 px-6 border-b border-border bg-card/95 backdrop-blur shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg tracking-tight text-foreground">
            {displayReceiverName}
          </h3>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/50 flex flex-col gap-2 scroll-smooth"
      >
        {messages.map((msg, index) => {
          const isMyMessage =
            msg.senderId?._id === currentUserId ||
            msg.senderId === currentUserId ||
            msg.from === currentUserId;

          return (
            <div
              key={msg._id || index}
              className={`flex w-full ${isMyMessage ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`relative px-5 py-3.5 rounded-xl max-w-[75%] break-words shadow-sm text-[15px] leading-relaxed transition-all duration-200 flex flex-col gap-1 ${
                  isMyMessage
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-card-foreground"
                }`}
              >
                <span>{msg.message}</span>

                <div
                  className={`self-end flex items-center justify-end gap-1 opacity-80 mt-0.5 ${!isMyMessage ? "text-muted-foreground/80" : ""}`}
                >
                  <span className="text-[10px] uppercase font-semibold">
                    {new Date(msg.sentAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {isMyMessage &&
                    (msg.isRead ? (
                      <CheckCheck className="w-4 h-4 text-emerald-300 drop-shadow-sm" />
                    ) : (
                      <Check className="w-4 h-4 text-primary-foreground/60" />
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-background border-t border-border mt-auto">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-3 max-w-4xl mx-auto w-full relative"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-5 py-3.5 rounded-full border border-input bg-secondary/30 outline-none text-foreground text-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
          <button
            type="submit"
            disabled={!socket || !inputText.trim()}
            className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
