import { Point2D } from "./Point2D";
import { Shape2D } from "./Shape2D";
import { PlanarEntity, Rotatable } from "./types";

export class Rectangle extends Shape2D<[Point2D, Point2D, Point2D, Point2D], "RECTANGLE"> implements Rotatable, PlanarEntity {
    protected dim: Point2D;

    public constructor(x = 0, y = 0, w = 1, h = 1, protected angle = 0) {
        super(
            new Point2D(x, y),
            [
                Point2D.from([x - w / 2, y - h / 2]),
                Point2D.from([x - w / 2, y + h / 2]),
                Point2D.from([x + w / 2, y + h / 2]),
                Point2D.from([x + w / 2, y - h / 2]),
            ],
            "RECTANGLE"
        );

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([x, y]));

        this.dim = new Point2D(w, h);
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public get w() {
        return this.dim.x;
    }

    public set w(w: number) {
        this.dim.x = w;

        this.recalculateMesh();
    }

    public get h() {
        return this.dim.y;
    }

    public set h(h: number) {
        this.dim.y = h;

        this.recalculateMesh();
    }

    public get area() {
        return this.w * this.h;
    }

    public get perimeter() {
        return this.w * 2 + this.h * 2;
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Rectangle(this.pos.x, this.pos.y, this.dim.x, this.dim.y, this.angle);
    }

    protected recalculateMesh() {
        this.mesh = [
            Point2D.from([this.pos.x - this.dim.x / 2, this.pos.y - this.dim.y / 2]),
            Point2D.from([this.pos.x - this.dim.x / 2, this.pos.y + this.dim.y / 2]),
            Point2D.from([this.pos.x + this.dim.x / 2, this.pos.y + this.dim.y / 2]),
            Point2D.from([this.pos.x + this.dim.x / 2, this.pos.y - this.dim.y / 2]),
        ];

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([this.pos.x, this.pos.y]));

        return this.mesh;
    }
}
