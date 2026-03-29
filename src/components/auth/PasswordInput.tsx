import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  ringColor?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
  ringColor = "teal-600",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="auth-input-icon pointer-events-none" size={16} />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`auth-input !pr-12 sm:!pr-14 focus:ring-2 focus:ring-${ringColor}`}
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
