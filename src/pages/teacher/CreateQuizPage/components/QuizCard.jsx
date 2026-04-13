import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  BarChart3, Pencil, Trash2, Clock, 
  Sparkles, Brain, FileText, Loader2 
} from "lucide-react";
import { toast } from "sonner";
import { quizApi } from "../../../../api/quizApi";

export default function QuizCard({ quiz, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    toast(`Delete "${quiz.title}"?`, {
      description: "This cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          setDeleting(true);
          try {
            await quizApi.delete(quiz._id);
            onDelete();
            toast.success("Quiz deleted successfully");
          } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete quiz");
          } finally {
            setDeleting(false);
          }
        }
      },
      cancel: {
        label: "Cancel"
      }
    });
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 rounded-lg bg-indigo-100">
            <AvatarFallback className="bg-indigo-100 text-indigo-600">
              {quiz.generatedByAI ? <Brain className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-slate-800">{quiz.title}</h4>
              <Badge className="bg-indigo-50 text-indigo-600 text-[9px]">
                {quiz.questions?.length || 0} questions
              </Badge>
              {quiz.duration > 0 && (
                <Badge className="bg-amber-50 text-amber-600 text-[9px]">
                  <Clock className="w-3 h-3 inline mr-1" /> {quiz.duration} min
                </Badge>
              )}
              {quiz.generatedByAI && (
                <Badge className="bg-purple-50 text-purple-600 text-[9px]">
                  <Sparkles className="w-3 h-3 inline mr-1" /> AI Generated
                </Badge>
              )}
              <Badge className={quiz.status === "published" ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"}>
                {quiz.status || "draft"}
              </Badge>
            </div>
            {quiz.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{quiz.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-4">
            <p className="text-[10px] text-slate-400 uppercase">Passing Score</p>
            <p className="text-lg font-bold text-slate-700">{quiz.passingScore || 60}%</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => window.open(`/quizzes/${quiz._id}/results`, "_blank")}>
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleting} className="text-red-400">
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
