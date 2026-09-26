import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Menu, ScanLine } from "lucide-react";
import { NavStats } from "../hooks/useNavStats";

export default function Header({
  onMenuClick,
  stats,
}: {
  onMenuClick?: () => void;
  stats: NavStats;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate("/results", { state: { query } });
  }

  const score = stats.score?.score ?? 100;

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 bg-white/80 backdrop-blur border-b border-slate-200">
      <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 shrink-0" onClick={onMenuClick}>
        <Menu className="h-5 w-5 text-slate-600" />
      </button>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vulnerabilities, CVEs, or files..."
            className="w-full pl-10 pr-14 py-2.5 rounded-xl bg-slate-100/70 border border-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white focus:border-slate-200 transition-all"
          />
          <span className="hidden md:inline absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 border border-slate-200 rounded-md px-1.5 py-0.5 bg-white">
            ⌘K
          </span>
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
        <div className="hidden md:flex items-center gap-2 pl-3 pr-1 h-9 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Audit Daemon Active
          <span className="text-slate-300">•</span>
          <span className="pr-2.5 text-slate-500">Score {stats.loading ? "--" : score}/100</span>
        </div>

        <button
          className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors"
          onClick={() => navigate("/results")}
          aria-label="Open critical alerts"
        >
          <Bell className="h-5 w-5 text-slate-500" />
          {stats.criticalOpen > 0 && (
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
          )}
        </button>

        <button
          onClick={() => navigate("/scanner")}
          className="inline-flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shrink-0"
        >
          <ScanLine className="h-4 w-4" />
          <span className="hidden sm:inline">New Code Scan</span>
        </button>
      </div>
    </header>
  );
}
