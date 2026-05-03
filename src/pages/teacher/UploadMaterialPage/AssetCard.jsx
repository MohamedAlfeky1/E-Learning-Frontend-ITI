import { Progress } from "@/components/ui/progress";
import { FilePlay } from "lucide-react";

const AssetCard = () => {
  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-3">
        <div className="p-4 bg-white rounded-lg text-primary">
          <FilePlay size={30} />
        </div>
        <div className="py-2 grow flex flex-col justify-between truncate font-inter">
          <p className="text-sm font-bold leading-5 mb-0">
            Intro_to_Physics_Lec01.mp4
          </p>
          <p className="text-slate-500 text-xs leading-4 mb-0">
            450 MB • 68% complete
            {/* TODO: use Field shadcn component for progress label */}
          </p>
        </div>
      </div>
      <Progress
        value={68}
        style={{ backgroundColor: "#E2E8F0" }}
        className=""
      />
    </div>
  );
};

export default AssetCard;
