import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { testConnection } from '@/lib/api';
import { clearCredentials, getCredentials, saveCredentials } from '@/lib/storage';

export default function ConfigScreen() {
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCredentials().then((credentials) => {
      if (credentials) {
        setBaseUrl(credentials.baseUrl);
        setToken(credentials.token);
      }
    });
  }, []);

  const onSave = async () => {
    try {
      setLoading(true);
      await testConnection(baseUrl, token);
      await saveCredentials(baseUrl, token);
      Alert.alert('Sucesso', 'Configuracao salva.');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha ao validar configuracao.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    await clearCredentials();
    router.replace('/setup');
  };

  const onOpenSite = async () => {
    if (!baseUrl.trim()) {
      Alert.alert('URL nao configurada', 'Informe e salve a URL do site primeiro.');
      return;
    }
    const url = baseUrl.trim().replace(/\/+$/, '');
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Nao foi possivel abrir', 'Verifique a URL do site nas configuracoes.');
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Configuracoes</ThemedText>
      <TextInput style={styles.input} value={baseUrl} onChangeText={setBaseUrl} placeholder="URL do site" />
      <TextInput
        style={styles.input}
        value={token}
        onChangeText={setToken}
        placeholder="Token da API"
        secureTextEntry
      />
      <Pressable style={styles.primaryButton} onPress={onSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.primaryButtonText}>Salvar e testar</ThemedText>}
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onReset}>
        <ThemedText>Trocar credenciais</ThemedText>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onOpenSite}>
        <ThemedText>Abrir site no navegador</ThemedText>
      </Pressable>
      <View>
        <ThemedText>Versao: {Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#c7c7c7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
});
