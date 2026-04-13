import { FiAlertCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";

const AuthFormField = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  register,
  name,
  validation,
  rightElement,
}) => {
  return (
    <div className="group">
      <label
        className={`block text-sm font-semibold mb-1.5 ${
          error
            ? "text-destructive"
            : "text-muted-foreground group-focus-within:text-primary"
        }`}
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
        )}

        <Input
          type={type}
          placeholder={placeholder}
          className={`pl-12 ${
            rightElement ? "pr-12" : ""
          } transition-all ${
            error
              ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
              : "focus-visible:ring-primary"
          }`}
          {...register(name, validation)}
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive mt-1.5 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <FiAlertCircle /> {error.message}
        </p>
      )}
    </div>
  );
};

export default AuthFormField;