import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useUserQuery } from "../../queries/authQueries";

const BACKEND_URL = "http://localhost:5000";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [inputText, setInputText] = useState("");

  const { data: user } = useUserQuery();
  const currentUserId = user?._id;

  console.log("Current User ID:", user);
  console.log("Current User ID:", currentUserId);

  // === Ref for Auto-Scroll ===
  const messagesEndRef = useRef(null);

  // === Step 1: Fetch Chat History ===
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BACKEND_URL}/api/chat/69d46dde4b801f36d3264456/history/69d3f77927768c09bdb61add`,
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
  }, []);

  // === Step 2: Establish Socket Connection ===
  useEffect(() => {
    const token = localStorage.getItem("token");

    const newSocket = io(BACKEND_URL, {
      auth: { token: token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket. ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err.message);
    });

    // Cleanup: Disconnect socket when leaving the page
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // === Step 3: Listen for Incoming Messages ===
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receive_message", handleIncomingMessage);

    // Explicit listener setup
    socket.on("receive_message", (data) => {
      handleIncomingMessage(data);
    });
    // Cleanup: Remove listeners to prevent duplicate events
    return () => {
      socket.off("receive_message", handleIncomingMessage);
      socket.off("error");
    };
  }, [socket]);

  // === Step 4: Send Message ===
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!socket || !inputText.trim()) return;

    const payload = {
      to: "69d3f77927768c09bdb61add",
      courseId: "69d46dde4b801f36d3264456",
      message: inputText,
    };

    socket.emit("send_message", payload, (response) => {
      if (response.success) {
        // Instantly add message to the UI upon successful transmission
        setMessages((prev) => [...prev, response.message]);
        setInputText(""); // Clear the input field
      } else {
        alert("Failed to send the message!");
      }
    });
  };

  // === User Interface (UI) ===
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading chat history...
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      {/* Messages Display Area */}
      <div style={styles.messagesArea}>
        {messages.map((msg, index) => {
          // Determine layout alignment based on whether the message was sent by the current user or the other party
          const isMyMessage =
            msg.senderId?._id === currentUserId ||
            msg.senderId === currentUserId ||
            msg.from === currentUserId;

          return (
            <div
              key={index}
              style={{
                ...styles.messageWrapper,
                justifyContent: isMyMessage ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: isMyMessage ? "#007bff" : "#e9ecef",
                  color: isMyMessage ? "white" : "black",
                }}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        {/* Dummy div acting as an anchor for the auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} style={styles.formArea}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" disabled={!socket} style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
};

// === Simple inline styles for a tidy chat layout (can be replaced with Tailwind CSS) ===
const styles = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "500px",
    maxWidth: "600px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  messagesArea: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageWrapper: {
    display: "flex",
    width: "100%",
  },
  messageBubble: {
    padding: "10px 15px",
    borderRadius: "20px",
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  formArea: {
    display: "flex",
    padding: "10px",
    backgroundColor: "white",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    marginRight: "10px",
    outline: "none",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "20px",
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

export default ChatRoom;
