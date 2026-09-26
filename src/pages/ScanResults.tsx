import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Wand2, ChevronRight } from "lucide-react";
import Layout from "../components/Layout";
import { issuesApi } from "../api/client";
import { Issue, Severity } from "../types";

const severityConfig: Record<Severity, { icon: any; color: string; bg: string; border: string }> = {
  Critical: { icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  High: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
  Medium: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  Low: { icon: Info, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
};

const FILTERS: (Severity | "All")[] = ["All", "Critical", "High", "Medium", "Low"];

export default function ScanResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const scanId = (location.state as any)?.scanId as string | undefined;
  const presetSeverity = (location.state as any)?.severity as Severity | undefined;
  const presetQuery = (location.state as any)?.query as string | undefined;

  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<Severity | "All">(presetSeverity || "All");
  const [search, setSearch] = useState(presetQuery || "");
  const [selected, setSelected] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    issuesApi
      .list(scanId ? { scanId } : undefined)
      .then((data) => {
        setIssues(data.issues);
        if (data.issues.length > 0) setSelected(data.issues[0]);
      })
      .finally(() => setLoading(false));
  }, [scanId]);

  const filtered = useMemo(() => {
    let result = filter === "All" ? issues : issues.filter((i) => i.severity === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [issues, filter, search]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Scan Results</h1>
        <p className="text-sm text-slate-400 mt-1">
          {scanId ? "Results for your latest scan." : "All issues detected across your scans."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {search && (
          <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800 text-white">
            "{search}"
            <button onClick={() => setSearch("")} className="text-slate-300 hover:text-white">
              ×
            </button>
          </span>
        )}
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f} {f !== "All" && `(${issues.filter((i) => i.severity === f).length})`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl card-shadow border border-slate-100 divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-400">Loading issues...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">No issues found for this filter.</div>
          ) : (
            filtered.map((issue) => {
              const cfg = severityConfig[issue.severity];
              const Icon = cfg.icon;
              const isActive = selected?.id === issue.id;
              return (
                <button
                  key={issue.id}
                  onClick={() => setSelected(issue)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-all ${
                    isActive ? "bg-cyan-50/60" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800 truncate">{issue.title}</p>
                      <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Line {issue.line_number} · {issue.category} · {issue.status}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <motion.div
          key={selected?.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-white rounded-2xl card-shadow border border-slate-100 p-6"
        >
          {!selected ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400 py-20">
              Select an issue to view details
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                      severityConfig[selected.severity].bg
                    } ${severityConfig[selected.severity].color} mb-2`}
                  >
                    {selected.severity}
                  </span>
                  <h2 className="text-lg font-semibold text-slate-800">{selected.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {selected.category} · Line {selected.line_number}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/auto-fix", { state: { issueId: selected.id } })}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-md hover:brightness-105 transition-all"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  Auto-Fix
                </button>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">{selected.description}</p>

              <div className="rounded-xl bg-slate-900 p-4 overflow-x-auto">
                <p className="text-xs text-slate-400 mb-2">Vulnerable code</p>
                <pre className="text-sm font-mono text-red-300 whitespace-pre-wrap">{selected.original_code}</pre>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
