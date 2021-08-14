import { Point2D } from "./Point2D";

export type PolygonType = `${number}_GON`;

export interface Rotatable {
    a: number;
    rotate(a: number, about: Point2D): this;
}

export type PlanarEntity<IsCircle extends boolean = false> = IsCircle extends true
    ? {
          area: number;
          circumference: number;
      }
    : {
          area: number;
          perimeter: number;
      };
