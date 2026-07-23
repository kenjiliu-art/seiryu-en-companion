export interface InterpretiveArea {
  id: string

  name: "Upper Waterfall"  | "Middle Stream" | "Lower Pools"

  generation: "Issei" | "Nisei" | "Sansei"

  description: string

  plantIds: string[]

  featureIds: string[]

  photoIds: string[]
}