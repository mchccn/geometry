import { Point2D } from "./Point2D";
import { EuclideanGeometryError } from "./utils";

export class Line2D {
    private def: [Point2D, Point2D];

    public constructor(a: Point2D, b: Point2D) {
        if (a.equals(b)) throw new EuclideanGeometryError(`Lines are defined by two distinct points.`);

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

    public static from(form: "SLOPE_INTERCEPT", slope: number, intercept: number): Line2D;
    public static from(form: "POINT_SLOPE", point: Point2D, slope: number): Line2D;
    public static from(form: "STANDARD", a: number, b: number, c: number): Line2D;
    public static from(form: "SLOPE_INTERCEPT" | "POINT_SLOPE" | "STANDARD", a: number | Point2D, b: number, c?: number) {
        if (form === "SLOPE_INTERCEPT") return new Line2D(new Point2D(0, b), new Point2D(1, b - (a as number)));

        if (form === "POINT_SLOPE") return new Line2D(a as Point2D, new Point2D((a as Point2D).x + 1, (a as Point2D).y - b));

        if (form === "STANDARD") return Line2D.from("SLOPE_INTERCEPT", -a / b, (c as number) / b);

        return Line2D.x;
    }

    public static get x() {
        return new Line2D(Point2D.origin, new Point2D(1, 0));
    }

    public static get y() {
        return new Line2D(Point2D.origin, new Point2D(0, 1));
    }
}
