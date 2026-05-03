import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Trash2, CheckCircle } from "lucide-react";

export default function QuestionCard({ index, question, onUpdate, onUpdateOption, onRemove }) {
  return (
    <Card className="border border-slate-200 rounded-xl">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-semibold text-slate-800">Question {index + 1}</h4>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="text-red-400">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Question Text</Label>
            <Textarea
              value={question.question}
              onChange={(e) => onUpdate(index, "question", e.target.value)}
              placeholder="Enter your question..."
              className="mt-1 rounded-xl"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Points</Label>
              <Input
                type="number"
                value={question.points}
                onChange={(e) => onUpdate(index, "points", parseInt(e.target.value))}
                min="1"
                className="mt-1 rounded-xl"
              />
            </div>
            <div>
              <Label>Explanation (optional)</Label>
              <Input
                value={question.explanation}
                onChange={(e) => onUpdate(index, "explanation", e.target.value)}
                placeholder="Explain why the correct answer is right..."
                className="mt-1 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Options (exactly one correct)</Label>
            <div className="space-y-2">
              {question.options.map((option, oIdx) => (
                <div key={oIdx} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      value={option.text}
                      onChange={(e) => onUpdateOption(index, oIdx, "text", e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    type="button"
                    variant={option.isCorrect ? "default" : "outline"}
                    size="sm"
                    onClick={() => onUpdateOption(index, oIdx, "isCorrect", true)}
                    className={option.isCorrect ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {option.isCorrect ? <CheckCircle className="w-4 h-4" /> : "Correct"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
