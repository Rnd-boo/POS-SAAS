import { cn } from "@/lib/utils";

interface StatusSwitchProps {
  value: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function StatusSwitch({
  value,
  onChange,
  disabled = false,
  className,
}: StatusSwitchProps) {
  const track = cn(
    className,
    "relative inline-flex h-8 w-37 shrink-0 items-center rounded-full border transition-colors",
    disabled ? "cursor-default " : "cursor-pointer",
    value ? "bg-muted" : "bg-none",
  );

  const label = cn(
    "absolute left-4 text-sm transition-transform duration-300 ease-in-out font-medium",
    value ? "translate-x-0 " : "translate-x-[76px]",
  );

  const pill = cn(
    "rounded-full h-full px-4 py-1 text-sm text-white transition-all duration-300 ease-in-out",
    value ? "translate-x-[76px] bg-green-600" : "translate-x-0 bg-destructive",
  );

  const content = (
    <>
      <span className={label}>Status</span>
      <span className={pill}>{value ? "Active" : "Inactive"}</span>
    </>
  );

  if (disabled) {
    return (
      <div
        className={track}
        role="switch"
        aria-checked={value}
        aria-label={value ? "Active" : "Inactive"}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className={track}
      onClick={() => onChange?.(!value)}
    >
      {content}
    </button>
  );
}
