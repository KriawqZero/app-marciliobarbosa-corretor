import { router } from 'expo-router';
import { Alert } from 'react-native';

import { PropertyWizardForm } from '@/components/wizard/property-wizard-form';
import { useCreateProperty } from '@/lib/queries';

export default function CreatePropertyScreen() {
  const mutation = useCreateProperty();

  return (
    <PropertyWizardForm
      mode="create"
      onSubmit={async (payload) => {
        const property = await mutation.mutateAsync(payload);
        if (!property?.id) {
          Alert.alert('Erro', 'Nao foi possivel localizar o imovel criado para compartilhamento.');
          router.replace('/(tabs)/imoveis');
          return;
        }
        router.replace(`/(tabs)/imoveis/sucesso?id=${property.id}`);
      }}
    />
  );
}
