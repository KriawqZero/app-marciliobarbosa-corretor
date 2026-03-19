import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createProperty,
  deleteProperty,
  fetchLeads,
  fetchProperties,
  fetchProperty,
  fetchStats,
  generateWithAI,
  updateProperty,
  uploadImage,
} from '@/lib/api';
import { AIGenerateRequest, CreatePropertyPayload, UpdatePropertyPayload } from '@/lib/types';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  });
}

export function useProperties(params: URLSearchParams) {
  return useQuery({
    queryKey: ['properties', params.toString()],
    queryFn: () => fetchProperties(params),
  });
}

export function useProperty(idOrSlug: string, by: 'id' | 'slug' = 'id') {
  return useQuery({
    queryKey: ['property', by, idOrSlug],
    queryFn: () => fetchProperty(idOrSlug, by),
    enabled: Boolean(idOrSlug),
  });
}

export function useLeads(params: URLSearchParams) {
  return useQuery({
    queryKey: ['leads', params.toString()],
    queryFn: () => fetchLeads(params),
  });
}

export function useCreateProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePropertyPayload) => createProperty(payload),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['properties'] });
      client.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdatePropertyPayload) => updateProperty(payload),
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ['properties'] });
      client.invalidateQueries({ queryKey: ['stats'] });
      if (variables.id) {
        client.invalidateQueries({ queryKey: ['property', 'id', variables.id] });
      }
      if (variables.slug) {
        client.invalidateQueries({ queryKey: ['property', 'slug', variables.slug] });
      }
    },
  });
}

export function useDeleteProperty() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (identifier: { id?: string; slug?: string }) => deleteProperty(identifier),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['properties'] });
      client.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (payload: { uri: string; filename?: string; mimeType?: string }) =>
      uploadImage(payload.uri, payload.filename, payload.mimeType),
  });
}

export function useGenerateWithAI() {
  return useMutation({
    mutationFn: (payload: AIGenerateRequest) => generateWithAI(payload),
  });
}
