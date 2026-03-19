import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, View } from 'react-native';

import { PropertyWizardForm } from '@/components/wizard/property-wizard-form';
import { useProperty, useUpdateProperty } from '@/lib/queries';

export default function EditPropertyScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const propertyId = params.id;
  const { data, isLoading } = useProperty(propertyId);
  const mutation = useUpdateProperty();

  if (isLoading || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <PropertyWizardForm
      mode="edit"
      initial={data}
      onSubmit={async (payload) => {
        const updated = await mutation.mutateAsync({ ...payload, id: data.id });
        if (!updated?.id) {
          Alert.alert('Erro', 'Nao foi possivel preparar o compartilhamento deste imovel.');
          router.replace(`/(tabs)/imoveis/${data.id}`);
          return;
        }
        router.replace(`/(tabs)/imoveis/sucesso?id=${updated.id}`);
      }}
    />
  );
}
