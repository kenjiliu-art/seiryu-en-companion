import type { Plant } from "@/types/plant";
import type { GardenDocument } from "@/types/gardenDocument";
import { plants as seedPlants } from "@/data/plants";
import { constructionPins } from "@/data/constructionPins";

export interface GardenRepository {
  getAllPlants(): Plant[];
  getPlantById(id: string): Plant | undefined;
  updatePlantPosition(
    id: string,
    x: number,
    y: number,
  ): Plant[];
}

class StaticGardenRepository implements GardenRepository {
  private document: GardenDocument;

  constructor(plants: Plant[]) {
    this.document = {
      plants: plants.map((plant) => ({ ...plant })),
      constructionPins: constructionPins.map((pin) => ({ ...pin })),
    };
  }

  getAllPlants(): Plant[] {
    return this.document.plants;
  }

  getPlantById(id: string): Plant | undefined {
    return this.document.plants.find(
      (plant) => plant.id === id,
    );
  }

  updatePlantPosition(
    id: string,
    x: number,
    y: number,
  ): Plant[] {
    this.document.plants = this.document.plants.map(
      (plant) =>
        plant.id === id
          ? { ...plant, x, y }
          : plant,
    );

    return this.getAllPlants();
  }
}

export const gardenRepository: GardenRepository =
  new StaticGardenRepository(seedPlants);