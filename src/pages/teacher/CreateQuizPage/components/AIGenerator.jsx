import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Brain, Sparkles, Loader2, Save, Edit3 } from "lucide-react";
import { quizApi } from "../../../../api/quizApi";

export default function AIGenerator({ courseId, onSuccess, onReview, generating, setGenerating }) {
  const [prompt, setPrompt] = useState({
    topic: "",
    level: "intermediate",
    count: 5,
  });
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.topic) {
      toast.error("Please enter a topic");
      return;
    }

    setGenerating(true);
    try {
      const { data } = await quizApi.generateAI({
        courseId:courseId,
        title: `${prompt.topic} Quiz (AI Generated)`,
        description: `AI-generated quiz about ${prompt.topic}`,
        aiPrompt: prompt,
      });
      setGeneratedQuiz(data.data);
      toast.success("Quiz generated successfully! You can edit it before publishing.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedQuiz) return;
    setGenerating(true);
    try {
      await quizApi.create({
        courseId:"69cab49a79558b5ca2441532",
        title: generatedQuiz.title,
        description: generatedQuiz.description,
        duration: generatedQuiz.duration,
        passingScore: generatedQuiz.passingScore,
        questions: generatedQuiz.questions,
      });
      toast.success("Quiz saved successfully");
      onSuccess(generatedQuiz);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save quiz");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" /> AI Quiz Generator
        </CardTitle>
        <p className="text-sm text-slate-500">Enter a topic and let AI create a quiz for you</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label>Topic *</Label>
            <Input
              value={prompt.topic}
              onChange={(e) => setPrompt({ ...prompt, topic: e.target.value })}
              placeholder="e.g., JavaScript Closures, React Hooks, Python Decorators"
              className="mt-1 rounded-xl"
            />
          </div>
          <div>
            <Label>Difficulty Level</Label>
            <Select value={prompt.level} onValueChange={(v) => setPrompt({ ...prompt, level: v })}>
              <SelectTrigger className="mt-1 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Number of Questions</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={prompt.count}
            onChange={(e) => setPrompt({ ...prompt, count: parseInt(e.target.value) })}
            className="mt-1 rounded-xl w-32"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl w-full"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Generate Quiz
        </Button>

        {generatedQuiz && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-green-800">Quiz Generated Successfully!</h4>
                  <p className="text-sm text-green-600 mt-1">
                    {generatedQuiz.questions?.length || 0} questions created
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => onReview && onReview(generatedQuiz)} variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                    <Edit3 className="w-4 h-4 mr-2" /> Review & Edit
                  </Button>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" /> Save to Course
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Preview */}
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 mt-4">
              {generatedQuiz.questions?.map((q, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-white shadow-sm">
                  <p className="font-semibold text-slate-800 mb-3">{idx + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options?.map((opt, oIdx) => (
                      <div 
                        key={oIdx} 
                        className={`p-2 rounded-lg text-sm border ${
                          opt.isCorrect 
                            ? "bg-green-50 border-green-200 text-green-700 font-medium" 
                            : "bg-slate-50 border-slate-100 text-slate-600"
                        }`}
                      >
                        {opt.isCorrect ? "✓" : "○"} {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
