import { Vector2 } from "../linalg/Vector2";
import { Circle } from "./Circle";
import { Rectangle } from "./Rectangle";
import { Shape2D } from "./Shape2D";
import { edges, minmax, orthogonal, overlap, project } from "./utils";

export class Collider2D<A extends Shape2D | Circle = Shape2D, B extends Shape2D | Circle = Shape2D> {
    public constructor(public readonly a: A, public readonly b: B) {}

    public collide(method: "AABB" | "SAT" | "CIRCLE" = "SAT") {
        if (method === "AABB") {
            function rect([minX, maxX, minY, maxY]: [number, number, number, number]) {
                return new Rectangle(minX + (maxX - minX) / 2, minY + (maxY - minY) / 2, maxX - minX, maxY - minY);
            }

            function intersecting(a: Rectangle, b: Rectangle) {
                return a.x - a.w / 2 < b.x + b.w / 2 && a.x + a.w / 2 > b.x - b.w / 2 && a.y - a.h / 2 < b.y + b.h / 2 && a.y + a.h / 2 > b.y - b.h / 2;
            }

            return intersecting(rect(minmax(this.a)), rect(minmax(this.b)));
        }

        if (this.a instanceof Circle && this.b instanceof Circle) {
            const dx = this.a.x - this.b.x;
            const dy = this.a.y - this.b.y;

            const d = Math.sqrt(dx * dx + dy * dy);

            return d < this.a.r + this.b.r;
        }

        if (method === "SAT") {
            if (this.a instanceof Circle) {
                const a = this.b;
                const b = this.a;

                Object.assign(this, { a, b });
            }

            if (((p: any): p is Circle => p instanceof Circle)(this.a)) return;

            if (this.b instanceof Circle) {
                if (!overlap(minmax(this.a).slice(0, 2) as [number, number], [this.b.x - this.b.r, this.b.x + this.b.r])) return false;

                if (!overlap(minmax(this.a).slice(2) as [number, number], [this.b.y - this.b.r, this.b.y + this.b.r])) return false;

                return true;
            }

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

        if (method === "CIRCLE") {
            function circle(p: Shape2D) {
                const r = Math.max(...p.vertices.map((v) => Math.hypot(p.x - v.x, p.y - v.y)));

                return new Circle(p.x, p.y, r);
            }

            const a = this.a instanceof Circle ? this.a : circle(this.a);

            const b = this.b instanceof Circle ? this.b : circle(this.b);

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const d = Math.sqrt(dx * dx + dy * dy);

            return d < a.r + b.r;
        }

        throw new Error("Unsupported collision detection method.");
    }
}
