import * as Linking from 'expo-linking';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLeads } from '@/lib/queries';
import { formatDateTime } from '@/lib/format';

export default function LeadsScreen() {
  const [search, setSearch] = useState('');
  const params = new URLSearchParams({ page: '1', limit: '20', search });
  const { data, isLoading, refetch } = useLeads(params);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Leads</ThemedText>
      <TextInput value={search} onChangeText={setSearch} placeholder="Buscar por nome, email, mensagem..." style={styles.input} />
      <Pressable style={styles.reload} onPress={() => refetch()}>
        <ThemedText>Atualizar</ThemedText>
      </Pressable>
      {(data?.leads ?? []).map((lead) => (
        <ThemedView key={lead.id} style={styles.card}>
          <ThemedText type="defaultSemiBold">{lead.name}</ThemedText>
          <ThemedText>{lead.message}</ThemedText>
          <ThemedText>Canal: {lead.channel}</ThemedText>
          <ThemedText>Data: {formatDateTime(lead.createdAt)}</ThemedText>
          {lead.property?.title ? <ThemedText>Imovel: {lead.property.title}</ThemedText> : null}
          <View style={styles.actions}>
            {lead.phone ? (
              <Pressable onPress={() => Linking.openURL(`tel:${lead.phone}`)}>
                <ThemedText type="link">Ligar</ThemedText>
              </Pressable>
            ) : null}
            {lead.email ? (
              <Pressable onPress={() => Linking.openURL(`mailto:${lead.email}`)}>
                <ThemedText type="link">Email</ThemedText>
              </Pressable>
            ) : null}
          </View>
        </ThemedView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 64, paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  reload: { alignItems: 'flex-start' },
  card: {
    borderRadius: 10,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
    padding: 12,
    gap: 4,
  },
  actions: { flexDirection: 'row', gap: 12 },
});
