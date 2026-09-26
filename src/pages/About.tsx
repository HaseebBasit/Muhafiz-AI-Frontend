import React from "react";
import { motion } from "motion/react";
import {
  ScanLine,
  Wand2,
  BarChart3,
  Lock,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Layout from "../components/Layout";
import { LogoMark } from "../components/Logo";
import asimPhoto from "../assets/team/asim.jpeg";
import tahreenaPhoto from "../assets/team/tahreena.jpeg";
import haseebPhoto from "../assets/team/haseeb.jpg";
import shabnamPhoto from "../assets/team/shabnam.jpeg";

const features = [
  {
    icon: ScanLine,
    title: "AI-Powered Scanning",
    description: "Detects vulnerabilities across 7+ languages using a continuously updated rules engine.",
  },
  {
    icon: Wand2,
    title: "One-Click Auto-Fix",
    description: "Generates secure code replacements with clear explanations for every finding.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Security Score",
    description: "Track your codebase's health with a live score that updates as you fix issues.",
  },
  {
    icon: Lock,
    title: "Isolated & Secure",
    description: "Every account's scans, projects, and data are fully isolated with JWT-based auth.",
  },
  {
    icon: Zap,
    title: "CI/CD Ready",
    description: "Integrates with GitHub, GitLab, and your pipeline to block risky deployments.",
  },
  {
    icon: ShieldCheck,
    title: "OWASP-Aligned Rules",
    description: "Coverage mapped to OWASP Top 10 categories including injection, XSS, and secrets exposure.",
  },
];

const steps = [
  { title: "Write or Upload Code", description: "Paste a snippet, upload a file, or connect a repository." },
  { title: "Select Language", description: "Choose from JavaScript, Python, Java, Go, and more." },
  { title: "Run the Scan", description: "MUHAFIZ AI analyzes your code against a security rules engine in seconds." },
  { title: "Review Findings", description: "Browse severity-ranked issues with detailed explanations." },
  { title: "Apply Auto-Fix", description: "Accept AI-suggested secure replacements with a single click." },
];


const team = [
  {
    name: "Haseeb Basit",
    role: "Team Lead & Backend Developer",
    bio: "Leads the team and architects the scanning engine and APIs that power MUHAFIZ AI.",
    photo: haseebPhoto,
  },
  {
    name: "Tamreena Tashfeen",
    role: "Documentation & Presentation Lead",
    bio: "Turns the team's technical work into clear docs, reports, and presentations for every audience.",
    photo: tahreenaPhoto,
  },
  {
    name: "Muhammad Asim",
    role: "Frontend Developer",
    bio: "Builds the interfaces developers use every day to triage findings and ship secure code faster.",
    photo: asimPhoto,
  },
  {
    name: "Shabnam Sultaan",
    role: "Frontend Developer",
    bio: "Crafts the dashboards and workflows that make security findings easy to understand and act on.",
    photo: shabnamPhoto,
  },
];



export default function About() {
  return (
    <Layout>
      <div className="space-y-14">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <LogoMark className="h-16 w-16 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            What is MUHAFIZ <span className="gradient-text">AI</span>?
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            "Muhafiz" means "guardian" — and that's exactly what we built. MUHAFIZ AI is a developer
            security platform that scans your code for vulnerabilities in real time, explains each
            finding in plain language, and generates secure fixes automatically — so you can ship
            faster without shipping risk.
          </p>
        </motion.section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl card-shadow border border-slate-100 p-6"
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-50 to-emerald-50 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 relative"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-sm font-bold flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-8">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white rounded-2xl card-shadow border border-slate-100 p-6 text-center"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-20 w-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-slate-50"
                />
                <h3 className="text-sm font-semibold text-slate-800">{member.name}</h3>
                <p className="text-xs text-cyan-600 font-medium mt-0.5 mb-2">{member.role}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
