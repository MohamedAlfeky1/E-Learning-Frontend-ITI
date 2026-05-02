import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRagStatus, processLessonVideo } from "@/api/ragApi";
import { Bot, CheckCircle2, Loader2, AlertCircle, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = ["Extracting audio...", "Transcribing video...", "Generating embeddings...", "Storing knowledge..."];

const ProcessVideoPanel = ({ lessonId, videosCount }) => {
  const [status, setStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [initialVideosCount, setInitialVideosCount] = useState(undefined);
  const [hasVideoChanged, setHasVideoChanged] = useState(false);

  useEffect(() => {
    if (videosCount !== undefined) {
      if (initialVideosCount === undefined) {
        setInitialVideosCount(videosCount);
      } else if (videosCount !== initialVideosCount) {
        setHasVideoChanged(true);
      }
    }
  }, [videosCount, initialVideosCount]);

  const fetchStatus = async () => {
    try {
      setIsLoadingStatus(true);
      setError(null);
      const data = await getRagStatus(lessonId);
      setStatus(data.data || data);
    } catch (err) {
      console.error("Error fetching RAG status:", err);
      setStatus({ isProcessed: false });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (lessonId) {
      fetchStatus();
    }
  }, [lessonId, videosCount]);

  useEffect(() => {
    let interval;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 5000);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleProcessVideo = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      toast.info("Started processing video...");
      const data = await processLessonVideo(lessonId);
      setStatus(data.data || data);
      toast.success("Video processed successfully!");
    } catch (err) {
      console.error("Error processing video:", err);
      const errorMessage = err.response?.data?.message || "Failed to process video.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setHasVideoChanged(false);
      if (videosCount !== undefined) {
        setInitialVideosCount(videosCount);
      }
      fetchStatus();
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-center h-40 mt-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 text-indigo-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-bold text-gray-400">Checking AI status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-100/50 mt-8 relative overflow-hidden group">
      {/* Decorative background blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>

      <div className="flex items-center gap-5 mb-8 relative z-10">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 rounded-[1.25rem] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
          <Bot className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            AI Video Chatbot
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </h2>
          <p className="text-gray-500 font-medium mt-1">Transform this video into an interactive learning experience</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-5 bg-red-50/80 border border-red-100 text-red-600 rounded-2xl flex items-center gap-4 relative z-10 shadow-sm">
          <div className="bg-red-100 p-2 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <span className="font-bold">{error}</span>
          <Button variant="ghost" className="ml-auto text-red-700 hover:bg-red-200/50 font-bold" onClick={handleProcessVideo}>
            Try Again
          </Button>
        </div>
      )}

      <div className="relative z-10">
        {isProcessing ? (
          <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-600 font-black mb-6 text-lg">
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing Video Content
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STEPS.map((step, idx) => {
                const isPast = idx < currentStep;
                const isCurrent = idx === currentStep;
                
                return (
                  <div
                    key={step}
                    className={cn(
                      "p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden",
                      isPast
                        ? "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 text-emerald-700"
                        : isCurrent
                        ? "bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-300 text-indigo-700 shadow-md ring-4 ring-indigo-500/10 scale-[1.02]"
                        : "bg-gray-50/50 border-gray-100 text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-4 font-bold text-sm">
                      <div className={cn(
                        "w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-colors",
                        isPast ? "bg-emerald-100 text-emerald-600" : isCurrent ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-400"
                      )}>
                        {isPast ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : isCurrent ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={cn("text-[15px]", isCurrent && "animate-pulse")}>{step}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : status?.isProcessed ? (
          <div className="flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm relative overflow-hidden group/success">
            {/* Success background decoration */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl group-hover/success:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 w-full mb-6">
              <div className="flex items-center gap-3 text-emerald-700 font-black text-xl mb-2">
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                Active & Ready
              </div>
              <p className="text-emerald-600/80 font-semibold mb-6">
                The interactive AI Chatbot is enabled for students.
              </p>

              {hasVideoChanged && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl flex items-start sm:items-center gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <span className="font-bold text-sm">Video content has changed! Please re-process to update the AI knowledge base.</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-emerald-100 font-bold text-emerald-900 shadow-sm flex items-center justify-between min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-600/70 text-xs uppercase tracking-wider">Chunks</span>
                  </div>
                  <span className="text-lg">{status.chunksCount || 0}</span>
                </div>
                {status.vectorizedAt && (
                  <div className="bg-white/80 backdrop-blur px-4 py-3 rounded-xl border border-emerald-100 font-bold text-emerald-900 shadow-sm flex items-center justify-between min-w-[180px] gap-4">
                    <span className="text-emerald-600/70 text-xs uppercase tracking-wider">Processed</span>
                    <span className="text-sm">{new Date(status.vectorizedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleProcessVideo}
              variant="outline"
              className={cn(
                "relative z-10 font-bold rounded-2xl h-14 px-8 w-full sm:w-max transition-all shadow-sm",
                hasVideoChanged 
                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-amber-500/20" 
                  : "border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
              )}
            >
              Re-process Video
            </Button>
          </div>
        ) : (
          <div className="bg-indigo-50/50 p-8 rounded-3xl border-2 border-dashed border-indigo-200 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group/unprocessed">
            <div className="absolute inset-0 bg-white/40 opacity-0 group-hover/unprocessed:opacity-100 transition-opacity"></div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="font-black text-xl text-indigo-900 mb-2">Enhance Learning with AI</h3>
              <p className="text-indigo-600/80 font-medium max-w-lg">
                Process this video to automatically generate a knowledge base. Students will be able to ask context-aware questions while watching.
              </p>
            </div>
            <Button
              onClick={handleProcessVideo}
              className="relative z-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-indigo-600/20 shrink-0 w-full md:w-auto group/btn overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Process Video Now
                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessVideoPanel;
