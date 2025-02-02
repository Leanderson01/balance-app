import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GameScreen() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameEnded, setGameEnded] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isStable, setIsStable] = useState(false);

  const saveScore = async (finalScore: number) => {
    try {
      await AsyncStorage.setItem('lastScore', finalScore.toString());
      const currentHighScore = await AsyncStorage.getItem('highScore');
      if (!currentHighScore || finalScore > parseInt(currentHighScore)) {
        await AsyncStorage.setItem('highScore', finalScore.toString());
      }
    } catch (error) {
      console.error('Erro ao salvar pontuação:', error);
    }
  };

  const endGame = useCallback(async () => {
    await saveScore(score);
    router.replace({
      pathname: '/results',
      params: { score }
    });
  }, [score]);

  // Efeito para finalizar o jogo
  useEffect(() => {
    if (gameEnded) {
      endGame();
    }
  }, [gameEnded, endGame]);

  // Efeito para o acelerômetro e verificação de estabilidade
  useEffect(() => {
    let subscription: any;

    const startAccelerometer = async () => {
      await Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(data => {
        setAccelerometerData(data);
        const stability = Math.abs(data.x) + Math.abs(data.y);
        setIsStable(stability < 0.3);
      });
    };

    startAccelerometer();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Efeito para pontuação
  useEffect(() => {
    if (gameEnded || !isStable) return;

    const scoreInterval = setInterval(() => {
      if (isStable) {
        setScore(prev => prev + 1);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 1000);

    return () => clearInterval(scoreInterval);
  }, [gameEnded, isStable]);

  // Efeito para timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>{timeLeft}s</Text>
        <Text style={styles.score}>Pontos: {score}</Text>
      </View>

      <View style={styles.stabilityIndicator}>
        <View 
          style={[
            styles.bubble,
            {
              transform: [
                { translateX: accelerometerData.x * 100 },
                { translateY: accelerometerData.y * 100 }
              ],
              backgroundColor: isStable ? '#007AFF' : '#FF3B30', // Azul quando estável, vermelho quando instável
            }
          ]} 
        />
      </View>

      <Text style={styles.instruction}>
        Mantenha a bolinha no centro do círculo!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  stabilityIndicator: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#ccc',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  bubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007AFF',
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});