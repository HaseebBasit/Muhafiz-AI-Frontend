import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import Layout from "../components/Layout";
import { issuesApi } from "../api/client";
import { Issue } from "../types";

export default function AutoFix() {
  const location = useLocation();
  const navigate = useNavigate();
  const issueId = (location.state as any)?.issueId as string | undefined;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    issuesApi.list({ status: "Open" }).then((data) => {
      setIssues(data.issues);
      const target = issueId ? data.issues.find((i) => i.id === issueId) : data.issues[0];
      setIssue(target || null);
      setLoading(false);
    });
  }, [issueId]);

  async function handleApplyFix() {
    if (!issue) return;
    setApplying(true);
    try {
      const updated = await issuesApi.update(issue.id, { status: "Fixed" });
      setIssue(updated.issue);
      setApplied(true);
    } finally {
      setApplying(false);
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Auto-Fix</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review AI-suggested fixes side-by-side and apply them with one click.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center text-sm text-slate-400">
          Loading...
        </div>
      ) : !issue ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center">
          <p className="text-sm text-slate-400 mb-3">No open issues to fix. Great job!</p>
          <button onClick={() => navigate("/scanner")} className="text-sm text-cyan-600 font-semibold hover:underline">
            Run a new scan →
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
              {issue.severity}
            </span>
            <h2 className="text-base font-semibold text-slate-800">{issue.title}</h2>
            <span className="text-xs text-slate-400 ml-auto">Line {issue.line_number}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-red-50/50">
                <p className="text-xs font-semibold text-red-600">Original (Vulnerable)</p>
              </div>
              <pre className="p-5 text-sm font-mono text-slate-700 whitespace-pre-wrap min-h-[140px]">
                {issue.original_code}
              </pre>
            </div>
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-emerald-50/50">
                <p className="text-xs font-semibold text-emerald-600">Fixed (Secure)</p>
              </div>
              <pre className="p-5 text-sm font-mono text-slate-700 whitespace-pre-wrap min-h-[140px]">
                {issue.fixed_code || "No automatic fix available."}
              </pre>
            </div>
          </div>

          <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                <Lightbulb className="h-4 w-4 text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">Why this fix works</p>
                <p className="text-sm text-slate-600 leading-relaxed">{issue.fix_explanation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleApplyFix}
              disabled={applying || issue.status === "Fixed"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:brightness-105 transition-all disabled:opacity-60"
            >
              {issue.status === "Fixed" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Fix Applied
                </>
              ) : applying ? (
                "Applying..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Apply Fix
                </>
              )}
            </button>
            {issues.length > 1 && (
              <button
                onClick={() => {
                  const idx = issues.findIndex((i) => i.id === issue.id);
                  const next = issues[(idx + 1) % issues.length];
                  setIssue(next);
                  setApplied(false);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Next Issue <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
