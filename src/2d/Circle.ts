import { Point2D } from "./Point2D";

export class Circle {
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

    public get TYPE() {
        return "CIRCLE" as const;
    }
}
