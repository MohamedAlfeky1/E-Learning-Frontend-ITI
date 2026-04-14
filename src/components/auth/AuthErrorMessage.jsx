import { FiAlertCircle } from "react-icons/fi";

const AuthErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm font-medium border-l-4 border-destructive flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
      <FiAlertCircle className="text-xl flex-shrink-0" />
      {message}
    </div>
  );
};

export default AuthErrorMessage;