import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useAdminVerificationDecision } from "@/mutations/adminMutations";
import { useFormik } from "formik";
import { useRef, useState } from "react";

const VerificationDecisionForm = ({ applicant }) => {
  const [decision, setDecision] = useState("");
  const [apiError, setApiError] = useState(null);
  const submitDecision = useAdminVerificationDecision();
  const closeRef = useRef(null);

  function handleSendDecision(values) {
    const payload = {
      ...values,
      teacherId: applicant.teacherId?._id,
      decidedAt: new Date().toISOString(),
    };
    submitDecision.mutate(payload, {
      onSuccess: () => closeRef.current?.click(),
      onError: (err) => setApiError(err.response?.data.message || "Invalid data"),
    });
  }

  const formik = useFormik({
    initialValues: { adminDecision: "", adminNote: "" },
    onSubmit: handleSendDecision,
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Approve / Reject toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => { setDecision("approved"); formik.setFieldValue("adminDecision", "approved"); }}
          className={`relative flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border-2 transition-all duration-150 active:scale-[0.98]
            ${decision === "approved"
              ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200"
              : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
            ${decision === "approved" ? "bg-white/30 text-white" : "bg-emerald-100 text-emerald-600"}`}>
            ✓
          </span>
          Approve
          {decision === "approved" && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-white/70" />
          )}
        </button>

        <button
          type="button"
          onClick={() => { setDecision("rejected"); formik.setFieldValue("adminDecision", "rejected"); }}
          className={`relative flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold border-2 transition-all duration-150 active:scale-[0.98]
            ${decision === "rejected"
              ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200"
              : "border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors
            ${decision === "rejected" ? "bg-white/30 text-white" : "bg-rose-100 text-rose-500"}`}>
            ✕
          </span>
          Reject
          {decision === "rejected" && (
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-white/70" />
          )}
        </button>
      </div>

      {/* Note textarea */}
      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5 block">
          Note to Applicant <span className="normal-case font-normal">(optional)</span>
        </label>
        <Textarea
          value={formik.values.adminNote}
          name="adminNote"
          onChange={formik.handleChange}
          placeholder="Add context or feedback for the applicant…"
          rows={3}
          className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-300 resize-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
        />
      </div>

      {/* API error */}
      {apiError && (
        <div className="flex items-center gap-2 bg-rose-50 ring-1 ring-rose-200 text-rose-600 text-xs rounded-xl px-3 py-2.5">
          <span className="text-base">⚠</span> {apiError}
        </div>
      )}

      {/* Submit */}
      <DrawerClose ref={closeRef} className="hidden" />
      <Button
        type="submit"
        onClick={() => formik.submitForm()}
        disabled={!decision || submitDecision.isPending}
        className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-150 active:scale-[0.98] shadow-sm
          ${!decision
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : decision === "approved"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
              : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
          }`}
      >
        {submitDecision.isPending
          ? "Submitting…"
          : decision === "approved"
            ? "✓ Confirm Approval"
            : decision === "rejected"
              ? "✕ Confirm Rejection"
              : "Submit Decision"}
      </Button>
    </div>
  );
};

export default VerificationDecisionForm;