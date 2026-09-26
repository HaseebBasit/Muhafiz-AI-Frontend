import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileDown, ShieldCheck, ScanLine } from "lucide-react";
import Layout from "../components/Layout";
import { scansApi, issuesApi, securityScoreApi } from "../api/client";
import { Scan, Issue, SecurityScore } from "../types";

export default function Report() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [score, setScore] = useState<SecurityScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([scansApi.list(), issuesApi.list(), securityScoreApi.get()]).then(
      ([scansData, issuesData, scoreData]) => {
        setScans(scansData.scans);
        setIssues(issuesData.issues);
        setScore(scoreData.securityScore);
        setLoading(false);
      }
    );
  }, []);

  const byCategory = issues.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  function handleExport() {
    const rows = [
      ["Title", "Severity", "Category", "Line", "Status"],
      ...issues.map((i) => [i.title, i.severity, i.category, String(i.line_number), i.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "muhafiz_security_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Detailed Report</h1>
          <p className="text-sm text-slate-400 mt-1">A full breakdown of your security posture.</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
        >
          <FileDown className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center text-sm text-slate-400">
          Generating report...
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5">
              <ShieldCheck className="h-5 w-5 text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{score?.score ?? 100}</p>
              <p className="text-xs text-slate-400">Security Score</p>
            </div>
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5">
              <ScanLine className="h-5 w-5 text-cyan-500 mb-2" />
              <p className="text-2xl font-bold text-slate-800">{scans.length}</p>
              <p className="text-xs text-slate-400">Total Scans</p>
            </div>
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5">
              <p className="text-2xl font-bold text-slate-800">{issues.length}</p>
              <p className="text-xs text-slate-400">Total Issues Found</p>
            </div>
            <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5">
              <p className="text-2xl font-bold text-slate-800">
                {issues.filter((i) => i.status === "Fixed").length}
              </p>
              <p className="text-xs text-slate-400">Issues Resolved</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Issues by Category</h2>
            <div className="space-y-3">
              {Object.entries(byCategory).length === 0 && (
                <p className="text-sm text-slate-400">No issues recorded yet.</p>
              )}
              {Object.entries(byCategory).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>{cat}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      style={{ width: `${Math.min(100, (count / Math.max(1, issues.length)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">All Findings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                    <th className="px-6 py-3 font-medium">Title</th>
                    <th className="px-6 py-3 font-medium">Severity</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {issues.map((i) => (
                    <tr key={i.id}>
                      <td className="px-6 py-3 text-slate-700">{i.title}</td>
                      <td className="px-6 py-3 text-slate-500">{i.severity}</td>
                      <td className="px-6 py-3 text-slate-500">{i.category}</td>
                      <td className="px-6 py-3 text-slate-500">{i.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
