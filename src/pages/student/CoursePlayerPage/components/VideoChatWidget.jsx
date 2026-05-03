import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRagStatus, getRagSuggestions, askRagQuestion } from "@/api/ragApi";
import { cn } from "@/lib/utils";

const VideoChatWidget = ({ lessonId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const messagesEndRef = useRef(null);

  // Status check when lesson changes
  useEffect(() => {
    const fetchStatus = async () => {
      if (!lessonId) return;
      try {
        setIsLoadingStatus(true);
        setStatus(null);
        setMessages([]);
        setIsOpen(false);
        const data = await getRagStatus(lessonId);
        const isProcessed = data?.data?.isProcessed || data?.isProcessed;
        setStatus(data?.data || data);
        
        if (isProcessed) {
          fetchSuggestions();
        }
      } catch (err) {
        console.error("RAG status error:", err);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, [lessonId]);

  const fetchSuggestions = async () => {
    try {
      const res = await getRagSuggestions(lessonId);
      setSuggestions(res?.data || res || []);
    } catch (err) {
      console.error("Suggestions error:", err);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAskQuestion = async (question) => {
    if (!question.trim() || isAsking) return;

    const newMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsAsking(true);

    try {
      const res = await askRagQuestion(lessonId, question);
      const answerData = res?.data || res;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answerData.answer || "Sorry, I couldn't find an answer.",
          sources: answerData.sources || [],
          confidence: answerData.confidence || 0,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your question. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoadingStatus) return null; // Don't show anything while checking status

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-xl flex items-center justify-center p-0 transition-transform hover:scale-105"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>
        )}
      </div>

      {/* Chat Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-80 md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all duration-300 transform origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-indigo-600 text-white rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Lesson Assistant</h3>
              <p className="text-xs text-indigo-200">Ask questions about this video</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {!status?.isProcessed ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-70">
              <Bot className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-500 font-medium">
                The AI assistant is not yet available for this lesson. Please check back later or ask your teacher.
              </p>
            </div>
          ) : (
            <>
              {/* Welcome & Suggestions */}
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-sm text-gray-700">
                    Hi! I'm your AI assistant for this lesson. You can ask me anything about the video content!
                  </div>
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase">Suggested Questions</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAskQuestion(sug)}
                            className="text-left text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-3 py-2 rounded-xl transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
              ))}
              
              {isAsking && (
                <div className="flex items-center gap-2 text-indigo-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-100 rounded-b-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion(inputMessage);
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..."
              disabled={!status?.isProcessed || isAsking}
              className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-indigo-500 rounded-xl"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || !status?.isProcessed || isAsking}
              className="w-10 h-10 p-0 shrink-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] p-3 text-sm",
          isUser
            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
            : message.isError
            ? "bg-red-50 text-red-600 border border-red-100 rounded-2xl rounded-tl-sm"
            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm"
        )}
      >
        {message.content}
      </div>

      {/* Sources & Confidence */}
      {!isUser && !message.isError && (
        <div className="flex flex-col gap-2 mt-1 w-full max-w-[85%]">
          {message.confidence < 0.6 && message.confidence > 0 && (
            <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] font-bold w-fit">
              <AlertTriangle className="w-3 h-3" />
              Low Confidence Answer
            </div>
          )}

          {message.sources?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center justify-between w-full p-2 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span>View Sources ({message.sources.length})</span>
                {showSources ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              
              {showSources && (
                <div className="p-2 border-t border-gray-50 space-y-2 bg-gray-50/50">
                  {message.sources.map((src, i) => (
                    <div key={i} className="text-[10px] text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between font-bold mb-1">
                        <span className="text-indigo-600">Source {i + 1}</span>
                        {src.similarity && (
                          <span className={cn(
                            "px-1.5 py-0.5 rounded",
                            src.similarity >= 0.8 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {(src.similarity * 100).toFixed(0)}% Match
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-3 leading-relaxed">{src.text || src.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoChatWidget;
