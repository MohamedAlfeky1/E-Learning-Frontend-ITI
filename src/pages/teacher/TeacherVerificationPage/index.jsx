import { useState } from 'react';
import { useUserQuery } from '@/queries/authQueries';
import { useSubmitVerification } from '@/mutations/verificationMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"; 
import { Plus, Loader2, Clock, BookOpen, Briefcase, FileCheck } from 'lucide-react';
import { toast } from "sonner";
import { useLogout } from "@/hooks/useLogout";

const PendingView = () => {
  const logout = useLogout();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <Card className="max-w-lg w-full rounded-[2.5rem] shadow-2xl border-none text-center p-12 bg-white">
        <CardContent className="space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-200 blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100">
                <Clock size={56} className="text-amber-600" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-800">Review in Progress</h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Your application for <span className="font-bold text-primary">Nexora</span> is being verified. 
              This usually takes <span className="font-bold text-slate-700">24-48 hours</span>.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-2xl px-10 py-6 border-2 hover:bg-slate-50 text-slate-600 font-bold"
            onClick={logout}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const TeacherVerificationPage = () => {
  const { data: user, isLoading } = useUserQuery();
  const { mutate, isPending, isSuccess } = useSubmitVerification();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    targetCategories: "",
    experiences: [{ title: '', organization: '', from: '', to: '', description: '' }],
    certificates: [{ file: null, issuedBy: '', year: '' }]
  });

  if (isSuccess || (user?.status === 'pending' && user?.status !== 'new')) {
    return <PendingView />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

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
      const hasInvalidExp = formData.experiences.some(
        exp => !exp.title.trim() || !exp.organization.trim() || !exp.from
      );
      if (hasInvalidExp) {
        return toast.error("Please fill in Job Title, Organization, and Start Date.");
      }
    }

    if (step === 3) {
      const hasFile = formData.certificates.some(cert => cert.file !== null);
      if (!hasFile) {
        return toast.error("Please upload at least one certificate file.");
      }
    }

    setStep(prev => prev + 1);
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = (e) => {
    e.preventDefault();
    
    const cleanedExperiences = formData.experiences.filter(
      exp => exp.title.trim() !== "" && exp.organization.trim() !== "" && exp.from !== ""
    );

    const validCertificates = formData.certificates.filter(cert => cert.file !== null);

    if (cleanedExperiences.length === 0) {
      return toast.error("Please add at least one complete experience.");
    }

    if (validCertificates.length === 0) {
      return toast.error("Please upload at least one certificate.");
    }

    mutate({
      teacherId: user?.id || user?._id,
      targetCategories: formData.targetCategories.split(',').map(s => s.trim()).filter(Boolean),
      experiences: cleanedExperiences, 
      certificates: validCertificates
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-800">Teacher Verification</h1>
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium text-gray-500 px-2">
          <span>Step {step} of 3</span>
          <span>{Math.round((step / 3) * 100)}% Complete</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-3 rounded-full" />
      </div>

      <form onSubmit={onSubmit}>
        <Card className="shadow-lg rounded-2xl overflow-hidden border-none bg-white/50 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">

            {/* STEP 1: Categories */}
            {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
                  <BookOpen className="text-primary" /> Categories
                </h2>
                <p className="text-sm text-gray-500">Enter the subjects you want to teach (separated by commas).</p>
                <Input
                  placeholder="e.g. Programming, Graphic Design, Mathematics"
                  value={formData.targetCategories}
                  onChange={(e) => setFormData({ ...formData, targetCategories: e.target.value })}
                />
              </div>
            )}

            {/* STEP 2: Experience */}
            {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
                  <Briefcase className="text-primary" /> Experience
                </h2>
                {formData.experiences.map((exp, index) => (
                  <div key={index} className="border p-4 rounded-xl space-y-3 bg-gray-50 relative group">
                    <Input placeholder="Job Title" value={exp.title} onChange={(e) => handleArrayChange('experiences', index, 'title', e.target.value)} />
                    <Input placeholder="Organization" value={exp.organization} onChange={(e) => handleArrayChange('experiences', index, 'organization', e.target.value)} />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">From</label>
                        <Input type="date" value={exp.from} onChange={(e) => handleArrayChange('experiences', index, 'from', e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 ml-1">To (Optional)</label>
                        <Input type="date" value={exp.to} onChange={(e) => handleArrayChange('experiences', index, 'to', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed py-6"
                  onClick={() => setFormData({ ...formData, experiences: [...formData.experiences, { title: '', organization: '', from: '', to: '', description: '' }] })}
                >
                  <Plus size={18} className="mr-2" /> Add More Experience
                </Button>
              </div>
            )}

            {/* STEP 3: Certificates */}
            {step === 3 && (
              <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-700">
                  <FileCheck className="text-primary" /> Certificates
                </h2>
                {formData.certificates.map((cert, index) => (
                  <div key={index} className="border p-4 rounded-xl space-y-3 bg-gray-50">
                    <div className="bg-white p-4 rounded-lg border-2 border-dashed text-center hover:border-primary transition-colors">
                        <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="cursor-pointer"
                        onChange={(e) => handleArrayChange('certificates', index, 'file', e.target.files[0])} 
                      />
                      {cert.file && <p className="text-xs text-green-600 mt-2 font-medium">Selected: {cert.file.name}</p>}
                    </div>
                    <Input placeholder="Issued By (e.g. Google, University)" value={cert.issuedBy} onChange={(e) => handleArrayChange('certificates', index, 'issuedBy', e.target.value)} />
                    <Input type="number" placeholder="Year" value={cert.year} onChange={(e) => handleArrayChange('certificates', index, 'year', e.target.value)} />
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed py-6"
                  onClick={() => setFormData({ ...formData, certificates: [...formData.certificates, { file: null, issuedBy: '', year: '' }] })}
                >
                  <Plus size={18} className="mr-2" /> Add Another Certificate
                </Button>
              </div>
            )}

          </CardContent>

          {/* Footer Navigation */}
          <div className="p-6 flex justify-between bg-gray-50 border-t">
            <Button type="button" onClick={prevStep} disabled={step === 1} variant="ghost">Back</Button>
            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="px-8 font-bold">Next Step</Button>
            ) : (
              <Button type="submit" disabled={isPending} className="px-10 font-bold">
                {isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TeacherVerificationPage;