"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearPersonalization,
  getEmptyActivity,
  readActivity,
  subscribeToActivity,
} from "@/lib/activityStore";

export function useActivity() {
  const [activity, setActivity] = useState(getEmptyActivity);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeToActivity(setActivity);

    queueMicrotask(() => {
      if (!active) return;
      setActivity(readActivity());
      setIsHydrated(true);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const clearActivity = useCallback(() => {
    setActivity(clearPersonalization());
  }, []);

  return { activity, isHydrated, clearActivity };
}
