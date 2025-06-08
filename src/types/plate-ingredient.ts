export interface PlateIngredient {
  id: number;
  name: string;
  type: {
    id: number;
    name: string;
    color: string;
    label: string;
  };
  subtype?: {
    id: number;
    name: string;
    label: string;
  };
  metadata?: any;
  imageUrl: string;
}

export interface CreatePlateIngredientDto {
  name: string;
  type: string;
  metadata?: any;
  imageUrl: string;
}

export interface UpdatePlateIngredientDto extends CreatePlateIngredientDto {} 