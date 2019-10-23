import Reactotron from 'reactotron-react-native';

// Variavel global do react native que retorna true quando o usuario ta rodando no emulador em ambiente de desenvolvimento.
if (__DEV__) {
  const tron = Reactotron.configure()
    .useReactNative()
    .connect();

  console.tron = tron;

  // Limpa a timeline no Reactotron toda vez que atualiza a timeline
  tron.clear();
}
