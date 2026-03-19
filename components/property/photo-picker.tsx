import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useUploadImage } from '@/lib/queries';
import { PropertyImage } from '@/lib/types';

export function PhotoPicker({
  images,
  onChange,
}: {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
}) {
  const uploadMutation = useUploadImage();
  const [busy, setBusy] = useState(false);

  const pickFromLibrary = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (response.canceled) return;

    try {
      setBusy(true);
      const uploaded = await Promise.all(
        response.assets.map(async (asset, idx) => {
          const result = await uploadMutation.mutateAsync({
            uri: asset.uri,
            filename: asset.fileName ?? `foto-${Date.now()}-${idx}.jpg`,
            mimeType: asset.mimeType ?? 'image/jpeg',
          });
          return {
            src: result.url,
            alt: 'Foto do imovel',
            width: result.width,
            height: result.height,
            sortOrder: images.length + idx,
          } satisfies PropertyImage;
        })
      );
      onChange([...images, ...uploaded]);
    } finally {
      setBusy(false);
    }
  };

  const removeAt = (index: number) => {
    const next = images.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, sortOrder: idx }));
    onChange(next);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickFromLibrary} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Selecionar fotos</ThemedText>}
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {images.map((item, index) => (
          <Pressable key={`${item.src}-${index}`} onLongPress={() => removeAt(index)}>
            <Image source={{ uri: item.src }} style={styles.image} contentFit="cover" />
          </Pressable>
        ))}
      </ScrollView>
      <ThemedText>Pressione e segure uma imagem para remover.</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  button: {
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
  list: { gap: 8 },
  image: { width: 120, height: 90, borderRadius: 8 },
});
