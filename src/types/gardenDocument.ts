import type { Plant } from "@/types/plant";
import type { ConstructionPinSpec } from "@/types/constructionPin";
import type { GardenDocument } from "@/types/gardenDocument";

export interface GardenDocument {
  plants: Plant[];
  constructionPins: ConstructionPinSpec[];
}