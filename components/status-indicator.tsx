"use client";

import { useEffect, useState } from "react";

type StatusState = "missing" | "checking" | "online" | "offline";

export function StatusIndicator({ apiBase }: { apiBase?: string }) {
  const [state, setState] = useState<StatusState>(apiBase ? "checking" : "missing");

  useEffect(() => {
    let cancelled = false;
    if (!apiBase) {
      setState("missing");
      return;
    }
    setState("checking");
    const target = apiBase.replace(/\/$/, "");
    fetch(target || "/", { cache: "no-store" })
      .then((res) => {
        if (cancelled) return;
        setState(res.ok ? "online" : "offline");
      })
      .catch(() => {
        if (cancelled) return;
        setState("offline");
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const label =
    state === "online"
      ? "Online"
      : state === "offline"
      ? "Offline"
      : state === "checking"
      ? "Checking"
      : "No API";

  const color =
    state === "online"
      ? "bg-emerald-400"
      : state === "offline"
      ? "bg-red-500"
      : state === "checking"
      ? "bg-yellow-400"
      : "bg-neutral-500";

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      {label}
    </div>
  );
}
