import React, { useState } from "react";
import { motion } from "motion/react";
import { User, Bell, ShieldQuestion, Save } from "lucide-react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave}
          className="bg-white rounded-2xl card-shadow border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Role</label>
              <input
                value={user?.role || ""}
                disabled
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:brightness-105 transition-all"
          >
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl card-shadow border border-slate-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-800">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Email Alerts</p>
                <p className="text-xs text-slate-400">Get notified when a scan completes</p>
              </div>
              <button
                onClick={() => setEmailAlerts((v) => !v)}
                className={`h-6 w-11 rounded-full relative transition-colors ${
                  emailAlerts ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    emailAlerts ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Critical Only</p>
                <p className="text-xs text-slate-400">Only alert for Critical severity issues</p>
              </div>
              <button
                onClick={() => setCriticalOnly((v) => !v)}
                className={`h-6 w-11 rounded-full relative transition-colors ${
                  criticalOnly ? "bg-emerald-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    criticalOnly ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-start gap-3">
            <ShieldQuestion className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Your data is fully isolated per account. Scans, issues, and projects created under your
              login are never visible to other users of MUHAFIZ AI.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
