import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { UploadCloud, Code2, PlayCircle, FileCode, Loader2 } from "lucide-react";
import Layout from "../components/Layout";
import { scanCodeApi } from "../api/client";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "PHP", "Go", "C#"];

const SAMPLES: Record<string, string> = {
  JavaScript: `function login(user) {
  const query = "SELECT * FROM users WHERE email = '" + user.email + "'";
  db.query(query);
  document.getElementById("out").innerHTML = user.bio;
  eval(user.customScript);
  const apiKey = "sk_live_51Hh2example12345";
  return true;
}`,
  Python: `import os

def run_command(user_input):
    os.system("ping " + user_input)
    password = "SuperSecret123"
    return eval(user_input)
`,
  TypeScript: `export function render(html: string) {
  const el = document.getElementById("root")!;
  el.innerHTML = html;
  const token = "ghp_1234567890abcdef";
  fetch("http://api.example.com/data");
}`,
};

export default function Scanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(SAMPLES.JavaScript);
  const [fileName, setFileName] = useState("untitled_scan.js");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function loadSample(lang: string) {
    setLanguage(lang);
    setCode(SAMPLES[lang] || `// Paste your ${lang} code here to scan for vulnerabilities`);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setCode(String(reader.result || ""));
    reader.readAsText(file);
  }

  async function handleScan() {
    if (!code.trim()) {
      setError("Please enter or upload some code to scan.");
      return;
    }
    setError("");
    setScanning(true);
    setProgress(8);

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.random() * 12 : p));
    }, 220);

    try {
      const result = await scanCodeApi.run({ code, language, fileName });
      clearInterval(progressTimer);
      setProgress(100);
      setTimeout(() => {
        navigate("/results", { state: { scanId: result.scan.id } });
      }, 400);
    } catch (err: any) {
      clearInterval(progressTimer);
      setScanning(false);
      setProgress(0);
      setError(err.message || "Scan failed. Please try again.");
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Code Scanner</h1>
        <p className="text-sm text-slate-400 mt-1">
          Paste your code, upload a file, or try a sample — MUHAFIZ AI will analyze it for vulnerabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl card-shadow border border-slate-100 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm font-medium text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="text-xs text-slate-500 border border-slate-200 rounded-lg px-2.5 py-1.5 w-40 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Upload
              </button>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-96 p-5 font-mono text-sm text-slate-700 focus:outline-none resize-none bg-slate-50/50"
            placeholder="// Paste your code here..."
          />

          <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
            {error && <p className="text-xs text-red-500">{error}</p>}
            <div className="ml-auto flex items-center gap-3">
              {scanning && (
                <div className="w-40 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut" }}
                  />
                </div>
              )}
              <button
                onClick={handleScan}
                disabled={scanning}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:brightness-105 transition-all disabled:opacity-70"
              >
                {scanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Scanning {Math.min(99, Math.round(progress))}%
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" /> Run Scan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 h-fit">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <FileCode className="h-4 w-4 text-slate-400" />
            Sample Codes
          </h3>
          <div className="space-y-2">
            {Object.keys(SAMPLES).map((lang) => (
              <button
                key={lang}
                onClick={() => loadSample(lang)}
                className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/40 transition-all text-sm text-slate-600"
              >
                <span className="font-medium text-slate-700">{lang} sample</span>
                <p className="text-xs text-slate-400 mt-0.5">Contains intentional vulnerabilities</p>
              </button>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-1">How scanning works</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              MUHAFIZ AI analyzes your code against a rules engine covering OWASP Top 10 patterns —
              injection flaws, XSS, hardcoded secrets, weak cryptography, and insecure transport —
              then generates severity-ranked findings with suggested fixes.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
