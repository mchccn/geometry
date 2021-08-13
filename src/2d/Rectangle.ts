import Point2D from "./Point2D";
import Shape2D from "./Shape2D";
import { rotate } from "./utils";

export default class Rectangle extends Shape2D<[Point2D, Point2D, Point2D, Point2D], "RECTANGLE"> {
    private dim: Point2D;

    constructor(x: number = 0, y: number = 0, w: number = 1, h: number = 1, private angle: number = 0) {
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

        for (const v of this.mesh) rotate(v, Point2D.from([x, y]), this.angle);

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

    protected recalculateMesh() {
        this.mesh = [
            Point2D.from([this.pos.x - this.dim.x / 2, this.pos.y - this.dim.y / 2]),
            Point2D.from([this.pos.x - this.dim.x / 2, this.pos.y + this.dim.y / 2]),
            Point2D.from([this.pos.x + this.dim.x / 2, this.pos.y + this.dim.y / 2]),
            Point2D.from([this.pos.x + this.dim.x / 2, this.pos.y - this.dim.y / 2]),
        ];

        for (const v of this.mesh) rotate(v, Point2D.from([this.pos.x, this.pos.y]), this.angle);

        return this.mesh;
    }
}
