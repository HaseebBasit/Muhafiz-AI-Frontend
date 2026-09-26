import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Github, Gitlab, MessageSquare, Code, Workflow, Ticket } from "lucide-react";
import Layout from "../components/Layout";
import { integrationsApi } from "../api/client";

const CATALOG: Record<string, { label: string; description: string; icon: any }> = {
  github: { label: "GitHub", description: "Scan pull requests automatically on push.", icon: Github },
  gitlab: { label: "GitLab", description: "Run security checks in your GitLab CI pipeline.", icon: Gitlab },
  jira: { label: "Jira", description: "Auto-create tickets for critical findings.", icon: Ticket },
  slack: { label: "Slack", description: "Get real-time alerts in your team channel.", icon: MessageSquare },
  vscode: { label: "VS Code", description: "Inline vulnerability highlights in your editor.", icon: Code },
  "ci-cd": { label: "CI/CD Pipeline", description: "Block deployments with critical vulnerabilities.", icon: Workflow },
};

export default function Integrations() {
  const [state, setState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    integrationsApi.list().then((data) => {
      const map: Record<string, boolean> = {};
      data.integrations.forEach((i) => (map[i.key] = i.enabled));
      setState(map);
      setLoading(false);
    });
  }, []);

  async function toggle(key: string) {
    const next = !state[key];
    setState((s) => ({ ...s, [key]: next }));
    await integrationsApi.toggle(key, next);
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Integrations</h1>
        <p className="text-sm text-slate-400 mt-1">Connect MUHAFIZ AI to your existing dev workflow.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl card-shadow border border-slate-100 p-12 text-center text-sm text-slate-400">
          Loading integrations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(CATALOG).map(([key, { label, description, icon: Icon }], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-2xl card-shadow border border-slate-100 p-5 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <button
                  onClick={() => toggle(key)}
                  className={`h-6 w-11 rounded-full relative transition-colors ${
                    state[key] ? "bg-emerald-500" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      state[key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
              <p className="text-xs text-slate-400 mt-1 flex-1">{description}</p>
              <span
                className={`mt-3 text-xs font-semibold w-fit px-2.5 py-1 rounded-full ${
                  state[key] ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}
              >
                {state[key] ? "Connected" : "Not connected"}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
