/**
 * ========================================
 * QUIZ MANAGEMENT PAGE
 * ========================================
 * Main dashboard for managing course quizzes
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Edit3, LayoutGrid, ListFilter, 
  Pencil, Brain, Sparkles, Trophy, Users,
  CheckCircle, FileText, Loader2
} from "lucide-react";

import { quizApi } from "../../../api/quizApi";

import StatCard from "./components/StatCard";
import QuizCard from "./components/QuizCard";
import QuizForm from "./components/QuizForm";
import AIGenerator from "./components/AIGenerator";
import EmptyState from "./components/EmptyState";
import TeacherCourseList from "@/components/teacher/TeacherCourseList";

export default function QuizManagementPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [draftQuiz, setDraftQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (selectedCourseId) {
      fetchQuizzes();
    }
  }, [selectedCourseId]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const { data } = await quizApi.getAll(selectedCourseId);
      console.log(data.data);
      
      setQuizzes(data.data);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedQuiz(null);
    setDraftQuiz(null);
    setActiveTab("create");
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab("edit");
  };

  const handleAIReview = (quiz) => {
    setDraftQuiz(quiz);
    setActiveTab("create");
  };

  const handleSuccess = () => {
    setDraftQuiz(null);
    fetchQuizzes();
    setActiveTab("list");
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || quiz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: quizzes?.length || 0,
    active: quizzes?.filter(q => q.status === "published")?.length || 0,
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Academic Assessment
          </span>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Quiz Management</h1>
          <p className="text-slate-500 mt-1">Create, manage and analyze quizzes for your course</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-indigo-100 text-indigo-600 hover:bg-indigo-50"
            onClick={() => setActiveTab("ai")}
          >
            <Sparkles className="w-4 h-4 mr-2" /> Generate with AI
          </Button>
          <Button 
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200"
            onClick={handleCreateNew}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Quiz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard 
          title="Total Quizzes" 
          value={stats.total.toString()} 
          trend="this month"
          icon={<FileText className="w-5 h-5" />}
          color="blue" 
        />
        <StatCard 
          title="Active Quizzes" 
          value={stats.active.toString()} 
          trend="published"
          icon={<CheckCircle className="w-5 h-5" />}
          color="green" 
        />
        <StatCard 
          title="Total Submissions" 
          value="847" 
          trend="+12%"
          icon={<Users className="w-5 h-5" />}
          color="purple" 
        />
        <StatCard 
          title="Avg Pass Rate" 
          value="78%" 
          trend="+4.2%"
          icon={<Trophy className="w-5 h-5" />}
          color="orange" 
        />
      </div>

      <div className="mb-10">
        <TeacherCourseList onCourseChange={(id) => setSelectedCourseId(id)} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl">
          <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-indigo-50">
            <LayoutGrid className="w-4 h-4 mr-2" /> Quiz List
          </TabsTrigger>
          <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-indigo-50">
            <Edit3 className="w-4 h-4 mr-2" /> Create Quiz
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-lg data-[state=active]:bg-indigo-50">
            <Brain className="w-4 h-4 mr-2" /> AI Generator
          </TabsTrigger>
          {selectedQuiz && (
            <TabsTrigger value="edit" className="rounded-lg data-[state=active]:bg-indigo-50">
              <Pencil className="w-4 h-4 mr-2" /> Edit Quiz
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Search quizzes..." 
                className="w-64 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><ListFilter className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="bg-slate-100"><LayoutGrid className="w-4 h-4" /></Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState 
              title={searchQuery || statusFilter !== "all" ? "No quizzes found" : "No quizzes yet"}
              description={searchQuery || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "Create your first quiz manually or use AI generator"}
              action={handleCreateNew}
              actionText="Create Quiz"
            />
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizCard 
                  key={quiz._id}
                  quiz={quiz}
                  onEdit={() => handleEditQuiz(quiz)}
                  onDelete={fetchQuizzes}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <QuizForm 
            key={draftQuiz ? "draft" : "new"}
            courseId={selectedCourseId}
            initialData={draftQuiz}
            isEdit={false}
            onSuccess={handleSuccess}
          />
        </TabsContent>

        <TabsContent value="ai">
          <AIGenerator 
            courseId={selectedCourseId}
            onSuccess={handleSuccess}
            onReview={handleAIReview}
            generating={generating}
            setGenerating={setGenerating}
          />
        </TabsContent>

        <TabsContent value="edit">
          {selectedQuiz && (
            <QuizForm 
              courseId={selectedCourseId}
              initialData={selectedQuiz}
              isEdit={true}
              onSuccess={handleSuccess}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}