import fs from "fs/promises";
import path from "path";

(async () => {
    try {
        const shapes = [
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            "Pentagon",
            "Hexagon",
            "Heptagon",
            "Octagon",
            "Nonagon",
            "Decagon",
            "Hendecagon",
            "Dodecagon",
        ];

        const target = path.join(process.cwd(), "src", "2d");

        shapes.forEach(async (name, i) => {
            if (!name) return;

            await fs.writeFile(
                path.join(target, `${name}2D.ts`),
                `\
import { Polygon2D } from "./Polygon2D";
import { Point2D } from "./Point2D";

export class ${name}2D extends Polygon2D<[${new Array(i).fill("Point2D").join(", ")}], "${name.toUpperCase()}"> {}
`,
                "utf8"
            );
        });

        await fs.writeFile(
            path.join(target, "index.ts"),
            `\
export { Circle2D } from "./Circle2D";
export { Collider2D } from "./Collider2D";
export { Line2D } from "./Line2D";
export { LineSegment2D } from "./LineSegment2D";
export { Point2D } from "./Point2D";
export { Polygon2D } from "./Polygon2D";
export { Rectangle2D } from "./Rectangle2D";
export { Shape2D } from "./Shape2D";
export { Square2D } from "./Square2D";
export { Triangle2D } from "./Triangle2D";
` +
                shapes
                    .slice(5)
                    .map((s) => `export { ${s}2D } from "./${s}2D";`)
                    .join("\n"),
            "utf8"
        );
    } catch (e) {
        console.error(e);

        process.exit(1);
    }
})();
