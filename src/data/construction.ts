export interface ConstructionPin {
  id: string;
  x: number;
  y: number;
  title: string;
  photos: string[];
}

export const constructionPins: ConstructionPin[] = [
  // Copy the existing pin records from ConstructionGallery.tsx here.
];


// TODO:
// Expand this entry with documented names, project roles,
// archival sources, and historical context once approved
// by JACCC.
{
  id: "crew",
  x: 54.1,
  y: 54.8,
  title: "Southern California Gardeners Federation",
  description:
    "Members of the Southern California Gardeners Federation volunteered their expertise and labor to help build Seiryū-en in 1979.",
  photos: ["10"],
},