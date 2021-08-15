import { Point2D } from "./Point2D";
import { Polygon2D } from "./Polygon2D";
import { PolygonType } from "./types";

export class RegularPolygon2D<Mesh extends Point2D[] = Point2D[], Type extends string = PolygonType> extends Polygon2D<Mesh, Type> {
    constructor(x = 0, y = 0, protected sides: number, protected radius: number = 1, angle = 0) {
        super(
            x,
            y,
            new Array(sides)
                .fill(void 0)
                .map((_, i) => new Point2D(x + radius * Math.cos((i * 2 * Math.PI) / sides), y + radius * Math.sin((i * 2 * Math.PI) / sides)))
        );

        for (const v of this.mesh) v.rotate(angle, new Point2D(x, y));
    }

    public get apothem() {
        return this.radius * Math.cos(Math.PI / this.sides);
    }

    public set apothem(a: number) {
        this.radius = a / Math.cos(Math.PI / this.sides);

        this.recalculateMesh();
    }

    public get r() {
        return this.radius;
    }

    public set r(r: number) {
        this.radius = r;

        this.recalculateMesh();
    }

    public clone() {
        return new RegularPolygon2D<Mesh, Type>(this.pos.x, this.pos.y, this.sides, this.radius).rotate(this.angle);
    }

    protected recalculateMesh() {
        this.mesh = new Array(this.sides)
            .fill(void 0)
            .map(
                (_, i) =>
                    new Point2D(
                        this.pos.x + this.radius * Math.cos((i * 2 * Math.PI) / this.sides),
                        this.pos.y + this.radius * Math.sin((i * 2 * Math.PI) / this.sides)
                    )
            ) as Mesh;

        for (const v of this.mesh) v.rotate(this.angle, new Point2D(this.pos.x, this.pos.y));

        return this.mesh;
    }
}
