import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { formatCurrencyBRL } from '@/lib/format';
import { useDeleteProperty, useProperty, useUpdateProperty } from '@/lib/queries';

export default function PropertyDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const propertyId = params.id;
  const { data, isLoading, refetch } = useProperty(propertyId);
  const deleteMutation = useDeleteProperty();
  const updateMutation = useUpdateProperty();

  if (isLoading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  const toggleReserved = async () => {
    const nextStatus = data.status === 'reservado' ? 'disponivel' : 'reservado';
    await updateMutation.mutateAsync({ id: data.id, status: nextStatus });
    refetch();
  };

  const deleteItem = () => {
    Alert.alert('Remover imovel', 'Tem certeza que deseja remover este imovel?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          await deleteMutation.mutateAsync({ id: data.id });
          router.replace('/(tabs)/imoveis');
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: data.coverImage }} style={styles.cover} contentFit="cover" />
      <ThemedText type="title">{data.title}</ThemedText>
      <ThemedText>{formatCurrencyBRL(data.price)}</ThemedText>
      <ThemedText>{data.longDescription}</ThemedText>
      <ThemedText>Status: {data.status}</ThemedText>
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={() => router.push(`/(tabs)/imoveis/editar/${data.id}`)}>
          <ThemedText>Editar</ThemedText>
        </Pressable>
        <Pressable style={styles.button} onPress={toggleReserved}>
          <ThemedText>{data.status === 'reservado' ? 'Marcar disponivel' : 'Reservar'}</ThemedText>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={deleteItem}>
          <ThemedText style={styles.deleteText}>Excluir</ThemedText>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 10, paddingBottom: 24 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cover: { width: '100%', height: 220, borderRadius: 12 },
  actions: { gap: 8 },
  button: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: '#b00020',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  deleteText: { color: '#b00020', fontWeight: '700' },
});
