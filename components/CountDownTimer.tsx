import React, { useState, useEffect, useRef } from 'react';
import { View, Text, AppState } from 'react-native';
import { getData, removeData, saveData } from '@/services/asyncStorage';

export default function CountdownTimer({ order, styles }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<any>(null);
  const appState = useRef(AppState.currentState);

  const STORAGE_KEY = `countdown_${order.id}`;

  // Calculate end time based on estimated delivery time
  const calculateEndTime = (estimatedMinutes) => {
    return Date.now() + (estimatedMinutes * 60 * 1000);
  };

  // Calculate remaining time from end time
  const calculateTimeLeft = (endTime) => {
    const now = Date.now();
    return Math.max(0, Math.floor((endTime - now) / 1000));
  };

  // Initialize countdown
  useEffect(() => {
    const initializeCountdown = async () => {
      try {
        // Check if we have a stored end time for this order
        const storedEndTime = await getData<any>(STORAGE_KEY);

        let endTime;
        if (storedEndTime) {
          endTime = parseInt(storedEndTime);
          // Check if stored countdown is still valid (not expired)
          if (Date.now() < endTime) {
            setTimeLeft(calculateTimeLeft(endTime));
          } else {
            // Countdown expired, remove from storage
            await removeData(STORAGE_KEY);
            setTimeLeft(0);
          }
        } else {
          // First time - create new countdown
          endTime = calculateEndTime(order.estimatedDeliveryTime);
          await saveData(STORAGE_KEY, endTime.toString());
          setTimeLeft(calculateTimeLeft(endTime));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing countdown:', error);
        // Fallback to original behavior
        setTimeLeft(order.estimatedDeliveryTime * 60);
        setIsLoading(false);
      }
    };

    initializeCountdown();
  }, [order.id, order.estimatedDeliveryTime, STORAGE_KEY]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.current === 'background' && nextAppState === 'active') {
        // App came to foreground - recalculate time left
        try {
          const storedEndTime = await getData<any>(STORAGE_KEY);
          if (storedEndTime) {
            const endTime = parseInt(storedEndTime);
            const remaining = calculateTimeLeft(endTime);
            setTimeLeft(remaining);

            if (remaining <= 0) {
              await removeData(STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error('Error handling app state change:', error);
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [STORAGE_KEY]);

  // Main countdown timer
  useEffect(() => {
    if (isLoading || timeLeft <= 0) return;

    intervalRef.current = setInterval(async () => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;

        if (newTime <= 0) {
          // Countdown finished - clean up storage
          removeData(STORAGE_KEY).catch(console.error);
          clearInterval(intervalRef.current);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLoading, timeLeft, STORAGE_KEY]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.estimatedTime}>--:--</Text>
          <Text style={styles.estimatedTimeLabel}>LOADING...</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.cardHeader}>
        <Text style={styles.estimatedTime}>
          {timeLeft > 0 ? formatTime(timeLeft) : '00:00'}
        </Text>
        <Text style={styles.estimatedTimeLabel}>
          {timeLeft > 0 ? 'ESTIMATED DELIVERY TIME' : 'DELIVERY COMPLETED'}
        </Text>
      </View>
    </View>
  );
};
