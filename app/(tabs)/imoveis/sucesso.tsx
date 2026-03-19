import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatCurrencyBRL } from '@/lib/format';
import { useProperty } from '@/lib/queries';
import { getCredentials } from '@/lib/storage';

export default function PublishSuccessScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const propertyId = params.id;
  const { data, isLoading } = useProperty(propertyId);

  const message = useMemo(() => {
    if (!data) return '';
    return [
      data.title,
      formatCurrencyBRL(data.price),
      '',
      data.shortDescription || '',
      '',
      'Mais informacoes no nosso site:',
      '<link>',
    ]
      .filter(Boolean)
      .join('\n');
  }, [data]);

  const onShare = async () => {
    if (!data) return;
    const credentials = await getCredentials();
    const baseUrl = credentials?.baseUrl ?? '';
    const propertyUrl = `${baseUrl}/imovel/${data.slug}`;
    const finalMessage = message.replace('<link>', propertyUrl);
    await Share.share({ message: finalMessage });
  };

  const onOpenSite = async () => {
    if (!data) return;
    const credentials = await getCredentials();
    const baseUrl = credentials?.baseUrl ?? '';
    const propertyUrl = `${baseUrl}/imovel/${data.slug}`;
    const canOpen = await Linking.canOpenURL(propertyUrl);
    if (!canOpen) {
      Alert.alert('Nao foi possivel abrir', 'Verifique a URL configurada do site.');
      return;
    }
    await Linking.openURL(propertyUrl);
  };

  if (isLoading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Imovel salvo com sucesso</ThemedText>
      <ThemedText>Agora voce pode compartilhar o anuncio nas redes sociais.</ThemedText>

      <View style={styles.card}>
        <Image source={{ uri: data.coverImage }} style={styles.cover} contentFit="cover" />
        <ThemedText type="defaultSemiBold">{data.title}</ThemedText>
        <ThemedText>{formatCurrencyBRL(data.price)}</ThemedText>
        <ThemedText>{data.shortDescription}</ThemedText>
      </View>

      <Pressable style={styles.primaryButton} onPress={onShare}>
        <ThemedText style={styles.primaryButtonText}>Compartilhar nas redes</ThemedText>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onOpenSite}>
        <ThemedText>Abrir anuncio no navegador</ThemedText>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)/imoveis')}>
        <ThemedText>Voltar para lista</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
    padding: 12,
    gap: 8,
  },
  cover: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  primaryButton: {
    borderRadius: 10,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
