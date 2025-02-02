import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

interface StabilityIndicatorProps {
  x: number;
  y: number;
  size?: number;
  sensitivity?: number;
  onStabilityChange?: (stability: number) => void;
}

export function StabilityIndicator({
  x,
  y,
  size = 200,
  sensitivity = 100,
  onStabilityChange,
}: StabilityIndicatorProps) {
  const bubblePosition = new Animated.ValueXY({ x: 0, y: 0 });
  const bubbleScale = new Animated.Value(1);

  useEffect(() => {
    // Calcula a estabilidade baseada na distância do centro
    const stability = Math.sqrt(x * x + y * y);
    onStabilityChange?.(stability);

    // Anima a bolha para a nova posição
    Animated.spring(bubblePosition, {
      toValue: {
        x: x * sensitivity,
        y: y * sensitivity,
      },
      useNativeDriver: true,
    }).start();

    // Anima o tamanho da bolha baseado na estabilidade
    Animated.spring(bubbleScale, {
      toValue: stability < 0.1 ? 1.2 : 1,
      useNativeDriver: true,
    }).start();
  }, [x, y]);

  const containerSize = size;
  const bubbleSize = size * 0.15;

  const isWithinBounds = Math.abs(x) <= 1 && Math.abs(y) <= 1;

  return (
    <View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
        },
      ]}>
      <Animated.View
        style={[
          styles.bubble,
          {
            width: bubbleSize,
            height: bubbleSize,
            borderRadius: bubbleSize / 2,
            transform: [
              { translateX: bubblePosition.x },
              { translateY: bubblePosition.y },
              { scale: bubbleScale },
            ],
            backgroundColor: isWithinBounds ? '#007AFF' : '#FF3B30',
          },
        ]}
      />
      <View
        style={[
          styles.targetZone,
          {
            width: containerSize * 0.3,
            height: containerSize * 0.3,
            borderRadius: (containerSize * 0.3) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: '#007AFF',
  },
  targetZone: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    opacity: 0.5,
  },
});