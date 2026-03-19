import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';

import { PhotoPicker } from '@/components/property/photo-picker';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CITY_OPTIONS, PURPOSE_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from '@/lib/constants';
import { useGenerateWithAI } from '@/lib/queries';
import { CreatePropertyPayload, Property, PropertyImage } from '@/lib/types';

const schema = z.object({
  title: z.string().min(3, 'Informe um titulo valido.'),
  purpose: z.enum(['venda', 'aluguel']),
  type: z.enum(['casa', 'apartamento', 'terreno', 'rural', 'comercial']),
  city: z.enum(['corumba', 'ladario']),
  neighborhood: z.string().min(1, 'Informe o bairro.'),
  price: z.coerce.number().positive('Informe um preco valido.'),
  totalArea: z.coerce.number().positive('Informe a area total.'),
  bedrooms: z.coerce.number().nullable().optional(),
  bathrooms: z.coerce.number().nullable().optional(),
  parkingSpaces: z.coerce.number().nullable().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  priceNote: z.string().optional(),
  tagsInput: z.string().optional(),
  status: z.enum(['disponivel', 'reservado', 'vendido', 'alugado']),
  featured: z.boolean().default(false),
  specialOpportunity: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  initial?: Partial<Property>;
  mode: 'create' | 'edit';
  onSubmit: (payload: CreatePropertyPayload) => Promise<unknown>;
};

export function PropertyWizardForm({ initial, mode, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<PropertyImage[]>(initial?.gallery ?? []);
  const [rawNotes, setRawNotes] = useState('');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputBorder = useThemeColor({}, 'inputBorder');
  const mutedBorder = useThemeColor({}, 'mutedBorder');
  const textColor = useThemeColor({}, 'text');
  const primaryButton = useThemeColor({}, 'buttonPrimary');
  const dangerColor = useThemeColor({}, 'danger');
  const themedInputStyle = { backgroundColor: inputBackground, borderColor: inputBorder, color: textColor };
  const aiMutation = useGenerateWithAI();

  const defaultValues = useMemo<FormValues>(
    () => ({
      title: initial?.title ?? '',
      purpose: initial?.purpose ?? 'venda',
      type: initial?.type ?? 'casa',
      city: initial?.city ?? 'corumba',
      neighborhood: initial?.neighborhood ?? '',
      price: initial?.price ?? 0,
      totalArea: initial?.totalArea ?? 1,
      bedrooms: initial?.bedrooms ?? null,
      bathrooms: initial?.bathrooms ?? null,
      parkingSpaces: initial?.parkingSpaces ?? null,
      shortDescription: initial?.shortDescription ?? '',
      longDescription: initial?.longDescription ?? '',
      priceNote: initial?.priceNote ?? '',
      tagsInput: initial?.tags?.join(', ') ?? '',
      status: initial?.status ?? 'disponivel',
      featured: initial?.featured ?? false,
      specialOpportunity: initial?.specialOpportunity ?? false,
    }),
    [initial]
  );

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = async (values: FormValues) => {
    if (images.length === 0) {
      Alert.alert('Fotos obrigatorias', 'Adicione ao menos uma foto para publicar.');
      return;
    }
    const payload: CreatePropertyPayload = {
      ...values,
      images: images.map((img, idx) => ({ ...img, sortOrder: idx })),
      coverImageUrl: images[0]?.src,
      citySlug: values.city,
      tags: values.tagsInput
        ? values.tagsInput
            .split(',')
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean)
        : [],
      whatsappMessage: initial?.whatsappMessage,
    };
    await onSubmit(payload);
  };

  const generateWithAI = async () => {
    if (!rawNotes.trim()) {
      Alert.alert('Notas obrigatorias', 'Descreva informacoes basicas do imovel para a IA.');
      return;
    }

    try {
      const values = getValues();
      const generated = await aiMutation.mutateAsync({
        notes: rawNotes.trim(),
        context: {
          type: values.type,
          purpose: values.purpose,
          city: values.city,
          neighborhood: values.neighborhood,
          bedrooms: values.bedrooms ?? null,
          bathrooms: values.bathrooms ?? null,
          parkingSpaces: values.parkingSpaces ?? null,
          totalArea: values.totalArea ?? null,
          builtArea: initial?.builtArea ?? null,
          price: values.price ?? null,
        },
      });

      setValue('title', generated.title);
      setValue('shortDescription', generated.shortDescription);
      setValue('longDescription', generated.longDescription);
      setValue('priceNote', generated.priceNote ?? '');
      setValue('tagsInput', generated.tags.join(', '));

      Alert.alert('IA concluida', 'Texto gerado e aplicado no formulario.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao gerar texto com IA.';
      Alert.alert('Erro na IA', message);
    }
  };

  const getStepMissingRequiredFields = (currentStep: number): string[] => {
    const values = getValues();
    if (currentStep === 0) {
      return images.length === 0 ? ['Fotos'] : [];
    }
    if (currentStep === 1) {
      const missing: string[] = [];
      if (!values.title?.trim() || values.title.trim().length < 3) missing.push('Titulo');
      if (!values.neighborhood?.trim()) missing.push('Bairro');
      return missing;
    }
    if (currentStep === 2) {
      const missing: string[] = [];
      if (!Number.isFinite(Number(values.price)) || Number(values.price) <= 0) missing.push('Preco');
      if (!Number.isFinite(Number(values.totalArea)) || Number(values.totalArea) <= 0) {
        missing.push('Area total');
      }
      return missing;
    }
    if (currentStep === 3) {
      return values.status ? [] : ['Status'];
    }
    return [];
  };

  const onNext = async () => {
    if (step === 0) {
      if (images.length === 0) {
        Alert.alert('Campo obrigatorio', 'Adicione pelo menos uma foto para continuar.');
        return;
      }
      setStep((s) => Math.min(4, s + 1));
      return;
    }

    const fieldsByStep: Record<number, (keyof FormValues)[]> = {
      1: ['title', 'neighborhood'],
      2: ['price', 'totalArea'],
      3: ['status'],
    };

    const currentFields = fieldsByStep[step] ?? [];
    const valid = await trigger(currentFields);
    const missing = getStepMissingRequiredFields(step);

    if (!valid || missing.length > 0) {
      const message =
        missing.length > 0
          ? `Preencha os campos obrigatorios desta etapa:\n- ${missing.join('\n- ')}`
          : 'Preencha os campos obrigatorios desta etapa.';
      Alert.alert(
        'Campos obrigatorios pendentes',
        message
      );
      return;
    }

    setStep((s) => Math.min(4, s + 1));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="subtitle">
        {mode === 'create' ? 'Wizard de criacao' : 'Editar imovel'} - Passo {step + 1}/5
      </ThemedText>

      {step === 0 ? <PhotoPicker images={images} onChange={setImages} /> : null}

      {step === 1 ? (
        <View style={styles.section}>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Titulo do imovel"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.title?.message ? <ThemedText style={[styles.errorText, { color: dangerColor }]}>{errors.title.message}</ThemedText> : null}
          <OptionsField control={control} name="purpose" options={PURPOSE_OPTIONS} mutedBorder={mutedBorder} dangerColor={dangerColor} />
          <OptionsField control={control} name="type" options={TYPE_OPTIONS} mutedBorder={mutedBorder} dangerColor={dangerColor} />
          <OptionsField control={control} name="city" options={CITY_OPTIONS} mutedBorder={mutedBorder} dangerColor={dangerColor} />
          <Controller
            control={control}
            name="neighborhood"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Bairro"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.neighborhood?.message ? (
            <ThemedText style={[styles.errorText, { color: dangerColor }]}>{errors.neighborhood.message}</ThemedText>
          ) : null}
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.section}>
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Preco"
                placeholderTextColor="#8B949E"
                keyboardType="numeric"
                value={String(field.value ?? '')}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.price?.message ? <ThemedText style={[styles.errorText, { color: dangerColor }]}>{errors.price.message}</ThemedText> : null}
          <Controller
            control={control}
            name="totalArea"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Area total m2"
                placeholderTextColor="#8B949E"
                keyboardType="numeric"
                value={String(field.value ?? '')}
                onChangeText={field.onChange}
              />
            )}
          />
          {errors.totalArea?.message ? (
            <ThemedText style={[styles.errorText, { color: dangerColor }]}>{errors.totalArea.message}</ThemedText>
          ) : null}
          <Controller
            control={control}
            name="bedrooms"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Quartos"
                placeholderTextColor="#8B949E"
                keyboardType="numeric"
                value={field.value === null ? '' : String(field.value)}
                onChangeText={(v) => field.onChange(v ? Number(v) : null)}
              />
            )}
          />
          <Controller
            control={control}
            name="bathrooms"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Banheiros"
                placeholderTextColor="#8B949E"
                keyboardType="numeric"
                value={field.value === null ? '' : String(field.value)}
                onChangeText={(v) => field.onChange(v ? Number(v) : null)}
              />
            )}
          />
          <Controller
            control={control}
            name="parkingSpaces"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Vagas"
                placeholderTextColor="#8B949E"
                keyboardType="numeric"
                value={field.value === null ? '' : String(field.value)}
                onChangeText={(v) => field.onChange(v ? Number(v) : null)}
              />
            )}
          />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.section}>
          <TextInput
            style={[styles.input, themedInputStyle, styles.textArea]}
            multiline
            placeholder="Notas brutas para IA (ex: 3 quartos, piscina, area gourmet, aceita financiamento...)"
            placeholderTextColor="#8B949E"
            value={rawNotes}
            onChangeText={setRawNotes}
          />
          <Pressable style={[styles.aiButton, { backgroundColor: primaryButton }]} onPress={generateWithAI} disabled={aiMutation.isPending}>
            {aiMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.aiButtonText}>Gerar textos com IA</ThemedText>
            )}
          </Pressable>
          <Controller
            control={control}
            name="shortDescription"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Descricao curta"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="longDescription"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle, styles.textArea]}
                multiline
                placeholder="Descricao longa"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="priceNote"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Observacao de preco (ex: aceita financiamento)"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="tagsInput"
            render={({ field }) => (
              <TextInput
                style={[styles.input, themedInputStyle]}
                placeholder="Tags separadas por virgula"
                placeholderTextColor="#8B949E"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
          <OptionsField
            control={control}
            name="status"
            options={STATUS_OPTIONS}
            errorMessage={errors.status?.message}
            mutedBorder={mutedBorder}
            dangerColor={dangerColor}
          />
        </View>
      ) : null}

      {step === 4 ? (
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Revise os dados e publique.</ThemedText>
          <ThemedText>Fotos: {images.length}</ThemedText>
          {Object.values(errors).length > 0 ? <ThemedText>Existem campos pendentes.</ThemedText> : null}
        </View>
      ) : null}

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, { borderColor: mutedBorder }, step === 0 && styles.buttonDisabled]}
          onPress={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ThemedText>Voltar</ThemedText>
        </Pressable>
        {step < 4 ? (
          <Pressable style={[styles.button, { borderColor: mutedBorder }]} onPress={onNext}>
            <ThemedText>Proximo</ThemedText>
          </Pressable>
        ) : (
          <Pressable style={[styles.publishButton, { backgroundColor: primaryButton }]} onPress={handleSubmit(submit)} disabled={isSubmitting}>
            <ThemedText style={styles.publishButtonText}>{isSubmitting ? 'Salvando...' : 'Publicar imovel'}</ThemedText>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

function OptionsField({
  control,
  name,
  options,
  errorMessage,
  mutedBorder,
  dangerColor,
}: {
  control: any;
  name: string;
  options: { label: string; value: string }[];
  errorMessage?: string;
  mutedBorder: string;
  dangerColor: string;
}) {
  return (
    <View style={styles.section}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <View style={styles.optionRow}>
            {options.map((item) => {
              const selected = field.value === item.value;
              return (
                <Pressable
                  key={item.value}
                  style={[styles.optionChip, { borderColor: mutedBorder }, selected && styles.optionChipSelected]}
                  onPress={() => field.onChange(item.value)}
                >
                  <ThemedText style={selected ? styles.optionTextSelected : undefined}>{item.label}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      />
      {errorMessage ? <ThemedText style={[styles.errorText, { color: dangerColor }]}>{errorMessage}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  section: { gap: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionChipSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  optionTextSelected: { color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  button: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
  },
  buttonDisabled: { opacity: 0.6 },
  publishButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 12,
  },
  publishButtonText: { color: '#fff', fontWeight: '700' },
  aiButton: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    marginTop: -6,
  },
});
