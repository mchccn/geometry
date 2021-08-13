import Point2D from "./Point2D";

export default abstract class Shape2D<Mesh extends Point2D[] = Point2D[], Type extends string = "SHAPE_2D"> {
    constructor(protected pos: Point2D, protected mesh: Mesh, public readonly TYPE: Type) {}

    public get vertices() {
        return this.mesh.map((v) => Point2D.from(v.toArray()));
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

    protected abstract recalculateMesh(): Mesh;
}
