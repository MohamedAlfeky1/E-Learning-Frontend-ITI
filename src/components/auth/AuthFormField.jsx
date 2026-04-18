import React from "react";
import { FiAlertCircle } from "react-icons/fi";
const AuthFormField = React.forwardRef(({ label, icon: Icon, error, rightElement, ...props }, ref) => {
  return (
    <div className="space-y-1.5 text-left w-full">
      <label className="block text-[13px] font-bold text-foreground/70 ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors z-10 
            ${error ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"}`}>
            <Icon />
          </div>
        )}
        
        <input
          ref={ref}
          {...props}
          className={`w-full h-12 bg-muted/30 border-2 rounded-xl transition-all outline-none pl-12 pr-4
            ${error 
              ? "border-destructive/50 focus:border-destructive bg-destructive/5" 
              : "border-transparent focus:border-primary focus:bg-background shadow-sm"}`}
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-destructive font-bold mt-1 ml-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <FiAlertCircle className="size-3" /> {error.message}
        </p>
      )}
    </div>
  );
});

AuthFormField.displayName = "AuthFormField";

export default AuthFormField;