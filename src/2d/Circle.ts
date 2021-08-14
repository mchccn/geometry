import { LineSegment2D } from "./LineSegment2D";
import { Point2D } from "./Point2D";
import { Polygon } from "./Polygon";
import { Shape2D } from "./Shape2D";
import { PlanarEntity } from "./types";
import { EuclideanGeometryError } from "./utils";

export class Circle implements PlanarEntity<true> {
    protected pos: Point2D;

    public constructor(x = 0, y = 0, protected radius = 1) {
        this.pos = new Point2D(x, y);
    }

    public get x() {
        return this.pos.x;
    }

    public set x(x: number) {
        this.pos.x = x;
    }

    public get y() {
        return this.pos.y;
    }

    public set y(y: number) {
        this.pos.y = y;
    }

    public get r() {
        return this.radius;
    }

    public set r(r: number) {
        this.radius = r;
    }

    public get area() {
        return Math.PI * this.radius * this.radius;
    }

    public get circumference() {
        return 2 * Math.PI * this.radius;
    }

    public get TYPE() {
        return "CIRCLE" as const;
    }

    public static circumscribe(p: Shape2D) {
        const center = p instanceof Polygon ? p.centroid : new Point2D(p.x, p.y);

        function dist(p: Point2D, l: LineSegment2D) {
            const [v, w] = [l.a, l.b];

            const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;

            if (l2 === 0) return Point2D.distance(p, v);

            const t = Math.max(0, Math.min(1, ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2));

            return Point2D.distance(p, new Point2D(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
        }

        if (!p.edges.every((edge, i, a) => dist(center, edge) === dist(center, a[(i + 1) % a.length])))
            throw new EuclideanGeometryError(`No circle can be inscribed inside of this polygon.`);

        const d = dist(center, p.edges[0]);

        return new Circle(center.x, center.y, d);
    }

    public static inscribe(p: Shape2D) {
        const center = p instanceof Polygon ? p.centroid : new Point2D(p.x, p.y);

        const d = Math.max(...p.vertices.map((v) => Point2D.distance(v, center)));

        return new Circle(center.x, center.y, d);
    }
}
