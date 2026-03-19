# app-marciliobarbosa-corretor

Aplicativo base em Expo + React Native com duas abas:

- `Home`: visão inicial com próximos agendamentos.
- `Settings`: ajustes simples (notificações e lembrete).

## Requisitos

- Node.js 20+ (recomendado LTS)
- npm
- Android Studio (opcional, para emulador)
- Celular Android com app `Expo Go` instalado

## Como rodar o projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run start
```

ou:

```bash
npx expo start
```

## Rodar no Android (recomendado para dev)

### Opção 1 - Rede local (LAN) - mais simples

Melhor para começar, se computador e celular estão na mesma rede Wi-Fi.

1. Com `expo start` rodando, abra o app `Expo Go` no Android.
2. Escaneie o QR code exibido no terminal.
3. O app abre no celular e recarrega automaticamente após mudanças.

Se não conectar:

- confira se os dois dispositivos estão na mesma rede;
- desative VPN/proxy temporariamente;
- teste iniciar com:

```bash
npx expo start --tunnel
```

(`--tunnel` costuma funcionar quando a rede local bloqueia conexões).

### Opção 2 - USB (mais estável em redes problemáticas)

Boa quando o Wi-Fi está instável, mas exige ADB configurado.

1. Ative `Opções do desenvolvedor` e `Depuração USB` no Android.
2. Conecte o celular via USB.
3. Verifique se o dispositivo foi reconhecido:

```bash
adb devices
```

4. Faça o redirecionamento de porta:

```bash
adb reverse tcp:8081 tcp:8081
```

5. Inicie o Expo:

```bash
npx expo start --localhost
```

6. Abra no `Expo Go` (normalmente funciona direto após o reverse).

## Scripts úteis

- `npm run start` - inicia o servidor Expo.
- `npm run android` - tenta abrir no Android automaticamente.
- `npm run web` - abre a versão web.
- `npm run lint` - executa lint.

## Estrutura principal

- `app/(tabs)/index.tsx` - tela Home.
- `app/(tabs)/explore.tsx` - tela Settings.
- `app/(tabs)/_layout.tsx` - configuração das abas.

## Próximos passos sugeridos

- integrar backend para persistir agendamentos;
- adicionar cadastro de clientes;
- implementar criação/edição de horário.
