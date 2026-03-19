import { Stack } from 'expo-router';

export default function ImoveisLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Imoveis' }} />
      <Stack.Screen name="criar" options={{ title: 'Novo imovel' }} />
      <Stack.Screen name="sucesso" options={{ title: 'Publicacao pronta' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhe do imovel' }} />
      <Stack.Screen name="editar/[id]" options={{ title: 'Editar imovel' }} />
    </Stack>
  );
}
