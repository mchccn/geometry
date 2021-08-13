import { Vector2 } from "../linalg/Vector2";
import Shape2D from "./Shape2D";
import { edges, orthogonal, overlap, project } from "./utils";

export default class Collider2D<A extends Shape2D = Shape2D, B extends Shape2D = Shape2D> {
    constructor(public readonly a: A, public readonly b: B) {}

    public collide(method: "AABB" | "SAT" = "SAT") {
        if (method === "SAT") {
            const sides = [...edges(this.a.vertices.map((p) => new Vector2(p.x, p.y))), ...edges(this.b.vertices.map((p) => new Vector2(p.x, p.y)))];

            const axes = sides.map((side) => orthogonal(side).normalize());

            for (const axis of axes) {
                if (
                    !overlap(
                        project(
                            this.a.vertices.map((p) => new Vector2(p.x, p.y)),
                            axis
                        ),
                        project(
                            this.b.vertices.map((p) => new Vector2(p.x, p.y)),
                            axis
                        )
                    )
                )
                    return false;
            }

            return true;
        }

        throw new ReferenceError("AABB collision is not implemented");
    }
}
