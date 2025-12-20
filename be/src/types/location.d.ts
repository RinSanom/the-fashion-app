export type LocationMetaData = {
  type: string | "Point";
  coordinates: Coordinate;
};

export type Coordinate = {
  latidute: number;
  longtitude: number;
};
