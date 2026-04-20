import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLesson } from "@/queries/lessonsQueries";
import { useUploadVideosMutation } from "@/mutations/useUploadVideosMutation";
import { useUploadMaterialsMutation } from "@/mutations/useUploadMaterialsMutation";
import { useDeleteLessonVideoMutation } from "@/mutations/useDeleteLessonVideoMutation";
import { useDeleteLessonMaterialMutation } from "@/mutations/useDeleteLessonMaterialMutation";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Video,
  FileText,
  Upload,
  PlayCircle,
  File,
  Trash2,
  Clock,
  ExternalLink,
} from "lucide-react";

const LessonDetailsPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const {
    data: lessonResponse,
    isLoading,
    isError,
  } = useLesson(courseId, lessonId);
  const lesson = lessonResponse?.data;

  console.log(lesson);

  const { mutate: uploadVideos, isPending: isUploadingVideos } =
    useUploadVideosMutation(courseId);
  const { mutate: uploadMaterials, isPending: isUploadingMaterials } =
    useUploadMaterialsMutation(courseId);
  const { mutate: deleteVideo } = useDeleteLessonVideoMutation(
    courseId,
    lessonId,
  );
  const { mutate: deleteMaterial } = useDeleteLessonMaterialMutation(
    courseId,
    lessonId,
  );

  const [videoFiles, setVideoFiles] = useState([]);
  const [materialFiles, setMaterialFiles] = useState([]);

  const handleVideoUpload = () => {
    if (videoFiles.length === 0) return;
    uploadVideos(
      { lessonId, files: videoFiles },
      {
        onSuccess: () => setVideoFiles([]),
      },
    );
  };

  const handleMaterialUpload = () => {
    if (materialFiles.length === 0) return;
    uploadMaterials(
      { lessonId, files: materialFiles },
      {
        onSuccess: () => setMaterialFiles([]),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <Spinner className="w-12 h-12 border-purple-600" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FD] p-4">
        <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">
          Lesson not found or failed to load.
        </h2>
        <Button
          onClick={() => navigate(-1)}
          className="rounded-xl bg-purple-600 h-12 px-8"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen p-4 md:p-8 font-['Plus Jakarta Sans']">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <header className="bg-white p-8 md:p-12 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="relative z-10 flex flex-col gap-6">
            <Button
              variant="ghost"
              onClick={() => navigate(`/teacher/courses/${courseId}/lessons`)}
              className="w-fit text-gray-500 hover:text-purple-600 font-bold p-0 flex items-center gap-2 group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Curriculum
            </Button>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                  Lesson Details
                </span>
                <span className="text-gray-300 font-black">•</span>
                <span className="text-gray-400 font-black text-[10px] uppercase tracking-widest">
                  Order Index: #{lesson.orderIndex + 1}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                {lesson.title}
              </h1>
              <p className="text-gray-500 text-lg font-medium max-w-3xl leading-relaxed">
                {lesson.description}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Videos Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-blue-600" />
                </div>
                Lesson Videos
              </h2>
              <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {lesson.videos?.length || 0} Total
              </span>
            </div>

            {/* Upload Box */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-blue-100 shadow-sm hover:border-blue-300 transition-all group">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">
                    Upload New Videos
                  </h3>
                  <p className="text-sm font-medium text-gray-400">
                    Select MP4, MOV, or AVI files
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".mp4,.mov,.avi"
                  onChange={(e) => setVideoFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="video-upload"
                />
                <div className="flex flex-col w-full gap-3 mt-2">
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    {videoFiles.length > 0
                      ? `${videoFiles.length} files selected`
                      : "Browse Files"}
                  </label>
                  {videoFiles.length > 0 && (
                    <Button
                      onClick={handleVideoUpload}
                      disabled={isUploadingVideos}
                      className="h-12 rounded-2xl bg-blue-600 text-white font-black shadow-lg shadow-blue-100"
                    >
                      {isUploadingVideos ? (
                        <Spinner className="w-4 h-4 border-white" />
                      ) : (
                        "Start Upload"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Videos List */}
            <div className="space-y-4">
              {lesson.videos?.length > 0 ? (
                lesson.videos.map((vid, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-3xl border border-gray-50 flex items-center gap-5 group hover:shadow-xl hover:shadow-blue-500/5 transition-all"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <PlayCircle className="w-6 h-6 text-gray-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {vid.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {vid.duration || 0}m
                        </span>
                        {vid.isPreview && (
                          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md border border-green-100">
                            Preview
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={vid.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteVideo({ lessonId, videoId: vid._id })
                      }
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6 font-medium bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
                  No videos uploaded yet
                </p>
              )}
            </div>
          </section>

          {/* Materials Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                Learning Materials
              </h2>
              <span className="text-xs font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {lesson.materials?.length || 0} Total
              </span>
            </div>

            {/* Upload Box */}
            <div className="bg-white p-8 rounded-[2.5rem] border-2 border-dashed border-orange-100 shadow-sm hover:border-orange-300 transition-all group">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-orange-400 group-hover:text-orange-600" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">Upload Materials</h3>
                  <p className="text-sm font-medium text-gray-400">
                    PDF, DOC, or ZIP files
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.zip"
                  onChange={(e) => setMaterialFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="material-upload"
                />
                <div className="flex flex-col w-full gap-3 mt-2">
                  <label
                    htmlFor="material-upload"
                    className="flex items-center justify-center h-12 rounded-2xl bg-orange-50 text-orange-600 font-bold cursor-pointer hover:bg-orange-100 transition-colors"
                  >
                    {materialFiles.length > 0
                      ? `${materialFiles.length} files selected`
                      : "Browse Files"}
                  </label>
                  {materialFiles.length > 0 && (
                    <Button
                      onClick={handleMaterialUpload}
                      disabled={isUploadingMaterials}
                      className="h-12 rounded-2xl bg-orange-600 text-white font-black shadow-lg shadow-orange-100"
                    >
                      {isUploadingMaterials ? (
                        <Spinner className="w-4 h-4 border-white" />
                      ) : (
                        "Start Upload"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Materials List */}
            <div className="space-y-4">
              {lesson.materials?.length > 0 ? (
                lesson.materials.map((mat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-3xl border border-gray-50 flex items-center gap-5 group hover:shadow-xl hover:shadow-orange-500/5 transition-all"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <File className="w-6 h-6 text-gray-400 group-hover:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {mat.title}
                      </h4>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 block">
                        {mat.fileType || "Document"}
                      </span>
                    </div>
                    <a
                      href={mat.fileUrl}
                      download={mat.title}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        deleteMaterial({ lessonId, materialId: mat._id })
                      }
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6 font-medium bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
                  No materials uploaded yet
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailsPage;
