import { Point2D } from "./Point2D";
import { Shape2D } from "./Shape2D";
import { Rotatable } from "./types";

export class Triangle extends Shape2D<[Point2D, Point2D, Point2D], "TRIANGLE"> implements Rotatable {
    public constructor(x = 0, y = 0, vertices: [Point2D, Point2D, Point2D], protected angle = 0) {
        super(new Point2D(x, y), vertices, "TRIANGLE");

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([x, y]));
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public get area() {
        const [a, b, c] = this.mesh.map((v, i, a) => Math.hypot(v.x - this.mesh[(i + 1) % a.length].x, v.y - this.mesh[(i + 1) % a.length].y));

        const s = (a + b + c) / 2;

        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Triangle(this.pos.x, this.pos.y, this.mesh, this.angle);
    }

    protected recalculateMesh() {
        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([this.pos.x, this.pos.y]));

        return this.mesh;
    }
}

// herons formula
