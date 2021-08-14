import { Vector2 } from "../linalg/Vector2";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Shape2D } from "./Shape2D";
import { edges, ends, orthogonal, overlap, project } from "./utils";

export class Collider2D<A extends Shape2D | Circle = Shape2D, B extends Shape2D | Circle = Shape2D> {
    public constructor(public readonly a: A, public readonly b: B) {}

    public collide(method: "AABB" | "SAT" = "SAT") {
        if (method === "SAT") {
            if (this.a instanceof Circle && this.b instanceof Circle) {
                const dx = this.a.x - this.b.x;
                const dy = this.a.y - this.b.y;

                const d = Math.sqrt(dx * dx + dy * dy);

                return d < this.a.r + this.b.r;
            }

            if (this.a instanceof Circle) throw 0;

            if (this.b instanceof Circle) throw 0;

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

        if (method === "AABB") {
            function minmax(p: Shape2D | Circle): [number, number, number, number] {
                if (p instanceof Circle) {
                    const k = Math.SQRT2 * p.r;

                    return [p.x - k, p.y - k, p.x + k, p.y + k];
                }

                const [minX, maxX] = ends(p.vertices.map((v) => v.x).sort((a, b) => a - b));

                const [minY, maxY] = ends(p.vertices.map((v) => v.y).sort((a, b) => a - b));

                return [minX, maxX, minY, maxY];
            }

            function rect([minX, maxX, minY, maxY]: [number, number, number, number]) {
                return new Rectangle(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, maxX - minX, maxY - minY);
            }

            function intersecting(a: Rectangle, b: Rectangle) {
                return a.x - a.w / 2 < b.x + b.w / 2 && a.x + a.w / 2 > b.x - b.w / 2 && a.y - a.h / 2 < b.y + b.h / 2 && a.y + a.h / 2 > b.y - b.h / 2;
            }

            return intersecting(rect(minmax(this.a)), rect(minmax(this.b)));
        }

        throw new Error("Unsupported collision detection method.");
    }
}
