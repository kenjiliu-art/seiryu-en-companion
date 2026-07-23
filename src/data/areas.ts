export interface InterpretiveArea {
  id: string;

  /**
   * Public display name.
   */
  name: string;

  /**
   * Original interpretive framework of the garden.
   */
  generation: "Issei" | "Nisei" | "Sansei";

  /**
   * Description shown to visitors.
   *
   * Leave blank until approved documentation is available.
   */
  description: string;

  /**
   * Plant IDs from plants.ts
   */
  plantIds: string[];

  /**
   * Feature IDs from features.ts
   */
  featureIds: string[];

  /**
   * Construction photo IDs
   */
  photoIds: string[];
}

export const interpretiveAreas: InterpretiveArea[] = [
  {
    id: "upper-waterfall",
    name: "Upper Waterfall",
    generation: "Issei",
    description: "",
    plantIds: [],
    featureIds: [],
    photoIds: [],
  },

  {
    id: "middle-stream",
    name: "Middle Stream",
    generation: "Nisei",
    description: "",
    plantIds: [],
    featureIds: [],
    photoIds: [],
  },

  {
    id: "lower-pools",
    name: "Lower Pools",
    generation: "Sansei",
    description: "",
    plantIds: [],
    featureIds: [],
    photoIds: [],
  },
];