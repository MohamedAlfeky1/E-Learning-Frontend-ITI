import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUserQuery } from "../../queries/authQueries";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { useGetConversations } from "@/queries/chatQueries";
import { useQueryClient } from "@tanstack/react-query";

const BACKEND_URL = "http://localhost:5000";

const ChatRoom = ({ courseId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [inputText, setInputText] = useState("");

  const { data, isLoading, error } = useGetConversations();
  const { data: user } = useUserQuery();
  const currentUserId = user?._id;
  const queryClient = useQueryClient();

  const reciver = data?.data?.map((conversation) => {
    // Get the participant who is not the current user (the receiver)
    return conversation.participants.find(
      (participant) => participant._id !== currentUserId,
    );
  });

  console.log("reciver", reciver[0]);

  const messagesEndRef = useRef(null);

  // === 1: جلب تاريخ المحادثة ===
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

  // === 2: الاتصال بالسوكيت ===
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

  // === 3: استقبال الرسائل الجديدة ===
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

    socket.on("receive_message", handleIncomingMessage);

    return () => {
      socket.off("receive_message", handleIncomingMessage);
    };
  }, [socket, courseId, receiverId]);

  // عمل Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === 4: إرسال الرسالة ===
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!socket || !inputText.trim() || !courseId || !receiverId) return;

    const payload = {
      to: receiverId, // ديناميك
      courseId: courseId, // ديناميك
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
            {`${reciver[0]?.firstName} ${reciver[0]?.lastName}`}
          </h3>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 dark:bg-zinc-950/50 flex flex-col gap-2">
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
                className={`relative px-5 py-3.5 rounded-xl max-w-[75%] break-words shadow-sm text-[15px] leading-relaxed transition-all duration-200 ${
                  isMyMessage
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-card-foreground"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
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
