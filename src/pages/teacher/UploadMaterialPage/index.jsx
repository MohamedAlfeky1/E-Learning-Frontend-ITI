import { CloudUpload, PlusIcon } from "lucide-react";
import "./style.css";
import { Button } from "@/components/ui/button";
import UploadingCard from "./UploadingCard";

const UploadMaterialPage = () => {
  return (
    <div className="min-h-screen text-white p-6 md:p-12 font-sans page-bg">
      {/* Header */}
      <header className="mb-8 flex flex-col justify-between">
        <p className="tracking-widest uppercase mb-2 text-primary text-size-xs font-weight-700 font-inter">
          MEDIA MANAGER
        </p>
        <h1 className="mb-2 text-dark text-size-3xl font-weight-800 font-plus-jakarta">
          Upload Course Assets
        </h1>
        <p className="text-muted-foreground max-w-md text-secondary text-size-base font-weight-400 font-inter">
          Manage your educational video library, presentation decks, and
          supplementary materials. Supported formats: MP4, MOV, PDF, PPTX.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border-2 border-dashed border-slate-300 bg-white rounded-[24px] flex flex-col items-center justify-center gap-2 text-center p-12 cursor-pointer transition-colors hover:border-indigo-600">
          <Button
            variant="secondary"
            className="size-16 rounded-full text-primary flex items-center justify-center mb-2"
          >
            <CloudUpload />
          </Button>
          <h3
            className="text-slate-950 text-base font-bold leading-6 mb-0"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Drag and drop your files
          </h3>
          <p className="text-slate-600 text-sm leading-6 mb-6">
            Up to 2GB per file. High-resolution video recommended.
          </p>
          <Button
            className="background-color-primary"
            style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            Select Files
          </Button>
        </div>
        <UploadingCard />
      </section>
      {/* TODO: recent uploads section */}
    </div>
  );
};

export default UploadMaterialPage;
