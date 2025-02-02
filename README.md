# Desafio do Equilíbrio

Um jogo mobile desenvolvido com React Native e Expo que testa suas habilidades de estabilidade usando os sensores do dispositivo.

## 📱 Sobre o Projeto

O Desafio do Equilíbrio é um jogo onde o objetivo é manter seu dispositivo o mais estável possível. Uma bolinha na tela reage aos movimentos do seu dispositivo através do acelerômetro, e você marca pontos mantendo-a estável no centro de um círculo.

### Características Principais

- 🎮 Gameplay simples e viciante
- 📊 Sistema de pontuação em tempo real
- 🏆 Sistema de recordes
- 📱 Interface limpa e intuitiva
- 🔄 Feedback visual e tátil

## 🛠️ Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

### Sensores e APIs Nativas

- `expo-sensors` (Acelerômetro)
- `expo-haptics` (Feedback tátil)
- `@react-native-async-storage/async-storage` (Armazenamento local)

## 🚀 Como Executar

1. Clone o repositório:
   ```bash
   git clone [url-do-repositorio]
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npx expo start
   ```

4. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR Code ou execute em um emulador.

## 📱 Funcionalidades

### Jogo
- Timer de 30 segundos
- Pontuação baseada na estabilidade do dispositivo
- Feedback visual da estabilidade através da cor da bolinha
- Feedback tátil ao pontuar

### Sistema de Pontuação
- Pontos são acumulados a cada segundo que o dispositivo permanece estável
- Sistema de recordes persistente
- Histórico da última pontuação

## 🎮 Como Jogar

1. Inicie o jogo tocando em "Iniciar Jogo"
2. Mantenha seu dispositivo o mais estável possível
3. A bolinha ficará:
   - 🔵 Azul quando estável (pontuando)
   - 🔴 Vermelha quando instável
4. Tente manter a bolinha no centro do círculo
5. Cada segundo estável = 1 ponto
6. O jogo termina após 30 segundos

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Sinta-se à vontade para:

1. Reportar bugs
2. Sugerir novas funcionalidades
3. Enviar pull requests

## 📄 Licença

Este projeto foi feito por [@Leanderson](https://github.com/leanderson01) e por [@Saulo](https://github.com/saulocastelob)
