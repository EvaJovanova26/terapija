"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchProfile, saveProfile } from "@/lib/supabase/queries";
import type { Avatar } from "@/lib/types";

/** The avatar choices, with a small save helper. */
export function useProfile() {
  const [avatar, setAvatar] = useState<Avatar | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchProfile(createClient())
      .then((p) => !cancelled && setAvatar(p?.avatar ?? {}))
      .catch(() => !cancelled && setAvatar({}));
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (patch: Partial<Avatar>) => {
    setAvatar((cur) => {
      const next = { ...(cur ?? {}), ...patch };
      void saveProfile(createClient(), { avatar: next }).catch(() => {});
      return next;
    });
  }, []);

  return { avatar, update };
}
