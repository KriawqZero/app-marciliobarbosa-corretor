# App Marcílio Barbosa

Aplicativo móvel desenvolvido para auxiliar na gestão do dia a dia do corretor. Serve como uma interface nativa e direta para o controle de agenda e fluxo de clientes, integrado ao ecossistema principal.

## Contexto do Projeto

Este projeto é a interface mobile do ecossistema criado para o meu pai (corretor Marcílio Barbosa).

Como ele é leigo em tecnologia, a área administrativa padrão de sistemas web ou CMSs convencionais costuma ser uma grande barreira no dia a dia. Por isso, desenvolvi este app nativo para ser instalado diretamente no seu celular. O foco exclusivo é a facilidade de uso: com apenas alguns toques e uma interface extremamente enxuta, ele consegue visualizar sua agenda, notificações e cadastrar novos imóveis de onde estiver.

O aplicativo atua apenas como cliente. Quando ele envia os dados brutos de um imóvel pelo celular, o backend web processa tudo com o auxílio da inteligência artificial (OpenAI), transformando informações cruas em publicações comerciais robustas sem que ele precise lidar com textos complexos.

A escolha de manter o app em um repositório separado garante que os ciclos de release mobile não interfiram no uptime do site principal, além de manter a base de código do app pequena e focada.

## Tecnologias e Arquitetura

- **Framework:** [Expo](https://expo.dev/) operando em Bare/Managed workflow, facilitando testes e deploy.
- **Roteamento:** [Expo Router](https://docs.expo.dev/router/introduction/) para navegação baseada em arquivos (`app/`), garantindo consistência com padrões modernos e suporte robusto a deep linking.
- **Requisições de Dados:** `@tanstack/react-query` para gerenciar estado assíncrono, cache de requisições à API e refetch inteligente, algo essencial para conexões móveis instáveis.
- **Formulários e Validação:** `react-hook-form` aliado ao `zod` para garantir segurança nos dados de entrada (como marcações de horário).
- **Componentes Nativos:** Uso de `expo-image` para alta performance visual e `expo-secure-store` para guardar tokens de autenticação com segurança.

## Estrutura Atual

O projeto utiliza um padrão de abas (Tabs) em sua raiz:

- `app/(tabs)/index.tsx`: Home - Visão rápida do dia e agendamentos pendentes.
- `app/(tabs)/explore.tsx`: Configurações - Ajustes de preferências e lembretes locais.
- `app/_layout.tsx`: Root layout, providers globais (QueryClient) e controle de estado.

## Como Executar Localmente

### Pré-requisitos
- Node.js 20+ (LTS recomendado)
- App `Expo Go` instalado no dispositivo físico, ou Android Studio/Xcode para rodar no emulador.

### Passos

1. **Instale as dependências:**
```bash
npm install
```

2. **Inicie o servidor local do Expo:**
```bash
npx expo start
```

### Dicas de Conexão no Dispositivo Físico

- **Via Wi-Fi (Rede Local):** Basta abrir o Expo Go e ler o QR code exibido no terminal. Certifique-se de não haver VPN ativa ou bloqueios de firewall na rede. Caso a conexão falhe, tente iniciar com a flag `--tunnel`.
- **Via Cabo (Estabilidade):** Ative a depuração USB no aparelho, conecte-o e rode o comando:
```bash
adb reverse tcp:8081 tcp:8081
npx expo start --localhost
```

## Próximos Passos (Roadmap)

- **Integração com Backend:** Conectar os endpoints reais (NestJS/Next.js API) utilizando o TanStack Query para persistência dos dados e sincronização de agenda em tempo real.
- **Módulo de Clientes:** Implementar a criação e edição do CRM interno diretamente pelo app.
- **Autenticação Segura:** Fluxo de login persistindo tokens no `SecureStore`.

## Aprendizados

Construir o app utilizando a união de **Expo Router** + **React Query** provou ser um divisor de águas na organização estrutural. O roteamento no estilo App Directory reduz a carga cognitiva em relação a configurações verbosas de navigation pura, e delegar o estado global de chamadas HTTP para o TanStack Query removeu quase por completo a necessidade de gerenciar `useEffect` e contextos complexos. O foco passou a ser apenas as telas e a experiência do usuário.
