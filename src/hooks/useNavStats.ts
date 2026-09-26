import { useEffect, useState } from "react";
import { issuesApi, securityScoreApi } from "../api/client";
import { SecurityScore } from "../types";

export interface NavStats {
  openIssues: number;
  readyToFix: number;
  criticalOpen: number;
  score: SecurityScore | null;
  loading: boolean;
}

/**
 * Pulls the small pieces of live data the shell (sidebar badges, header status pill)
 * needs, without every page having to duplicate the fetch. Refetches whenever the
 * route changes so badges stay in sync after a scan or a fix.
 */
export function useNavStats(refreshKey: unknown): NavStats {
  const [state, setState] = useState<NavStats>({
    openIssues: 0,
    readyToFix: 0,
    criticalOpen: 0,
    score: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([issuesApi.list({ status: "Open" }), securityScoreApi.get()])
      .then(([issuesData, scoreData]) => {
        if (cancelled) return;
        const open = issuesData.issues;
        setState({
          openIssues: open.length,
          readyToFix: open.filter((i) => !!i.fixed_code).length,
          criticalOpen: open.filter((i) => i.severity === "Critical").length,
          score: scoreData.securityScore,
          loading: false,
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return state;
}
