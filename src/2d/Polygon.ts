import { Point2D } from "./Point2D";
import { Shape2D } from "./Shape2D";
import { PolygonType } from "./types";

export class Polygon extends Shape2D<Point2D[], PolygonType> {
    private angle = 0;

    constructor(x: number, y: number, vertices: Point2D[]) {
        super(new Point2D(x, y), vertices, `${vertices.length}_GON`);

        if (vertices.length < 3) throw new Error(`Polygons must have at least 3 vertices.`);
    }

    public get a() {
        return this.angle;
    }

    public set a(angle: number) {
        this.angle = angle;

        this.recalculateMesh();
    }

    public rotate(a: number, about = new Point2D(this.pos.x, this.pos.y)) {
        for (const v of this.mesh) v.rotate(a, about);

        return this;
    }

    public clone() {
        return new Polygon(this.pos.x, this.pos.y, this.mesh).rotate(this.angle);
    }

    protected recalculateMesh() {
        for (const v of this.mesh) v.rotate(this.angle, new Point2D(this.pos.x, this.pos.y));

        return this.mesh;
    }
}
