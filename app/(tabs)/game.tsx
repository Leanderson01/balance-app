import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Accelerometer, Gyroscope } from 'expo-sensors';
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
  const [gyroscopeData, setGyroscopeData] = useState({
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

  // Efeito para os sensores e verificação de estabilidade
  useEffect(() => {
    let accelerometerSubscription: any;
    let gyroscopeSubscription: any;

    const startSensors = async () => {
      // Configura o acelerômetro
      await Accelerometer.setUpdateInterval(100);
      accelerometerSubscription = Accelerometer.addListener(data => {
        setAccelerometerData(data);
      });

      // Configura o giroscópio
      await Gyroscope.setUpdateInterval(100);
      gyroscopeSubscription = Gyroscope.addListener(data => {
        setGyroscopeData(data);
      });
    };

    startSensors();

    return () => {
      accelerometerSubscription?.remove();
      gyroscopeSubscription?.remove();
    };
  }, []);

  // Efeito para calcular estabilidade combinando acelerômetro e giroscópio
  useEffect(() => {
    // Calcula a estabilidade usando ambos os sensores
    const accelerometerStability = Math.abs(accelerometerData.x) + Math.abs(accelerometerData.y);
    const gyroscopeStability = Math.abs(gyroscopeData.x) + Math.abs(gyroscopeData.y);

    // Dispositivo é considerado estável se ambos os sensores indicarem estabilidade
    const isDeviceStable = accelerometerStability < 0.3 && gyroscopeStability < 0.3;
    setIsStable(isDeviceStable);
  }, [accelerometerData, gyroscopeData]);

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

  // Calcula a cor da bolinha baseada na estabilidade
  const getBubbleColor = () => {
    if (isStable) return '#007AFF'; // Azul quando estável
    
    // Vermelho mais intenso quando há muito movimento
    const accelerometerMovement = Math.abs(accelerometerData.x) + Math.abs(accelerometerData.y);
    const gyroscopeMovement = Math.abs(gyroscopeData.x) + Math.abs(gyroscopeData.y);
    const totalMovement = (accelerometerMovement + gyroscopeMovement) / 2;
    
    // Quanto mais movimento, mais vermelho intenso
    const intensity = Math.min(255, Math.floor(255 * (1 + totalMovement)));
    return `rgb(${intensity}, 0, 0)`;
  };

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
                { translateY: accelerometerData.y * 100 },
                { rotate: `${gyroscopeData.z * 50}deg` } // Adiciona rotação baseada no giroscópio
              ],
              backgroundColor: getBubbleColor(),
            }
          ]} 
        />
      </View>

      <Text style={styles.instruction}>
        Mantenha a bolinha no centro do círculo!
      </Text>

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Acelerômetro: {Math.abs(accelerometerData.x + accelerometerData.y).toFixed(3)}
        </Text>
        <Text style={styles.debugText}>
          Giroscópio: {Math.abs(gyroscopeData.x + gyroscopeData.y).toFixed(3)}
        </Text>
      </View>
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
    marginBottom: 20,
  },
  debugInfo: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});