import { MdOutlineMenuBook } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const EmptyCourseCard = () => {

    const navigate = useNavigate();
    return (
        <div
            className="flex flex-col items-center justify-center text-center p-8 rounded-2xl"
            style={{
                background: "var(--card)",
                border: "1.5px dashed var(--border)",
            }}
        >
            <MdOutlineMenuBook size={40} style={{ color: "var(--primary)", opacity: 0.6 }} />
            <h3 className="text-lg font-bold mt-3" style={{ color: "var(--foreground)" }}>
                No Courses Yet
            </h3>
            <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
                Start learning by enrolling in your first course 🚀
            </p>

            <button
                onClick={() => navigate("/browse-courses")}
                className="mt-4"
                style={{
                    background: "linear-gradient(135deg, #3525CD, #712AE2)",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: "600",
                    fontSize: "13px",
                }}
            >
                Browse Courses
            </button>
        </div>
    );
}

export default EmptyCourseCard;