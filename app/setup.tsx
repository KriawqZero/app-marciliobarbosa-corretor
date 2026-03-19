import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { testConnection } from '@/lib/api';
import { saveCredentials } from '@/lib/storage';

export default function SetupScreen() {
  const [baseUrl, setBaseUrl] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const textColor = useThemeColor({}, 'text');
  const primaryButton = useThemeColor({}, 'buttonPrimary');
  const tintColor = useThemeColor({}, 'tint');

  const onSubmit = async () => {
    if (!baseUrl.trim() || !token.trim()) {
      Alert.alert('Campos obrigatorios', 'Preencha URL e token.');
      return;
    }

    try {
      setLoading(true);
      await testConnection(baseUrl, token);
      await saveCredentials(baseUrl, token);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao validar as credenciais.';
      Alert.alert('Nao foi possivel conectar', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Configurar acesso</ThemedText>
        <ThemedText>Informe a URL do site e o token da API para liberar o painel.</ThemedText>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor },
          ]}
          placeholder="https://seu-site.com.br"
          placeholderTextColor="#8B949E"
          autoCapitalize="none"
          autoCorrect={false}
          value={baseUrl}
          onChangeText={setBaseUrl}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor },
          ]}
          placeholder="Bearer token"
          placeholderTextColor="#8B949E"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={token}
          onChangeText={setToken}
        />
      </View>

      <Pressable
        style={[styles.button, { backgroundColor: primaryButton }, loading && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Conectar</ThemedText>}
      </Pressable>

      <ThemedText style={styles.creditText}>
        Desenvolvido por{' '}
        <ThemedText style={[styles.creditLink, { color: tintColor }]} onPress={() => Linking.openURL('https://marciliortiz.dev.br')}>
          Marcilio Ortiz
        </ThemedText>
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  creditText: {
    marginTop: 4,
  },
  creditLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
