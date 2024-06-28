export interface MockGeo {
  type: string;
  features: [
    type: string,
    geometry: {
      type: string;
      coordinates: number[][][];
    },
    properties: {
      fill: string;
      status: string;
      published: string;
      diameter_in: number;
      feature_uuid: string;
      "fill-opacity": number;
      "stroke-width": number;
      hail_map_uuid: string;
      convective_date: string;
      hail_algorithm_version: string;
    }
  ];
}
