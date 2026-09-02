"use client";

import { useRef, useState, type PointerEvent } from "react";

/**
 * Finger-friendly reorder without a library. Attach `handleProps(id)` to a
 * drag handle; rows shuffle live while dragging and `onDrop` gets the new order.
 */
export function useDragList(ids: string[], onDrop: (ids: string[]) => void) {
  const [order, setOrder] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLElement | null>());
  const current = order ?? ids;

  function rowRef(id: string) {
    return (el: HTMLElement | null) => {
      rows.current.set(id, el);
    };
  }

  function indexAt(y: number): number {
    const mids = current.map((id) => {
      const r = rows.current.get(id)?.getBoundingClientRect();
      return r ? r.top + r.height / 2 : Infinity;
    });
    const i = mids.findIndex((m) => y < m);
    return i === -1 ? current.length - 1 : i;
  }

  function handleProps(id: string) {
    return {
      onPointerDown(e: PointerEvent<HTMLElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(id);
        setOrder(ids);
      },
      onPointerMove(e: PointerEvent<HTMLElement>) {
        if (dragging !== id) return;
        const from = current.indexOf(id);
        const to = indexAt(e.clientY);
        if (to === from || to < 0) return;
        const next = [...current];
        next.splice(from, 1);
        next.splice(to, 0, id);
        setOrder(next);
      },
      onPointerUp() {
        if (dragging !== id) return;
        const final = order ?? ids;
        setDragging(null);
        setOrder(null);
        if (final.some((x, i) => x !== ids[i])) onDrop(final);
      },
      style: { touchAction: "none" as const },
    };
  }

  return { order: current, dragging, rowRef, handleProps };
}
