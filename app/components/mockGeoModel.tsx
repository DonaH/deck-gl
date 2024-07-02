export interface FeatureCollection {
  type: string
  features: Feature[]
}

export interface Feature {
  type: string
  geometry: Geometry
  properties: Properties
}

export interface Geometry {
  type: string
  coordinates: number[][][]
}

export interface Properties {
  fill: string
  status: string
  published: string
  diameter_in: number
  feature_uuid: string
  "fill-opacity": number
  "stroke-width": number
  hail_map_uuid: string
  convective_date: string
  hail_algorithm_version: string
}
