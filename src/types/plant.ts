export interface PlantLink {
  label: string;
  url: string;
}

export interface PlantCategoryReferences {
  label: string;
  refs: string[];
}

export interface Plant {
  id: string;
  name: string;
  japanese?: string;
  romaji?: string;
  scientific?: string;
  description: string;
  manyoshu?: string[];
  categoryRefs?: PlantCategoryReferences;
  substitute?: boolean;
  links?: PlantLink[];
  x: number;
  y: number;
}