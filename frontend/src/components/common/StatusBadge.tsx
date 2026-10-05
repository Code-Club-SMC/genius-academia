import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  children?: React.ReactNode;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  paid: {
    bg: "bg-emerald-700",
    text: "text-white",
    label: "Paid",
  },
  pending: {
    bg: "bg-amber-600",
    text: "text-white",
    label: "Pending",
  },
  partial: {
    bg: "bg-orange-600",
    text: "text-white",
    label: "Partial",
  },
  active: {
    bg: "bg-emerald-700",
    text: "text-white",
    label: "Active",
  },
  inactive: {
    bg: "bg-slate-500",
    text: "text-white",
    label: "Inactive",
  },
  success: {
    bg: "bg-emerald-700",
    text: "text-white",
    label: "Success",
  },
  warning: {
    bg: "bg-amber-600",
    text: "text-white",
    label: "Warning",
  },
  default: {
    bg: "bg-slate-500",
    text: "text-white",
    label: "Default",
  },
  upcoming: {
    bg: "bg-blue-600",
    text: "text-white",
    label: "Upcoming",
  },
  completed: {
    bg: "bg-slate-600",
    text: "text-white",
    label: "Completed",
  },
  withdrawn: {
    bg: "bg-rose-700",
    text: "text-white",
    label: "Withdrawn",
  },
  overdue: {
    bg: "bg-rose-700",
    text: "text-white",
    label: "Overdue",
  },
  suspended: {
    bg: "bg-rose-700",
    text: "text-white",
    label: "Suspended",
  },
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();
  const styles = statusStyles[normalized] || {
    bg: "bg-slate-600",
    text: "text-white",
    label: status || "Unknown",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-none select-none",
        styles.bg,
        styles.text
      )}
    >
      {children || styles.label}
    </span>
  );
}
