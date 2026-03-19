import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useStats } from '@/lib/queries';

export default function DashboardScreen() {
  const { data, isLoading, refetch } = useStats();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Painel Administrativo</ThemedText>
      <ThemedText>Visao geral da operacao imobiliaria.</ThemedText>

      <ThemedView style={styles.grid}>
        <StatCard label="Imoveis" value={data?.properties.total ?? 0} />
        <StatCard label="Disponiveis" value={data?.properties.byStatus.disponivel ?? 0} />
        <StatCard label="Reservados" value={data?.properties.byStatus.reservado ?? 0} />
        <StatCard label="Leads 7 dias" value={data?.leads.last7Days ?? 0} />
      </ThemedView>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/imoveis/criar')}>
        <ThemedText style={styles.primaryButtonText}>Novo imovel</ThemedText>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => refetch()}>
        <ThemedText>Atualizar dados</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <ThemedView style={styles.statCard}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <ThemedText type="title">{value}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 64,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    gap: 10,
  },
  statCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    paddingVertical: 12,
    alignItems: 'center',
  },
});
