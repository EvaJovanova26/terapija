"use client";

import type { SaveStatus } from "./useEntry";

interface Props {
  status: SaveStatus;
  onRetry: () => void;
}

const TEXT: Record<SaveStatus, string> = {
  loading: "",
  idle: "",
  pending: "…",
  saving: "saving",
  saved: "saved",
  retry: "not saved yet",
};

/** Subtle save indicator. Never loud, never red. */
export default function SaveBar({ status, onRetry }: Props) {
  if (status === "retry") {
    return (
      <button type="button" onClick={onRetry} className="text-sm text-ink-soft underline decoration-line underline-offset-4">
        {TEXT.retry} · retry
      </button>
    );
  }
  return (
    <span className="text-sm text-ink-faint" aria-live="polite">
      {TEXT[status]}
    </span>
  );
}
