import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { PropertyCard } from '@/components/property/property-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { STATUS_OPTIONS } from '@/lib/constants';
import { useProperties } from '@/lib/queries';
import { Property, PropertyStatus } from '@/lib/types';

export default function PropertiesListScreen() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PropertyStatus | ''>('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Property[]>([]);
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const mutedBorder = useThemeColor({}, 'mutedBorder');
  const textColor = useThemeColor({}, 'text');
  const primaryButton = useThemeColor({}, 'buttonPrimary');

  const params = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: '10' });
    if (search.trim()) p.set('search', search.trim());
    if (status) p.set('status', status);
    return p;
  }, [page, search, status]);

  const { data, isLoading, isFetching, refetch } = useProperties(params);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [search, status]);

  useEffect(() => {
    if (!data?.properties) return;
    if (page === 1) {
      setItems(data.properties);
      return;
    }

    setItems((prev) => {
      const seen = new Set(prev.map((item) => item.id));
      const next = [...prev];
      for (const property of data.properties) {
        if (!seen.has(property.id)) {
          next.push(property);
        }
      }
      return next;
    });
  }, [data, page]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Imoveis</ThemedText>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar imovel..."
        placeholderTextColor="#8B949E"
        style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor }]}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusRow}>
          <FilterChip label="Todos" selected={!status} onPress={() => setStatus('')} borderColor={mutedBorder} />
        {STATUS_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            selected={status === option.value}
            onPress={() => setStatus(option.value)}
              borderColor={mutedBorder}
          />
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={styles.reload}
          onPress={() => {
            setPage(1);
            refetch();
          }}
        >
          <ThemedText>Atualizar</ThemedText>
        </Pressable>
        <Pressable style={[styles.createButton, { backgroundColor: primaryButton }]} onPress={() => router.push('/(tabs)/imoveis/criar')}>
          <ThemedText style={styles.createButtonText}>Novo</ThemedText>
        </Pressable>
      </View>

      {items.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}

      {data?.hasNext ? (
        <Pressable
          style={[styles.loadMoreButton, { borderColor: mutedBorder }]}
          onPress={() => setPage((current) => current + 1)}
          disabled={isFetching}
        >
          {isFetching ? <ActivityIndicator /> : <ThemedText>Carregar mais</ThemedText>}
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
  borderColor,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  borderColor: string;
}) {
  return (
    <Pressable style={[styles.chip, { borderColor }, selected && styles.chipSelected]} onPress={onPress}>
      <ThemedText style={selected ? styles.chipTextSelected : undefined}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 16, paddingHorizontal: 16, paddingBottom: 24, gap: 12 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusRow: { gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipSelected: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  chipTextSelected: { color: '#fff' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reload: { paddingVertical: 6 },
  createButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createButtonText: { color: '#fff', fontWeight: '700' },
  loadMoreButton: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
});
