import React, { useState } from "react";
import { X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { LogoMark } from "./Logo";
import { useNavStats } from "../hooks/useNavStats";
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
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const stats = useNavStats(location.pathname);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/scanner", label: "Code Scanner", icon: ScanLine },
    { to: "/results", label: "Scan Results", icon: ListChecks, badge: stats.openIssues || undefined },
    { to: "/auto-fix", label: "Auto-Fix", icon: Wand2, badge: stats.readyToFix || undefined },
    { to: "/report", label: "Detailed Report", icon: FileText },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/integrations", label: "Integrations", icon: Plug },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/about", label: "About Us", icon: Info },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar stats={stats} />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LogoMark className="h-8 w-8" />
                <span className="font-display font-bold text-sm">MUHAFIZ AI</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{label}</span>
                  {!!badge && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setMobileOpen(true)} stats={stats} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
