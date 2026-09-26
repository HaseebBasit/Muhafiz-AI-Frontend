import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  ListChecks,
  Wand2,
  FileText,
  FolderKanban,
  Plug,
  Settings,
  Info,
  Sparkles,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { LogoMark } from "./Logo";
import { useAuth } from "../context/AuthContext";
import { NavStats } from "../hooks/useNavStats";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Sidebar({ stats }: { stats: NavStats }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/scanner", label: "Code Scanner", icon: ScanLine },
    {
      to: "/results",
      label: "Scan Results",
      icon: ListChecks,
      badge: stats.openIssues > 0 ? String(stats.openIssues) : undefined,
    },
    {
      to: "/auto-fix",
      label: "Auto-Fix",
      icon: Wand2,
      badge: stats.readyToFix > 0 ? `${stats.readyToFix} Ready` : undefined,
    },
    { to: "/report", label: "Detailed Report", icon: FileText },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/integrations", label: "Integrations", icon: Plug },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/about", label: "About Us", icon: Info },
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 shrink-0 border-r border-slate-200 bg-white min-h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100">
        <LogoMark className="h-8 w-8 shrink-0" />
        <span className="font-display font-bold text-slate-800 tracking-wide text-sm">
          MUHAFIZ <span className="gradient-text">AI</span>
        </span>
      </div>

      <p className="px-6 pt-5 pb-2 text-[11px] font-semibold tracking-wider text-slate-400">
        SECURITY NAVIGATION
      </p>

      <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : ""}`} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-3 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/60 border border-slate-100">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
          <p className="text-xs font-semibold text-slate-700">Muhafiz Engine v3.4</p>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Real-time AST scanner active with automated OWASP vulnerability heuristics.
        </p>
      </div>

      <div className="relative border-t border-slate-100 p-3">
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl border border-slate-100 card-shadow py-1.5 animate-fade-in-up">
            <button
              onClick={() => {
                setProfileOpen(false);
                navigate("/settings");
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        )}
        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
            {user ? initials(user.fullName) : ""}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-400 -mt-0.5">{user?.role}</p>
          </div>
          <ChevronUp className={`h-4 w-4 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
    </aside>
  );
}
