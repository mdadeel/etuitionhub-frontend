import { cn } from "@/lib/utils";

// Single source of truth for displaying a user's account role.
// The backend remains the authority: globalRole === 'super_admin' is the
// canonical admin signal; the legacy role:'admin' field is vestigial and
// only rendered for existing records that have not been migrated yet.
const ROLE_CONFIG = {
  super_admin: {
    label: "Super Admin",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  admin: {
    label: "Admin",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  tutor: {
    label: "Tutor",
    className: "bg-muted text-foreground border-border",
  },
  student: {
    label: "Student",
    className: "bg-muted text-muted-foreground border-transparent",
  },
};

const RoleBadge = ({ globalRole, role }) => {
  const config =
    globalRole === "super_admin"
      ? ROLE_CONFIG.super_admin
      : ROLE_CONFIG[role?.toLowerCase()] || ROLE_CONFIG.student;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg border whitespace-nowrap",
        config.className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
};

export default RoleBadge;
