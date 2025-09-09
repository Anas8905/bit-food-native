import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useCountdownStore } from '@/stores/countdown';

const calcEnd = (estimatedMinutes: number) =>
  Date.now() + estimatedMinutes * 60 * 1000;

const calcLeft = (endTime: number) =>
  Math.max(0, Math.floor((endTime - Date.now()) / 1000));

export function useCountdown(orderId: string, estimatedMinutes: number): {
    timeLeft: number;
    isLoading: boolean;
} {
  const { getEnd, setEnd, remove, hydrated } = useCountdownStore();
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!hydrated) return;

    let end = getEnd(orderId);

    if (end && end <= Date.now()) {
      remove(orderId);
      end = undefined;
    }

    if (!end) {
      end = calcEnd(estimatedMinutes);
      setEnd(orderId, end);
    }

    setTimeLeft(calcLeft(end));
  }, [hydrated, orderId, estimatedMinutes, getEnd, setEnd, remove]);

  useEffect(() => {
    if (!hydrated || timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          remove(orderId);
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hydrated, timeLeft, orderId, remove]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appState.current === 'background' && next === 'active') {
        const end = getEnd(orderId);
        if (end) {
          const remaining = calcLeft(end);
          setTimeLeft(remaining);
          if (remaining <= 0) remove(orderId);
        }
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [orderId, getEnd, remove]);

  return { timeLeft, isLoading: !hydrated };
}
