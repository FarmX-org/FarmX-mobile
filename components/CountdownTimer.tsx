import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('Time up');
      } else {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <Text>{timeLeft}</Text>;
};

export default CountdownTimer;
