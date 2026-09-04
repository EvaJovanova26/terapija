"use client";

import { useEffect, useState } from "react";
import { todayLocal } from "@/lib/date";
import { roomForToday, roomStates, type RoomState } from "@/lib/grow/rooms";
import { createClient } from "@/lib/supabase/client";
import { fetchAllEntries, fetchItems, fetchProfile } from "@/lib/supabase/queries";
import type { Avatar, Domain } from "@/lib/types";
import RoomCard from "./RoomCard";

interface Data {
  rooms: RoomState[];
  here: Domain;
  avatar: Avatar;
}

export default function HomeScreen() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    let cancelled = false;
    const db = createClient();
    Promise.all([fetchAllEntries(db), fetchItems(db), fetchProfile(db)])
      .then(([entries, items, profile]) => {
        if (cancelled) return;
        const today = entries.find((e) => e.date === todayLocal()) ?? null;
        setData({ rooms: roomStates(entries, items), here: roomForToday(today, items), avatar: profile?.avatar ?? {} });
      })
      .catch(() => !cancelled && setData({ rooms: roomStates([], []), here: "living", avatar: {} }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) return <div className="h-40" aria-hidden />;

  return (
    <div className="flex flex-col gap-3">
      <header>
        <h1 className="font-display text-[28px] font-medium text-ink">Home</h1>
        <p className="text-sm text-ink-soft">Every room grows from what you do. Nothing is ever taken away.</p>
      </header>
      {data.rooms.map((s) => (
        <RoomCard key={s.room.domain} state={s} here={s.room.domain === data.here} avatar={data.avatar} />
      ))}
    </div>
  );
}
