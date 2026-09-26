import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  PlayCircle,
  FileDown,
  Clock,
  ScanLine,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Layout from "../components/Layout";
import { scansApi, securityScoreApi } from "../api/client";
import { Scan, Severity, SecurityScore } from "../types";
import { useAuth } from "../context/AuthContext";

const COMPLIANCE_TARGET = 90;
const PREV_SCORE_KEY = "muhafiz_prev_score";

const severityMeta: { key: keyof SecurityScore; label: Severity; icon: any; color: string; bg: string; ring: string }[] = [
  { key: "critical", label: "Critical", icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", ring: "border-red-100" },
  { key: "high", label: "High", icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", ring: "border-orange-100" },
  { key: "medium", label: "Medium", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", ring: "border-amber-100" },
  { key: "low", label: "Low", icon: Info, color: "text-emerald-600", bg: "bg-emerald-50", ring: "border-emerald-100" },
];

function postureFor(score: number) {
  if (score >= 80) return { label: "Excellent", message: "Excellent! Your code is secure.", sub: "All critical pipelines have active real-time guardrails engaged.", tone: "text-emerald-600 bg-emerald-50" };
  if (score >= 50) return { label: "Good", message: "Your code is in fair shape.", sub: "A few pipelines still need attention before they're fully guarded.", tone: "text-amber-600 bg-amber-50" };
  return { label: "At Risk", message: "Your code needs attention.", sub: "Several pipelines are exposed — run a scan and triage critical findings.", tone: "text-red-600 bg-red-50" };
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState<SecurityScore | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevScore, setPrevScore] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([securityScoreApi.get(), scansApi.list()])
      .then(([scoreData, scansData]) => {
        setScore(scoreData.securityScore);
        setScans(scansData.scans.slice(0, 5));
        const stored = localStorage.getItem(PREV_SCORE_KEY);
        setPrevScore(stored ? Number(stored) : null);
        localStorage.setItem(PREV_SCORE_KEY, String(scoreData.securityScore.score));
      })
      .finally(() => setLoading(false));
  }, []);

  const scorePct = score?.score ?? 100;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (scorePct / 100) * circumference;
  const scoreColor = scorePct >= 80 ? "#10b981" : scorePct >= 50 ? "#f59e0b" : "#ef4444";
  const posture = postureFor(scorePct);
  const targetPct = Math.min(100, Math.round((scorePct / COMPLIANCE_TARGET) * 100));
  const delta = prevScore !== null ? scorePct - prevScore : null;

  return (
    <Layout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Welcome back, {user?.fullName?.split(" ")[0] || "there"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">Here's your security overview.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <FileDown className="h-4 w-4" />
            Download Report
          </Link>
          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:brightness-105 transition-all"
          >
            <PlayCircle className="h-4 w-4" />
            Launch Code Scan
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl card-shadow border border-slate-100 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex flex-col items-center shrink-0">
            <div className="relative h-36 w-36">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={loading ? circumference : dashOffset}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{loading ? "--" : scorePct}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <span className={`mt-3 text-xs font-semibold px-3 py-1 rounded-full ${posture.tone}`}>
              {posture.label}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <p className="text-xs font-semibold tracking-wider text-slate-400">SECURITY POSTURE</p>
                <h2 className="text-lg font-bold text-slate-800 -mt-0.5">Composite Health</h2>
                <p className="text-xs text-slate-400">Automated continuous evaluation</p>
              </div>
              {delta !== null && delta !== 0 && (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    delta > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  }`}
                >
                  {delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(delta)} pts vs last visit
                </span>
              )}
            </div>

            <p className="text-base font-semibold text-slate-800 mt-3">{posture.message}</p>
            <p className="text-sm text-slate-400 mt-1">{posture.sub}</p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>Repository Compliance Target ({COMPLIANCE_TARGET})</span>
                <span className="font-semibold text-slate-700">{targetPct}% Reached</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700"
                  style={{ width: `${loading ? 0 : targetPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-xs font-semibold tracking-wider text-slate-400 mb-3">THREAT SEVERITY BREAKDOWN</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {severityMeta.map(({ key, label, icon: Icon, color, bg, ring }, idx) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            onClick={() => navigate("/results", { state: { severity: label } })}
            className={`text-left rounded-2xl border ${ring} ${bg} p-5 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold tracking-wide ${color}`}>{label.toUpperCase()}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-800">{loading ? "--" : (score as any)?.[key] ?? 0}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">Active alerts requiring triage</p>
              <span className={`text-xs font-semibold ${color}`}>View →</span>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl card-shadow border border-slate-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">Recent Scans</h2>
          <Link to="/results" className="text-sm text-blue-600 font-medium hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Loading scans...</div>
        ) : scans.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-400 mb-3">No scans yet. Run your first scan to get started.</p>
            <Link to="/scanner" className="text-sm text-blue-600 font-semibold hover:underline">
              Go to Code Scanner →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {scans.map((scan) => (
              <div key={scan.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <ScanLine className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{scan.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(scan.created_at).toLocaleString()} · {scan.language}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {scan.issues_found} issues
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      scan.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
