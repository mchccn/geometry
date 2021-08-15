import { LineSegment2D } from "./LineSegment2D";
import { Point2D } from "./Point2D";

export abstract class Shape2D<Mesh extends Point2D[] = Point2D[], Type extends string = "SHAPE_2D"> {
    public constructor(protected pos: Point2D, protected mesh: Mesh, protected __type__: Type) {}

    public get vertices() {
        return this.mesh.map((v) => Point2D.from(v.toArray()));
    }

    public get edges() {
        return this.mesh.map((v, i, a) => new LineSegment2D(v, a[(i + 1) % a.length]));
    }

    public get x() {
        return this.pos.x;
    }

    public set x(x: number) {
        this.pos.x = x;

        this.recalculateMesh();
    }

    public get y() {
        return this.pos.y;
    }

    public set y(y: number) {
        this.pos.y = y;

        this.recalculateMesh();
    }

    public get TYPE() {
        return this.__type__;
    }

    protected abstract recalculateMesh(): Mesh;

    public abstract clone(): Shape2D<Mesh, Type>;
}
