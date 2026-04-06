import { useState } from 'react';
import { useUserQuery } from '@/queries/authQueries';
import { useSubmitVerification } from '@/mutations/verificationMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"; 
import { Plus, Loader2, Clock, BookOpen, Briefcase, FileCheck } from 'lucide-react';
import { toast } from "sonner";
// شلنا الـ useQueryClient من هنا عشان مش مستخدم

const PendingView = () => (
  <div className="min-h-[80vh] flex items-center justify-center p-6">
    <Card className="max-w-lg w-full rounded-3xl">
      <CardContent className="p-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock size={40} className="text-yellow-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Application Received</h2>
        <p className="text-gray-500">Your request is under review (24-48 hours)</p>
        <Button onClick={() => window.location.href = '/'}>Back Home</Button>
      </CardContent>
    </Card>
  </div>
);

const TeacherVerificationPage = () => {
  // شلنا تعريف queryClient من هنا
  const { data: user, isLoading } = useUserQuery();
  const teacherId = user?._id || user?.id;

  const { mutate, isPending, isSuccess } = useSubmitVerification();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    targetCategories: "",
    experiences: [{ title: '', organization: '', from: '', to: '', description: '' }],
    certificates: [{ file: null, issuedBy: '', year: '' }]
  });

  const handleArrayChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.targetCategories.trim()) {
        return toast.error("Please enter at least one category");
      }
    }

    if (step === 2) {
      const hasValidExp = formData.experiences.some(exp => exp.title.trim() !== "" && exp.from !== "");
      if (!hasValidExp) {
        return toast.error("Please add at least one complete experience (Title and Date)");
      }
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (e) => {
  e.preventDefault();

  // تأكيد إننا في آخر خطوة (الـ Certificates)
  if (step < 3) {
    nextStep();
    return;
  }

  try {
    const payload = {
      teacherId,
      targetCategories: formData.targetCategories.split(',')
        .map(s => s.trim())
        .filter(Boolean),
      experiences: formData.experiences
        .filter(exp => exp.title.trim() !== "" && exp.from !== "")
        .map(exp => ({
          ...exp,
          from: new Date(exp.from).toISOString(),
          to: exp.to ? new Date(exp.to).toISOString() : null
        })),
      certificates: formData.certificates.filter(c => c.file !== null)
    };

    if (payload.certificates.length === 0) {
      return toast.error("Please upload at least one certificate file");
    }

    mutate(payload);
  } catch {
    toast.error("Format error: Please check your dates and inputs.");
  }
};


  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (isSuccess || user?.verificationStatus === 'pending') return <PendingView />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Teacher Verification</h1>
      <Progress value={(step / 3) * 100} />

      <form onSubmit={onSubmit} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        <Card>
          <CardContent className="p-6 space-y-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen /> Categories</h2>
                <p className="text-sm text-gray-500">Note: Use names that exist in the system (e.g., Programming)</p>
                <Input 
                  placeholder="Programming, Design (comma separated)" 
                  value={formData.targetCategories}
                  onChange={(e) => setFormData({...formData, targetCategories: e.target.value})}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase /> Experience</h2>
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-xl space-y-3 bg-gray-50/50">
                    <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange('experiences', index, 'title', e.target.value)} />
                    <Input placeholder="Organization" value={exp.organization} onChange={(e) => handleArrayChange('experiences', index, 'organization', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <label className="text-xs font-medium">From</label>
                          <Input type="date" value={exp.from} onChange={(e) => handleArrayChange('experiences', index, 'from', e.target.value)} />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium">To (Optional)</label>
                          <Input type="date" value={exp.to} onChange={(e) => handleArrayChange('experiences', index, 'to', e.target.value)} />
                       </div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setFormData({...formData, experiences: [...formData.experiences, { title: '', organization: '', from: '', to: '', description: '' }]})}>
                  <Plus className="mr-2 h-4 w-4" /> Add Another Experience
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><FileCheck /> Certificates</h2>
                {formData.certificates.map((cert, index) => (
                  <div key={index} className="border p-4 rounded-xl space-y-3 bg-gray-50/50">
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Certificate File (Image or PDF)</label>
                      <Input type="file" onChange={(e) => handleArrayChange('certificates', index, 'file', e.target.files[0])} />
                    </div>
                    <Input placeholder="Issued By (e.g. Google, University)" value={cert.issuedBy} onChange={(e) => handleArrayChange('certificates', index, 'issuedBy', e.target.value)} />
                    <Input type="number" placeholder="Year" value={cert.year} onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)} />
                  </div>
                ))}
                <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => setFormData({...formData, certificates: [...formData.certificates, { file: null, issuedBy: '', year: '' }]})}>
                  <Plus className="mr-2 h-4 w-4" /> Add Another Certificate
                </Button>
              </div>
            )}
          </CardContent>

          <div className="p-6 flex justify-between border-t bg-gray-50/30">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
            
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>Next Step</Button>
            ) : (
              <Button type="submit" disabled={isPending} className="px-8">
                {isPending ? <Loader2 className="animate-spin mr-2" /> : "Submit Application"}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TeacherVerificationPage;