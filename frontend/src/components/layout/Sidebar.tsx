import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  CalendarClock,
  GraduationCap,
  Phone,
  Banknote,
  ClipboardList,
  Armchair,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

// Logo: Use src/assets/logo.png if available, fallback to public/logo.png
const logoSrc = "/logo.png";

// Navigation items with permission keys - SRS 2.0 Compliant
// KEPT: Dashboard, Admissions, Students, Teachers, Finance, Classes, Timetable, Sessions, Configuration, Payroll
const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    permission: "dashboard",
  },
  {
    icon: UserPlus,
    label: "Admissions",
    path: "/admissions",
    permission: "admissions",
  },
  {
    icon: ClipboardList,
    label: "Registrations",
    path: "/registrations",
    permission: "registrations",
  },
  { icon: Users, label: "Students", path: "/students", permission: "students" },
  {
    icon: GraduationCap,
    label: "Teachers",
    path: "/teachers",
    permission: "teachers",
  },
  {
    icon: DollarSign,
    label: "Finance",
    path: "/finance",
    permission: "finance",
  },
  { icon: BookOpen, label: "Classes", path: "/classes", permission: "classes" },
  {
    icon: Armchair,
    label: "Seat Management",
    path: "/seat-management",
    permission: "seat_management",
  },
  {
    icon: Clock,
    label: "Timetable",
    path: "/timetable",
    permission: "timetable",
  },
  {
    icon: CalendarClock,
    label: "Sessions",
    path: "/sessions",
    permission: "sessions",
  },
  {
    icon: Phone,
    label: "Inquiries",
    path: "/leads",
    permission: "inquiries",
  },
  {
    icon: Banknote,
    label: "Payroll",
    path: "/payroll",
    permission: "payroll",
    ownerOnly: true,
  },
  {
    icon: Settings,
    label: "Configuration",
    path: "/configuration",
    permission: "configuration",
    ownerOnly: true,
  },
];

export function Sidebar() {
  const { collapsed, mobileOpen, setCollapsed, setMobileOpen } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();

  // Get user permissions (OWNER gets all permissions automatically)
  const userPermissions = user?.permissions || ["dashboard"];
  const isOwner = user?.role === "OWNER";

  // Filter nav items based on user permissions and role
  const filteredNavItems = navItems.filter((item) => {
    // OWNER bypasses all permission checks
    if (isOwner) return true;

    // ownerOnly items are restricted to OWNER role
    if (item.ownerOnly) return false;

    // Check if user has permission for this item
    return userPermissions.includes(item.permission);
  });

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-sidebar border-r border-sidebar-border/40 transition-all duration-300 ease-in-out flex flex-col",
          // Desktop: show always, respect collapse state
          "hidden md:flex",
          collapsed ? "md:w-14" : "md:w-56",
          // Mobile: show/hide via mobileOpen
          mobileOpen && "!flex w-56",
        )}
      >
        {/* Mobile close button */}
        <button
          className="absolute right-2 top-2.5 md:hidden flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Zone 1: Header (shrink-0) */}
        <div className="shrink-0 border-b border-sidebar-border/50 px-3 py-3">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <img
                src={logoSrc}
                alt="Genius Islamian's Academy"
                className="h-9 w-9 object-contain shrink-0 rounded-full border border-red-500/30 p-0.5 bg-black/40 shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-[13px] font-bold text-white tracking-tight leading-none truncate">
                  Genius Islamian Academy
                </h2>
                <p className="text-[10px] font-medium text-red-400/90 tracking-wider uppercase mt-1 leading-none">
                  Academy System
                </p>
              </div>
            </div>
          ) : (
            <img
              src={logoSrc}
              alt="Genius Islamian's Academy"
              className="mx-auto h-7 w-7 object-contain"
            />
          )}
        </div>

        {/* Zone 2: Navigation (flex-1, scrollable) */}
        <nav className="flex-1 min-h-0 py-2 flex flex-col gap-0.5 px-2 overflow-y-auto sidebar-scrollbar">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Collapse button (shrink-0, always visible, desktop only) */}
        <div className="shrink-0 hidden md:flex justify-center py-2.5 border-t border-sidebar-border/30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border bg-sidebar-accent text-sidebar-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
