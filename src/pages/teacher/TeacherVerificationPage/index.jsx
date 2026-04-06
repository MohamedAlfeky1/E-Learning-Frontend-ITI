import { useState } from 'react';
import { useUserQuery } from '@/queries/authQueries';
import { useSubmitVerification } from '@/mutations/verificationMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"; 
import { Plus, Loader2, Clock, BookOpen, Briefcase, FileCheck } from 'lucide-react';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
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
    if (step === 1 && !formData.targetCategories.trim()) {
      return toast.error("Enter at least one category");
    }
    // في الخطوة 2، ممكن تضيفي شرط لو عاوزه يتأكد إن فيه خبرة قبل ما ينقل لخطوة 3
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (e) => {
    e.preventDefault();
    
    // أهم تعديل: لا تنفذ الـ Validation والـ Submit إلا لو في الخطوة 3
    if (step !== 3) return; 

    try {
      const payload = {
        teacherId,
        targetCategories: formData.targetCategories.split(',').map(s => s.trim()).filter(Boolean),
        experiences: formData.experiences
          .filter(exp => exp.title.trim() !== "" && exp.from !== "")
          .map(exp => ({
            ...exp,
            from: new Date(exp.from).toISOString(),
            to: exp.to ? new Date(exp.to).toISOString() : null
          })),
        certificates: formData.certificates.filter(c => c.file !== null)
      };

      // الـ Validation بيحصل هنا بس
      if (payload.experiences.length === 0) {
        return toast.error("Please add at least one complete experience");
      }
      if (payload.certificates.length === 0) {
        return toast.error("Please upload at least one certificate file");
      }

      mutate(payload);
    } catch {
      toast.error("Invalid data format. Please check your inputs.");
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
                  <div key={index} className="border p-4 rounded space-y-2">
                    <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange('experiences', index, 'title', e.target.value)} />
                    <Input placeholder="Organization" value={exp.organization} onChange={(e) => handleArrayChange('experiences', index, 'organization', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                       <div><label className="text-xs">From</label><Input type="date" value={exp.from} onChange={(e) => handleArrayChange('experiences', index, 'from', e.target.value)} /></div>
                       <div><label className="text-xs">To</label><Input type="date" value={exp.to} onChange={(e) => handleArrayChange('experiences', index, 'to', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setFormData({...formData, experiences: [...formData.experiences, { title: '', organization: '', from: '', to: '', description: '' }]})}>
                  <Plus className="mr-2 h-4 w-4" /> Add Experience
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2"><FileCheck /> Certificates</h2>
                {formData.certificates.map((cert, index) => (
                  <div key={index} className="border p-4 rounded space-y-2">
                    <Input type="file" onChange={(e) => handleArrayChange('certificates', index, 'file', e.target.files[0])} />
                    <Input placeholder="Issued By" value={cert.issuedBy} onChange={(e) => handleArrayChange('certificates', index, 'issuedBy', e.target.value)} />
                    <Input type="number" placeholder="Year" value={cert.year} onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)} />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setFormData({...formData, certificates: [...formData.certificates, { file: null, issuedBy: '', year: '' }]})}>
                  <Plus className="mr-2 h-4 w-4" /> Add Certificate
                </Button>
              </div>
            )}
          </CardContent>

          <div className="p-6 flex justify-between border-t">
            {/* الأزرار هنا واخدة type="button" عشان متعملش سابميت غلط */}
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1}>Back</Button>
            
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" disabled={isPending}>
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