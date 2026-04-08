import { useState } from 'react';
import { useUserQuery } from '@/queries/authQueries';
import { useSubmitVerification } from '@/mutations/verificationMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"; 
import { Plus, Trash2, BookOpen, Briefcase, FileCheck, Loader2, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

const PendingView = () => (
  <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in duration-500">
    <Card className="max-w-lg w-full border-none shadow-2xl shadow-purple-100/50 rounded-3xl overflow-hidden">
      <CardContent className="p-12 text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-25"></div>
          <div className="relative flex items-center justify-center w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full">
            <Clock size={48} className="animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Application Received!</h2>
          <p className="text-gray-500 font-medium px-4">
            Your professional profile is now under review by our academic board.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-600"><span className="font-bold">Status:</span> Pending Review</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-600"><span className="font-bold">Timeline:</span> 24-48 hours.</p>
          </div>
        </div>

        <Button 
          onClick={() => window.location.href = '/'} 
          className="w-full bg-gray-900 hover:bg-black text-white h-14 rounded-2xl font-bold transition-all"
        >
          Back to Home
        </Button>
      </CardContent>
    </Card>
  </div>
);

const TeacherVerificationPage = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUserQuery();
  const teacherId = user?._id || user?.id;
  const { mutate, isPending: isSubmitting, isSuccess: mutationSuccess } = useSubmitVerification({
    onSuccess: async () => {
      toast.success("Verification Request Sent Successfully!");
      await queryClient.refetchQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || "";
      if (errorMsg.includes("duplicate") || error.response?.status === 400) {
        toast.info("You already have a pending application.");
        queryClient.refetchQueries({ queryKey: ['user'] });
      } else {
        toast.error("Something went wrong, please try again.");
      }
    }
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    targetCategories: "",
    experiences: [{ title: '', organization: '', from: '', to: '', description: '' }],
    certificates: [{ title: '', fileUrl: '', issuedBy: '', year: '' }]
  });

  const handleArrayChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const nextStep = (e) => {
    if(e) e.preventDefault();
    if (currentStep === 1 && !formData.targetCategories.trim()) {
        return toast.error("Please add at least one category");
    }
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = (e) => {
    if(e) e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const payload = {
      teacherId,
      targetCategories: formData.targetCategories.split(',').map(s => s.trim()),
      experiences: formData.experiences.map(exp => ({ ...exp, from: new Date(exp.from).toISOString(), to: new Date(exp.to).toISOString() })),
      certificates: formData.certificates
    };

    mutate(payload);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (mutationSuccess || user?.verificationStatus === 'pending') {
    return <PendingView />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-6 animate-in fade-in duration-700">

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
          Verify Your <span className="text-purple-600">Mentor</span> Profile
        </h1>
        <div className="max-w-xs mx-auto pt-2">
          <Progress value={(currentStep / totalSteps) * 100} className="h-2 bg-purple-100" />
          <p className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest text-center">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card className="border-none shadow-2xl shadow-purple-100/50 bg-white rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            
            {currentStep === 1 && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl"><BookOpen size={24}/></div>
                  <h2 className="text-2xl font-bold">Target Categories</h2>
                </div>
                <Input 
                  placeholder="e.g. Programming, Graphic Design"
                  value={formData.targetCategories}
                  onChange={(e) => setFormData({...formData, targetCategories: e.target.value})}
                  className="h-14 rounded-2xl text-lg px-6"
                />
              </section>
            )}

            {currentStep === 2 && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Briefcase size={24}/></div>
                    <h2 className="text-2xl font-bold">Work Experience</h2>
                  </div>
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setFormData({...formData, experiences: [...formData.experiences, {title:'', organization:'', from:'', to:'', description:''}]})}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="p-6 border border-gray-100 rounded-2xl space-y-4 bg-gray-50/30 relative">
                    <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange('experiences', index, 'title', e.target.value)} className="rounded-xl" />
                    <Input placeholder="Organization" value={exp.organization} onChange={(e) => handleArrayChange('experiences', index, 'organization', e.target.value)} className="rounded-xl" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="date" value={exp.from} onChange={(e) => handleArrayChange('experiences', index, 'from', e.target.value)} className="rounded-xl" />
                      <Input type="date" value={exp.to} onChange={(e) => handleArrayChange('experiences', index, 'to', e.target.value)} className="rounded-xl" />
                    </div>
                  </div>
                ))}
              </section>
            )}

            {currentStep === 3 && (
              <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><FileCheck size={24}/></div>
                    <h2 className="text-2xl font-bold">Certificates</h2>
                  </div>
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => setFormData({...formData, certificates: [...formData.certificates, {title:'', fileUrl:'', issuedBy:'', year:''}]})}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {formData.certificates.map((cert, index) => (
                  <div key={index} className="p-6 border border-gray-100 rounded-2xl space-y-4 bg-gray-50/30">
                    <Input placeholder="Certificate Title" value={cert.title} onChange={(e) => handleArrayChange('certificates', index, 'title', e.target.value)} className="rounded-xl" />
                    <Input placeholder="Credential URL" value={cert.fileUrl} onChange={(e) => handleArrayChange('certificates', index, 'fileUrl', e.target.value)} className="rounded-xl" />
                  </div>
                ))}
              </section>
            )}

          </CardContent>

          <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="rounded-2xl px-8">Back</Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl px-10 py-6 font-bold shadow-lg shadow-purple-200">Continue</Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="bg-green-600 hover:bg-green-700 text-white rounded-2xl px-12 py-6 font-bold min-w-[180px] shadow-lg shadow-green-200"
              >
                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Finish & Submit"}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TeacherVerificationPage;
