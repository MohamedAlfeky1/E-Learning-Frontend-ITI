import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Save } from "lucide-react";
import { quizApi } from "../../../../api/quizApi";
import QuestionCard from "./QuestionCard";

export default function QuizForm({ courseId, initialData, isEdit, onSuccess }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 30,
    passingScore: initialData?.passingScore || 60,
    questions: initialData?.questions || [],
  });
  const [saving, setSaving] = useState(false);

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          question: "",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
          points: 1,
          explanation: "",
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...formData.questions];
    if (field === "isCorrect") {
      // Only one correct answer per question
      newQuestions[qIndex].options.forEach((opt, idx) => {
        opt.isCorrect = idx === oIndex;
      });
    } else {
      newQuestions[qIndex].options[oIndex][field] = value;
    }
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate each question has exactly one correct answer
    for (let i = 0; i < formData.questions.length; i++) {
      const correctCount = formData.questions[i].options.filter(opt => opt.isCorrect).length;
      if (correctCount !== 1) {
        alert(`Question ${i + 1} must have exactly one correct answer`);
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        courseId:"69cab49a79558b5ca2441532",
        title: formData.title,
        description: formData.description,
        duration: parseInt(formData.duration),
        passingScore: parseInt(formData.passingScore),
        questions: formData.questions,
      };

      if (isEdit) {
        await quizApi.update(initialData._id, payload);
        alert("Quiz updated successfully");
      } else {
        await quizApi.create(payload);
        alert("Quiz created successfully");
      }
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Quiz" : "Create New Quiz"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quiz Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., JavaScript Fundamentals Quiz"
                required
                className="mt-1 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  placeholder="30"
                  className="mt-1 rounded-xl"
                />
                <p className="text-xs text-slate-400 mt-1">0 = no time limit</p>
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                  placeholder="60"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the quiz..."
              className="mt-1 rounded-xl"
              rows={2}
            />
          </div>

          {/* Questions Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">Questions</Label>
              <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-1" /> Add Question
              </Button>
            </div>

            {formData.questions.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl">
                <p className="text-slate-400">No questions added yet</p>
                <Button type="button" variant="link" onClick={addQuestion} className="mt-2">
                  Add your first question
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.questions.map((question, qIdx) => (
                  <QuestionCard
                    key={qIdx}
                    index={qIdx}
                    question={question}
                    onUpdate={updateQuestion}
                    onUpdateOption={updateOption}
                    onRemove={() => removeQuestion(qIdx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              {isEdit ? "Update Quiz" : "Create Quiz"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
