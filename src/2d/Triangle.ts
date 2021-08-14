import { Point2D } from "./Point2D";
import { Polygon } from "./Polygon";
import { PlanarEntity, Rotatable } from "./types";

export class Triangle extends Polygon<[Point2D, Point2D, Point2D], "TRIANGLE"> implements Rotatable, PlanarEntity {
    protected lengths: [number, number, number];

    public constructor(x = 0, y = 0, vertices: [Point2D, Point2D, Point2D], protected angle = 0) {
        super(x, y, vertices);

        this.__type__ = "TRIANGLE";

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([x, y]));

        this.lengths = this.mesh.map((v, i, a) => Math.hypot(v.x - this.mesh[(i + 1) % a.length].x, v.y - this.mesh[(i + 1) % a.length].y)) as [
            number,
            number,
            number
        ];
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public get area() {
        const [a, b, c] = this.lengths;

        const s = (a + b + c) / 2;

        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    public get perimeter() {
        const [a, b, c] = this.lengths;

        return a + b + c;
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Triangle(this.pos.x, this.pos.y, this.mesh, this.angle);
    }

    protected recalculateLengths() {
        this.lengths = this.mesh.map((v, i, a) => Math.hypot(v.x - this.mesh[(i + 1) % a.length].x, v.y - this.mesh[(i + 1) % a.length].y)) as [
            number,
            number,
            number
        ];

        return this.lengths;
    }

    protected recalculateMesh() {
        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([this.pos.x, this.pos.y]));

        return this.mesh;
    }
}
