import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [highScore, setHighScore] = useState<number | null>(null);

  useEffect(() => {
    loadScores();
  }, [params.score]); // Recarrega quando receber nova pontuação

  const loadScores = async () => {
    try {
      // Se recebemos uma pontuação via params, usamos ela
      if (params.score) {
        setLastScore(Number(params.score));
      } else {
        // Caso contrário, carregamos do AsyncStorage
        const storedLastScore = await AsyncStorage.getItem('lastScore');
        setLastScore(storedLastScore ? parseInt(storedLastScore) : null);
      }

      // Sempre carregamos o high score do storage
      const storedHighScore = await AsyncStorage.getItem('highScore');
      setHighScore(storedHighScore ? parseInt(storedHighScore) : null);
    } catch (error) {
      console.error('Erro ao carregar pontuações:', error);
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/game');
  };

  const handleBackToHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Resultado</Text>
        
        {lastScore === null ? (
          <View style={styles.scoreContainer}>
            <Text style={styles.message}>Você precisa jogar primeiro!</Text>
          </View>
        ) : (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Sua pontuação</Text>
            <Text style={styles.scoreValue}>{lastScore}</Text>
            
            {highScore !== null && highScore > 0 && (
              <>
                <Text style={styles.scoreLabel}>Recorde</Text>
                <Text style={[styles.scoreValue, styles.highScore]}>{highScore}</Text>
              </>
            )}
            
            <Text style={styles.message}>
              {lastScore > 15 
                ? 'Impressionante! Você é desenrolado!' 
                : 'Continue praticando!'}
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>Jogar Novamente</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleBackToHome}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Voltar ao Início
            </Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    marginTop: 20,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  highScore: {
    color: '#34C759',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});