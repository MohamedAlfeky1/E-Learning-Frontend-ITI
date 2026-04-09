import { Input } from "../../../components/ui/input";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { useAdminVerificationDecision } from "@/mutations/adminMutations";
import { useUserQuery } from "@/queries/authQueries";
import { useFormik } from "formik";
import { useRef, useState } from "react";

const VerificationDecisionForm = ({ applicant }) => {
    const [decision, setDecision] = useState("");
    const [apiError, setApiError] = useState(null);
    const submitDecision = useAdminVerificationDecision();
    
    const closeRef = useRef(null)

    function handleSendDecision(values) {
        console.log(values);
        const payload = {
            ...values,
            teacherId: applicant.teacherId?._id,
            decidedAt: new Date().toISOString(),
        }

        submitDecision.mutate(payload, {
            onSuccess: ()=>closeRef.current?.click(),
            onError: (err) => {
                setApiError(err.response?.data.message || "Invalid data")
            }
        })
    }

    let formik = useFormik({
        initialValues: {
            adminDecision: '',
            adminNote: '',
        },
        onSubmit: handleSendDecision
    })




    return (
        <div className="flex flex-col gap-3">

            {/* Approve / Reject toggle */}


            {/* Optional note */}
            <textarea
                value={formik.values.adminNote}
                name="adminNote"
                onChange={formik.handleChange}
                placeholder="Add a note for the applicant (optional)..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#4338CA]/30"
                rows={3}
            />

            <div className="flex justify-between items-center w-full gap-2">
                <Input type='button' variant="success"
                    value='✓ Approve'
                    placeholder='✓ Approve'
                    name='adminDecision'
                    onClick={() => {
                        setDecision("approved")
                        formik.setFieldValue("adminDecision", "approved");
                    }
                    }
                    className={`bg-[#065F2C] text-white hover:bg-[#065F2C]/90 shadow-sm flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors `}
                />


                <Input type='button' variant="destructive"
                    value='✕ Reject'
                    placeholder='✕ Reject'
                    name='adminDecision'
                    onClick={() => {
                        setDecision("rejected")
                        formik.setFieldValue("adminDecision", "rejected");
                    }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors
            bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 `}
                />
            </div>

            {/* Submit */}
            <DrawerClose ref={closeRef} className="hidden"/>
                <Button
                    type="submit"
                    onClick={() => formik.submitForm()}
                    disabled={!decision}
                    className="w-full bg-[#4338CA] hover:bg-[#3730A3] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors"
                >
                    Submit Decision
                </Button>
        </div>
    );
};

export default VerificationDecisionForm;
