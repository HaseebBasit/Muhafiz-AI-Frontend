import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, FolderKanban, X } from "lucide-react";
import Layout from "../components/Layout";
import { projectsApi } from "../api/client";
import { Project } from "../types";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "PHP", "Go", "C#"];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [saving, setSaving] = useState(false);

  function load() {
    projectsApi.list().then((data) => {
      setProjects(data.projects);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await projectsApi.create({ name, description, language });
      setName("");
      setDescription("");
      setShowForm(false);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await projectsApi.remove(id);
    load();
  }

  return (
    <Layout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Organize scans by codebase or repository.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 hover:brightness-105 transition-all"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleCreate}
          className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Project Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Payments API"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              {LANGUAGES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-all disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create"}
            </button>
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Description</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center text-sm text-slate-400">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center">
          <FolderKanban className="h-8 w-8 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No projects yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 relative group"
            >
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center mb-3">
                <FolderKanban className="h-5 w-5 text-cyan-600" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description || "No description"}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                  {p.language}
                </span>
                <span className="text-xs text-slate-400">{p.issues_count} issues</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
