import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ title, description, action, actionText }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl">
      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="text-slate-400 mt-1">{description}</p>
      <Button onClick={action} className="mt-4 bg-indigo-600 hover:bg-indigo-700">
        <Plus className="w-4 h-4 mr-2" /> {actionText}
      </Button>
    </div>
  );
}
