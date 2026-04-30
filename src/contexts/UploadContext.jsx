import React, { createContext, useContext, useState, useRef } from "react";
import { uploadLessonVideos, uploadLessonMaterials } from "@/services/lessonsService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [materialProgress, setMaterialProgress] = useState(0);
  const [isUploadingVideos, setIsUploadingVideos] = useState(false);
  const [isUploadingMaterials, setIsUploadingMaterials] = useState(false);
  
  const videoAbortController = useRef(null);
  const materialAbortController = useRef(null);
  const queryClient = useQueryClient();

  const uploadVideos = async ({ courseId, lessonId, files }) => {
    if (files.length === 0) return;
    setIsUploadingVideos(true);
    setVideoProgress(0);
    videoAbortController.current = new AbortController();

    try {
      await uploadLessonVideos({
        lessonId,
        files,
        signal: videoAbortController.current.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setVideoProgress(percentCompleted);
        },
      });
      
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, lessonId]);
      toast.success("Videos Uploaded Successfully");
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        // Silent cancel
      } else {
        toast.error(error.message || "Failed To Upload Videos");
      }
    } finally {
      setIsUploadingVideos(false);
      setVideoProgress(0);
      videoAbortController.current = null;
    }
  };

  const cancelVideoUpload = () => {
    if (videoAbortController.current) {
      videoAbortController.current.abort();
      videoAbortController.current = null;
      setIsUploadingVideos(false);
      setVideoProgress(0);
    }
  };

  const uploadMaterials = async ({ courseId, lessonId, files }) => {
    if (files.length === 0) return;
    setIsUploadingMaterials(true);
    setMaterialProgress(0);
    materialAbortController.current = new AbortController();

    try {
      await uploadLessonMaterials({
        lessonId,
        files,
        signal: materialAbortController.current.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setMaterialProgress(percentCompleted);
        },
      });
      
      queryClient.invalidateQueries(["lessons", courseId]);
      queryClient.invalidateQueries(["lesson", courseId, lessonId]);
      toast.success("Materials Uploaded Successfully");
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        // Silent cancel
      } else {
        toast.error(error.message || "Failed To Upload Materials");
      }
    } finally {
      setIsUploadingMaterials(false);
      setMaterialProgress(0);
      materialAbortController.current = null;
    }
  };

  const cancelMaterialUpload = () => {
    if (materialAbortController.current) {
      materialAbortController.current.abort();
      materialAbortController.current = null;
      setIsUploadingMaterials(false);
      setMaterialProgress(0);
    }
  };

  return (
    <UploadContext.Provider
      value={{
        videoProgress,
        materialProgress,
        isUploadingVideos,
        isUploadingMaterials,
        uploadVideos,
        cancelVideoUpload,
        uploadMaterials,
        cancelMaterialUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider");
  }
  return context;
};
