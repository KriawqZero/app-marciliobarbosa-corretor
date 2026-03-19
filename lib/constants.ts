import { PropertyCity, PropertyPurpose, PropertyStatus, PropertyType } from '@/lib/types';

export const PURPOSE_OPTIONS: Array<{ label: string; value: PropertyPurpose }> = [
  { label: 'Venda', value: 'venda' },
  { label: 'Aluguel', value: 'aluguel' },
];

export const TYPE_OPTIONS: Array<{ label: string; value: PropertyType }> = [
  { label: 'Casa', value: 'casa' },
  { label: 'Apartamento', value: 'apartamento' },
  { label: 'Terreno', value: 'terreno' },
  { label: 'Rural', value: 'rural' },
  { label: 'Comercial', value: 'comercial' },
];

export const CITY_OPTIONS: Array<{ label: string; value: PropertyCity }> = [
  { label: 'Corumba', value: 'corumba' },
  { label: 'Ladario', value: 'ladario' },
];

export const STATUS_OPTIONS: Array<{ label: string; value: PropertyStatus }> = [
  { label: 'Disponivel', value: 'disponivel' },
  { label: 'Reservado', value: 'reservado' },
  { label: 'Vendido', value: 'vendido' },
  { label: 'Alugado', value: 'alugado' },
];

export const DEFAULT_PAGE_SIZE = 20;
