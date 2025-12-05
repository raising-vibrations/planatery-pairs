import { useState, useEffect } from 'react';

interface GenerationData {
  count: number;
  month: string;
  unlockedUntil?: number;
}

const MAX_FREE_GENERATIONS = 2;
const STORAGE_KEY = 'planetary-pairs-generations';

export function useGenerationTokens(pairId: string) {
  const [count, setCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [remaining, setRemaining] = useState(MAX_FREE_GENERATIONS);

  useEffect(() => {
    loadTokenData();
  }, [pairId]);

  const loadTokenData = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, GenerationData> = stored ? JSON.parse(stored) : {};
    const pairData = data[pairId];

    // Reset if new month or no data
    if (!pairData || pairData.month !== currentMonth) {
      const newData = { count: 0, month: currentMonth };
      data[pairId] = newData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setCount(0);
      setRemaining(MAX_FREE_GENERATIONS);
      setIsUnlocked(false);
      return;
    }

    // Check if password unlock is still valid (1 hour)
    const unlocked = pairData.unlockedUntil && pairData.unlockedUntil > Date.now();
    setCount(pairData.count);
    setRemaining(Math.max(0, MAX_FREE_GENERATIONS - pairData.count));
    setIsUnlocked(!!unlocked);
  };

  const incrementCount = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, GenerationData> = stored ? JSON.parse(stored) : {};

    if (!data[pairId]) {
      data[pairId] = { count: 0, month: currentMonth };
    }

    data[pairId].count += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCount(data[pairId].count);
    setRemaining(Math.max(0, MAX_FREE_GENERATIONS - data[pairId].count));
  };

  const unlockWithPassword = (password: string): boolean => {
    if (password !== process.env.NEXT_PUBLIC_UNLOCK_PASSWORD) {
      return false;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const stored = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, GenerationData> = stored ? JSON.parse(stored) : {};

    if (!data[pairId]) {
      data[pairId] = { count: 0, month: currentMonth };
    }

    data[pairId].unlockedUntil = Date.now() + (60 * 60 * 1000); // 1 hour
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setIsUnlocked(true);
    return true;
  };

  const canGenerate = isUnlocked || remaining > 0;

  return {
    count,
    remaining,
    canGenerate,
    isUnlocked,
    maxGenerations: MAX_FREE_GENERATIONS,
    incrementCount,
    unlockWithPassword,
  };
}
