interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const rules: PasswordRule[] = [
  { label: "8+ chars", test: (pw) => pw.length >= 8 },
  { label: "uppercase", test: (pw) => /[A-Z]/.test(pw) },
  { label: "lowercase", test: (pw) => /[a-z]/.test(pw) },
  { label: "number", test: (pw) => /[0-9]/.test(pw) },
  { label: "symbol", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export function validatePassword(password: string): string | null {
  for (const rule of rules) {
    if (!rule.test(password)) return rule.label;
  }
  return null;
}

export function isPasswordValid(password: string): boolean {
  return rules.every((r) => r.test(password));
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const passed = rules.filter((r) => r.test(password)).length;
  const ratio = passed / rules.length;
  const missing = rules.filter((r) => !r.test(password));

  const barColor =
    ratio <= 0.4 ? "bg-red-500" : ratio <= 0.7 ? "bg-amber-500" : "bg-green-500";

  const label =
    ratio <= 0.4 ? "Weak" : ratio <= 0.7 ? "Fair" : ratio < 1 ? "Good" : "Strong";

  const textColor =
    ratio <= 0.4
      ? "text-red-500"
      : ratio <= 0.7
        ? "text-amber-500"
        : "text-green-500";

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="flex-grow h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${textColor}`}>
          {label}
        </span>
      </div>
      {missing.length > 0 && (
        <p className="text-[11px] text-neutral-400">
          Needs: {missing.map((r) => r.label).join(", ")}
        </p>
      )}
    </div>
  );
}
