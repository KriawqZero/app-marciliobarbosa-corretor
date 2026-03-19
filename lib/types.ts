export type PropertyPurpose = 'venda' | 'aluguel';
export type PropertyType = 'casa' | 'apartamento' | 'terreno' | 'rural' | 'comercial';
export type PropertyCity = 'corumba' | 'ladario';
export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido' | 'alugado';
export type LeadChannel = 'whatsapp' | 'telefone' | 'email' | 'formulario';

export type PropertyImage = {
  id?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  sortOrder?: number;
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  city: PropertyCity;
  citySlug: string;
  neighborhood: string;
  price: number;
  priceSuffix: string | null;
  priceNote: string | null;
  shortDescription: string;
  longDescription: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  totalArea: number;
  builtArea: number | null;
  coverImage: string;
  featured: boolean;
  specialOpportunity: boolean;
  tags: string[];
  status: PropertyStatus;
  whatsappMessage: string;
  gallery?: PropertyImage[];
  createdAt: string;
  updatedAt: string;
};

export type PaginatedPropertiesResponse = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
  properties: Property[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  channel: LeadChannel;
  propertyId: string | null;
  property?: {
    id: string;
    slug: string;
    title: string;
  } | null;
  createdAt: string;
};

export type PaginatedLeadsResponse = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
  leads: Lead[];
};

export type StatsResponse = {
  properties: {
    total: number;
    byStatus: Record<PropertyStatus, number>;
    byType: Record<PropertyType, number>;
    byPurpose: Record<PropertyPurpose, number>;
    featured: number;
    specialOpportunity: number;
  };
  leads: {
    total: number;
    last7Days: number;
    last30Days: number;
  };
};

export type UploadResponse = {
  url: string;
  width: number;
  height: number;
  tempId: string;
  filename: string;
};

export type CreatePropertyPayload = {
  title: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  city: PropertyCity;
  citySlug?: string;
  neighborhood?: string;
  price: number;
  priceSuffix?: string | null;
  priceNote?: string | null;
  shortDescription?: string;
  longDescription?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  totalArea?: number;
  builtArea?: number | null;
  coverImageUrl?: string;
  featured?: boolean;
  specialOpportunity?: boolean;
  tags?: string[];
  status?: PropertyStatus;
  whatsappMessage?: string;
  images?: PropertyImage[];
};

export type UpdatePropertyPayload = Partial<CreatePropertyPayload> & {
  id?: string;
  slug?: string;
};

export type AIGenerateRequest = {
  notes: string;
  context?: {
    type?: PropertyType;
    purpose?: PropertyPurpose;
    city?: PropertyCity;
    neighborhood?: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    parkingSpaces?: number | null;
    totalArea?: number | null;
    builtArea?: number | null;
    price?: number | null;
  };
};

export type AIGenerateResponse = {
  title: string;
  shortDescription: string;
  longDescription: string;
  tags: string[];
  priceNote: string | null;
};
