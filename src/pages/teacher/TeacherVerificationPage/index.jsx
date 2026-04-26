import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserQuery } from "@/queries/authQueries";
import { useSubmitVerification } from "@/mutations/verificationMutations";
import { useCategories } from "@/queries/categoryQueries";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Loader2,
  Clock,
  BookOpen,
  Briefcase,
  FileCheck,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";

import { toast } from "sonner";
import { useLogout } from "@/hooks/useLogout";

const PendingView = () => {
  const logout = useLogout();

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-5"
      dir="ltr"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <Card className="w-full max-w-[380px] sm:max-w-[420px] border-border/40 shadow-xl bg-card/70 backdrop-blur-2xl rounded-3xl relative z-10">
        <div className="h-1.5 bg-muted/40">
          <div className="h-full bg-primary w-[65%] animate-pulse" />
        </div>

        <CardContent className="p-6 sm:p-7 text-center space-y-6">
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 bg-primary/15 rounded-full animate-ping duration-[3s]" />
            <div className="relative w-20 h-20 bg-card rounded-full border border-border/50 flex items-center justify-center">
              <Clock size={34} className="text-primary animate-spin-slow" />
            </div>
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-primary/20 text-primary bg-primary/5 text-[10px] uppercase tracking-widest px-3 py-0.5"
            >
              Review Stage
            </Badge>

            <h2 className="text-2xl font-bold text-foreground">
              Processing...
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              Your profile is under review. You’ll be joining{" "}
              <span className="text-primary font-medium">Nexura</span> soon.
            </p>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-muted/20 border border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1 gap-1.5">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Applied
                </span>
              </div>

              <div className="w-6 h-[1px] bg-border" />
              <div className="flex flex-col items-center flex-1 gap-1.5">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                  <Loader2 size={15} className="animate-spin" />
                </div>
                <span className="text-[10px] font-semibold text-primary">
                  Review
                </span>
              </div>

              <div className="w-6 h-[1px] bg-border" />

              <div className="flex flex-col items-center flex-1 gap-1.5 opacity-40">
                <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Briefcase size={13} />
                </div>
                <span className="text-[10px] text-muted-foreground">Teach</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="py-2 px-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground">
                Estimated time: 24h - 48h
              </p>
            </div>

            <Button
              variant="ghost"
              className="w-full h-11 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const TeacherVerificationPage = () => {
  const { data: user, isLoading } = useUserQuery();
  const { mutate, isPending } = useSubmitVerification();
  const { data: catData } = useCategories();

  const categories = catData?.data ?? [];
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    targetCategories: [],
    experiences: [
      {
        title: "",
        organization: "",
        from: "",
        to: "",
        currentlyWorking: false,
      },
    ],
    certificates: [{ file: null, issuedBy: "", year: "" }],
  });

  const steps = [
    { id: 1, label: "Specialization", icon: BookOpen },
    { id: 2, label: "Experience", icon: Briefcase },
    { id: 3, label: "Documents", icon: FileCheck },
  ];

  useEffect(() => {
    if (user?.role === "teacher" && user?.status === "active") {
      navigate("/teacher/dashboard", { replace: true });
    }
  }, [user, navigate]);
  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 LTR"
        dir="ltr"
      >
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground animate-pulse">
          Loading Nexura Portal...
        </p>
      </div>
    );
  }

  if (user?.status === "pending") return <PendingView />;

  const handleArrayChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    if (field === "currentlyWorking" && value === true) updated[index].to = "";
    setFormData({ ...formData, [type]: updated });
  };

  const nextStep = () => {
    if (step === 1 && formData.targetCategories.length === 0) {
      return toast.error("Please select at least one category");
    }

    if (step === 2) {
      const valid = formData.experiences.filter(
        (e) => e.title || e.organization || e.from,
      );

      const invalid = valid.some((e) => !e.title || !e.organization || !e.from);

      if (invalid) {
        return toast.error("Please fill all required experience fields");
      }

      if (valid.length === 0) {
        return toast.error("Please add at least one experience");
      }
    }
    if (step === 3) {
      const validCerts = formData.certificates.filter(
        (c) => c.file || c.issuedBy || c.year,
      );

      const invalid = validCerts.some((c) => !c.file || !c.issuedBy || !c.year);

      if (invalid) {
        return toast.error("Please complete all certificate fields");
      }

      if (validCerts.length === 0) {
        return toast.error("Please add at least one certificate");
      }
    }

    setStep((p) => p + 1);
  };
  const onSubmit = () => {
    const teacherId = user?.id || user?._id || user?.data?._id;
    if (!teacherId) return toast.error("User identity not found");

    const startedCerts = formData.certificates.filter(
      (c) => c.file || c.issuedBy || c.year,
    );

    const invalid = startedCerts.some((c) => !c.file || !c.issuedBy || !c.year);

    if (invalid) {
      return toast.error("Please complete all certificate fields");
    }

    if (startedCerts.length === 0) {
      return toast.error("Upload at least one certificate");
    }

    const data = new FormData();
    data.append("teacherId", teacherId);
    data.append("targetCategories", JSON.stringify(formData.targetCategories));
    data.append(
      "experiences",
      JSON.stringify(formData.experiences.filter((exp) => exp.title)),
    );

    data.append(
      "certificateData",
      JSON.stringify(
        startedCerts.map((c) => ({
          issuedBy: c.issuedBy,
          year: c.year,
        })),
      ),
    );

    startedCerts.forEach((cert) => data.append("certificates", cert.file));

    mutate(data);
  };

  return (
    <div
      className="min-h-screen bg-slate-50/50 py-10 px-4 font-sans text-left LTR"
      dir="ltr"
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge
            variant="outline"
            className="px-4 py-1 border-primary/30 text-primary bg-primary/5"
          >
            Teacher Onboarding
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Join{" "}
            <span className="text-primary bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Nexura
            </span>{" "}
            Faculty
          </h1>
          <p className="text-slate-500 text-lg italic">
            Share your expertise with eager students.
          </p>
        </div>

        <div className="relative flex justify-between items-center px-2 max-w-xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2" />
          <div
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 -translate-y-1/2 transition-all duration-500"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s) => (
            <div
              key={s.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  step >= s.id
                    ? "bg-white border-primary text-primary shadow-lg ring-4 ring-primary/10"
                    : "bg-slate-100 border-slate-300 text-slate-400"
                }`}
              >
                {step > s.id ? (
                  <CheckCircle2 size={20} className="fill-primary text-white" />
                ) : (
                  <s.icon size={18} />
                )}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${step >= s.id ? "text-slate-900" : "text-slate-400"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-none shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="h-1.5 w-full bg-slate-100">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <CardContent className="p-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-3">
                    <BookOpen className="text-primary" size={20} />
                    <h2 className="text-xl font-bold text-slate-800">
                      Select Your Specialization
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const selected = formData.targetCategories.includes(
                        cat.name,
                      );
                      return (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              targetCategories: selected
                                ? prev.targetCategories.filter(
                                    (n) => n !== cat.name,
                                  )
                                : [...prev.targetCategories, cat.name],
                            }))
                          }
                          className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                            selected
                              ? "border-primary bg-primary/5 text-primary shadow-inner"
                              : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full absolute top-3 right-3 ${selected ? "bg-primary animate-pulse" : "bg-slate-200"}`}
                          />
                          <span className="font-semibold text-sm">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-3 duration-400 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-primary" size={20} />
                      <h2 className="text-xl font-bold text-slate-800">
                        Teaching Experience
                      </h2>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          experiences: [
                            ...p.experiences,
                            { title: "", organization: "", from: "" },
                          ],
                        }))
                      }
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </Button>
                  </div>
                  {formData.experiences.map((exp, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl border bg-slate-50/50 relative hover:bg-white transition-all space-y-3"
                    >
                      {i > 0 && (
                        <button
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              experiences: p.experiences.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Job Title (e.g. Math Tutor)"
                          value={exp.title}
                          onChange={(e) =>
                            handleArrayChange(
                              "experiences",
                              i,
                              "title",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Organization (e.g. Nexura School)"
                          value={exp.organization}
                          onChange={(e) =>
                            handleArrayChange(
                              "experiences",
                              i,
                              "organization",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 items-center">
                        <Input
                          type="date"
                          value={exp.from}
                          onChange={(e) =>
                            handleArrayChange(
                              "experiences",
                              i,
                              "from",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          type="date"
                          value={exp.to}
                          disabled={exp.currentlyWorking}
                          onChange={(e) =>
                            handleArrayChange(
                              "experiences",
                              i,
                              "to",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer pl-1">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                          checked={exp.currentlyWorking}
                          onChange={(e) =>
                            handleArrayChange(
                              "experiences",
                              i,
                              "currentlyWorking",
                              e.target.checked,
                            )
                          }
                        />
                        I currently work here
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-3 duration-400 space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <FileCheck className="text-primary" size={20} />
                    <h2 className="text-xl font-bold text-primary-800">
                      Upload Documents
                    </h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-primary-800">
                      Upload Documents
                    </h2>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={formData.certificates.length >= 3}
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          certificates: [
                            ...p.certificates,
                            { file: null, issuedBy: "", year: "" },
                          ],
                        }))
                      }
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  {formData.certificates.map((cert, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 space-y-3 relative group transition-colors hover:border-primary/50"
                    >
                      {i > 0 && (
                        <button
                          type="button"
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              certificates: p.certificates.filter(
                                (_, idx) => idx !== i,
                              ),
                            }))
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-lg bg-white relative transition-colors hover:bg-slate-50">
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) =>
                            handleArrayChange(
                              "certificates",
                              i,
                              "file",
                              e.target.files[0],
                            )
                          }
                        />
                        <UploadCloud
                          className={
                            cert.file
                              ? "text-green-500"
                              : "text-slate-400 group-hover:text-primary"
                          }
                          size={28}
                        />
                        <span className="text-xs mt-2 font-medium text-center truncate w-full px-2">
                          {cert.file
                            ? cert.file.name
                            : "Click or drag certificate (PDF, JPG, PNG)"}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Issued By (e.g. University)"
                          value={cert.issuedBy}
                          onChange={(e) =>
                            handleArrayChange(
                              "certificates",
                              i,
                              "issuedBy",
                              e.target.value,
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Year"
                          value={cert.year}
                          onChange={(e) =>
                            handleArrayChange(
                              "certificates",
                              i,
                              "year",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </CardContent>

          <div className="p-6 bg-slate-50/80 border-t flex justify-between items-center px-8">
            <Button
              variant="ghost"
              onClick={() => setStep((p) => p - 1)}
              disabled={step === 1}
              className="text-slate-600 hover:bg-slate-200"
            >
              <ChevronLeft size={18} /> Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={nextStep}
                className="px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                Next <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                onClick={onSubmit}
                disabled={isPending}
                className="px-10 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-violet-500/20"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <CheckCircle2 className="mr-2" size={18} />
                )}
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherVerificationPage;
