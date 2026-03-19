import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { testConnection } from '@/lib/api';
import { clearCredentials, getCredentials, saveCredentials } from '@/lib/storage';

export default function ConfigScreen() {
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const mutedBorder = useThemeColor({}, 'mutedBorder');
  const textColor = useThemeColor({}, 'text');
  const primaryButton = useThemeColor({}, 'buttonPrimary');
  const tintColor = useThemeColor({}, 'tint');

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
      <TextInput
        style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor }]}
        value={baseUrl}
        onChangeText={setBaseUrl}
        placeholder="URL do site"
        placeholderTextColor="#8B949E"
      />
      <TextInput
        style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor }]}
        value={token}
        onChangeText={setToken}
        placeholder="Token da API"
        placeholderTextColor="#8B949E"
        secureTextEntry
      />
      <Pressable style={[styles.primaryButton, { backgroundColor: primaryButton }]} onPress={onSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.primaryButtonText}>Salvar e testar</ThemedText>}
      </Pressable>
      <Pressable style={[styles.secondaryButton, { borderColor: mutedBorder }]} onPress={onReset}>
        <ThemedText>Trocar credenciais</ThemedText>
      </Pressable>
      <Pressable style={[styles.secondaryButton, { borderColor: mutedBorder }]} onPress={onOpenSite}>
        <ThemedText>Abrir site no navegador</ThemedText>
      </Pressable>
      <View>
        <ThemedText>Versao: {Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
        <ThemedText style={styles.creditText}>
          Desenvolvido por{' '}
          <ThemedText
            style={[styles.creditLink, { color: tintColor }]}
            onPress={() => Linking.openURL('https://marciliortiz.dev.br')}
          >
            Marcilio Ortiz
          </ThemedText>
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingHorizontal: 20, gap: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  creditText: {
    marginTop: 8,
  },
  creditLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
