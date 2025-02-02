import React from 'react';
import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Início',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="game"
        options={{
          headerTitle: 'Jogo',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          headerTitle: 'Resultados',
          headerShown: true,
        }}
      />
    </Stack>
  );
} 