import { Point2D } from "./Point2D";
import { Shape2D } from "./Shape2D";
import { PlanarEntity, PolygonType } from "./types";
import { EuclideanGeometryError } from "./utils";

export class Polygon<Mesh extends Point2D[] = Point2D[], Type extends string = PolygonType> extends Shape2D<Mesh, Type> implements PlanarEntity {
    protected angle = 0;

    public constructor(x: number, y: number, vertices: Point2D[]) {
        super(new Point2D(x, y), vertices as Mesh, `${vertices.length}_GON` as Type);

        if (vertices.length < 3) throw new EuclideanGeometryError(`Polygons must have at least 3 vertices.`);
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public get area() {
        let area = 0;

        this.mesh.forEach((v0, i, a) => {
            const v1 = a[(i + 1) % a.length];

            area += v0[0] * v1[1];
            area -= v1[0] * v0[1];
        });

        return Math.abs(area / 2);
    }

    public get perimeter() {
        return this.mesh.reduce((t, b, i, a) => t + Math.hypot(b.x - a[(i + 1) % a.length].x, b.y - a[(i + 1) % a.length].y), 0);
    }

    public get centroid() {
        let a = 0;
        let x = 0;
        let y = 0;
        let l = this.mesh.length;

        for (let i = 0; i < l; i++) {
            const s = i === l - 1 ? 0 : i + 1;
            const v0 = this.mesh[i];
            const v1 = this.mesh[s];
            const f = v0[0] * v1[1] - v1[0] * v0[1];

            a += f;
            x += (v0[0] + v1[0]) * f;
            y += (v0[1] + v1[1]) * f;
        }

        const d = a * 3;

        return new Point2D(x / d, y / d);
    }

    public get mean() {
        let x = 0;
        let y = 0;

        this.mesh.forEach((v) => {
            x += v.x;
            y += v.y;
        });

        return [x / this.mesh.length, y / this.mesh.length];
    }

    public get hull() {
        const points = [...this.mesh].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

        const cross = (a: Point2D, b: Point2D, o: Point2D) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

        const lower = [];

        for (let i = 0; i < points.length; i++) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) lower.pop();

            lower.push(points[i]);
        }

        const upper = [];

        for (let i = points.length - 1; i >= 0; i--)
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                upper.pop();

                upper.push(points[i]);
            }

        upper.pop();
        lower.pop();

        return new Polygon(this.pos.x, this.pos.y, lower.concat(upper));
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Polygon<Mesh, Type>(this.pos.x, this.pos.y, this.mesh).rotate(this.angle);
    }

    protected recalculateMesh() {
        for (const v of this.mesh) v.rotate(this.angle, new Point2D(this.pos.x, this.pos.y));

        return this.mesh;
    }

    public static isConcave(p: Polygon) {
        let flag = 0;

        for (let i = 0; i < p.vertices.length; i++) {
            const j = (i + 1) % p.vertices.length;
            const k = (i + 2) % p.vertices.length;

            const z =
                (p.vertices[j].x - p.vertices[i].x) * (p.vertices[k].y - p.vertices[j].y) -
                (p.vertices[j].y - p.vertices[i].y) * (p.vertices[k].x - p.vertices[j].x);

            if (z < 0) flag |= 1;
            else if (z > 0) flag |= 2;

            if (flag === 3) return false;
        }

        if (!flag) throw new EuclideanGeometryError(`Status of this polygon cannot be determined.`);

        return true;
    }
}
