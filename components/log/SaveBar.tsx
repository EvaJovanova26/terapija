"use client";

import type { SaveStatus } from "./useEntry";

interface Props {
  status: SaveStatus;
  onRetry: () => void;
}

const TEXT: Record<SaveStatus, string> = {
  loading: "loading",
  idle: "ready",
  pending: "…",
  saving: "saving",
  saved: "saved",
  retry: "not saved yet",
};

/** A small pill. Never loud, never red. */
export default function SaveBar({ status, onRetry }: Props) {
  const retry = status === "retry";
  return (
    <button
      type="button"
      onClick={retry ? onRetry : undefined}
      aria-live="polite"
      className="mt-1.5 flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1.5 text-xs font-semibold text-berry"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "saved" ? "bg-pink-500" : "bg-pink-300"}`} />
      {TEXT[status]}
      {retry && " · retry"}
    </button>
  );
}
