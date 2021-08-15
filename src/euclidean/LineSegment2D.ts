import { Point2D } from "./Point2D";
import { EuclideanGeometryError } from "./utils";

export class LineSegment2D {
    private def: [Point2D, Point2D];

    public constructor(a: Point2D, b: Point2D) {
        if (a.equals(b)) throw new EuclideanGeometryError(`Line segments are defined by two distinct points.`);

        this.def = b.x > a.x && b.y > a.y ? [b, a] : [a, b];
    }

    public get m() {
        return (this.def[0].y - this.def[1].y) / (this.def[0].x - this.def[1].x);
    }

    public get a() {
        return this.def[0];
    }

    public get b() {
        return this.def[1];
    }

    public get length() {
        return Point2D.distance(...this.def);
    }
}
