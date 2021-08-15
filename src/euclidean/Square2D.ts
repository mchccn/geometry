import { Point2D } from "./Point2D";
import { Shape2D } from "./Shape2D";
import { PlanarEntity, Rotatable2D } from "./types";

export class Square2D extends Shape2D<[Point2D, Point2D, Point2D, Point2D], "SQUARE"> implements Rotatable2D, PlanarEntity {
    public constructor(x = 0, y = 0, protected side = 1, protected angle = 0) {
        super(
            new Point2D(x, y),
            [
                Point2D.from([x - side / 2, y - side / 2]),
                Point2D.from([x - side / 2, y + side / 2]),
                Point2D.from([x + side / 2, y + side / 2]),
                Point2D.from([x + side / 2, y - side / 2]),
            ],
            "SQUARE"
        );

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([x, y]));
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public get s() {
        return this.side;
    }

    public set s(s: number) {
        this.side = s;

        this.recalculateMesh();
    }

    public get area() {
        return this.s * this.s;
    }

    public get perimeter() {
        return this.s * 4;
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Square2D(this.pos.x, this.pos.y, this.side, this.angle);
    }

    protected recalculateMesh() {
        this.mesh = [
            Point2D.from([this.pos.x - this.side / 2, this.pos.y - this.side / 2]),
            Point2D.from([this.pos.x - this.side / 2, this.pos.y + this.side / 2]),
            Point2D.from([this.pos.x + this.side / 2, this.pos.y + this.side / 2]),
            Point2D.from([this.pos.x + this.side / 2, this.pos.y - this.side / 2]),
        ];

        for (const v of this.mesh) v.rotate(this.angle, Point2D.from([this.pos.x, this.pos.y]));

        return this.mesh;
    }
}
