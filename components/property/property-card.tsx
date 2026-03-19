import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { formatCurrencyBRL } from '@/lib/format';
import { Property } from '@/lib/types';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/(tabs)/imoveis/${property.id}`)}>
      <Image source={{ uri: property.coverImage }} style={styles.image} contentFit="cover" />
      <View style={styles.content}>
        <ThemedText type="defaultSemiBold">{property.title}</ThemedText>
        <ThemedText>{formatCurrencyBRL(property.price)}</ThemedText>
        <ThemedText>
          {property.city} - {property.neighborhood}
        </ThemedText>
        <ThemedText>Status: {property.status}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(127, 127, 127, 0.12)',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
    gap: 4,
  },
});
