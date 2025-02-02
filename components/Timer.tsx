import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';

interface TimerProps {
  duration: number;
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export function Timer({
  duration,
  onComplete,
  onTick,
  size = 'medium',
  showProgress = true,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progressAnimation = new Animated.Value(1);

  useEffect(() => {
    const animation = Animated.timing(progressAnimation, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: true,
    });

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        onTick?.(newTime);
        return newTime;
      });
    }, 1000);

    animation.start();

    return () => {
      clearInterval(interval);
      animation.stop();
    };
  }, [duration]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: 24, width: 50, height: 50 };
      case 'large':
        return { fontSize: 48, width: 100, height: 100 };
      default:
        return { fontSize: 32, width: 70, height: 70 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, { width: sizeStyles.width, height: sizeStyles.height }]}>
      {showProgress && (
        <Animated.View
          style={[
            styles.progressCircle,
            {
              width: sizeStyles.width,
              height: sizeStyles.height,
              transform: [
                {
                  scale: progressAnimation,
                },
              ],
              opacity: progressAnimation,
            },
          ]}
        />
      )}
      <Text style={[styles.time, { fontSize: sizeStyles.fontSize }]}>
        {timeLeft}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontWeight: 'bold',
    color: '#333',
  },
  progressCircle: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
});