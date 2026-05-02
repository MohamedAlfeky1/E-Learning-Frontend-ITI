import React from "react";
import { useUpload } from "@/contexts/UploadContext";
import { X, Video, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CircularProgress = ({ progress, color, icon: Icon, onCancel, label }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.8 }}
      className="relative group"
    >
      <div className="bg-white/80 backdrop-blur-md p-1 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center justify-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500">
        <svg className="w-14 h-14 transform -rotate-90">
          {/* Background circle */}
          <circle
            className="text-gray-100"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="28"
            cy="28"
          />
          {/* Progress circle */}
          <motion.circle
            className={color}
            strokeWidth="3.5"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="28"
            cy="28"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          {/* Normal Icon */}
          <div className="flex flex-col items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
            <Icon
              className={`w-5 h-5 ${color.replace("text-", "text-opacity-60 text-")}`}
            />
            <span className="text-[8px] font-black text-gray-400 -mt-0.5">
              {progress}%
            </span>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full text-red-500 hover:text-red-600 group-hover:scale-100 scale-75 transition-transform"
            title="Cancel Upload"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Floating Label */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {label}: {progress}% Uploaded
        </div>
      </div>
    </motion.div>
  );
};

const GlobalUploadProgress = () => {
  const {
    videoProgress,
    materialProgress,
    isUploadingVideos,
    isUploadingMaterials,
    cancelVideoUpload,
    cancelMaterialUpload,
  } = useUpload();

  return (
    <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-6 items-end">
      <AnimatePresence mode="popLayout">
        {isUploadingVideos && (
          <CircularProgress
            key="video-upload"
            progress={videoProgress}
            color="text-indigo-600"
            icon={Video}
            onCancel={cancelVideoUpload}
            label="Videos"
          />
        )}
        {isUploadingMaterials && (
          <CircularProgress
            key="material-upload"
            progress={materialProgress}
            color="text-orange-600"
            icon={FileText}
            onCancel={cancelMaterialUpload}
            label="Materials"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalUploadProgress;
