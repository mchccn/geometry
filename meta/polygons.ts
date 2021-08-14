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
                path.join(target, `${name}.ts`),
                `\
import { Polygon } from "./Polygon";
import { Point2D } from "./Point2D";

export class ${name} extends Polygon<[${new Array(i).fill("Point2D").join(", ")}], "${name.toUpperCase()}"> {}
`,
                "utf8"
            );
        });

        await fs.writeFile(
            path.join(target, "index.ts"),
            `\
export { Circle } from "./Circle";
export { Collider2D } from "./Collider2D";
export { Line2D } from "./Line2D";
export { Point2D } from "./Point2D";
export { Polygon } from "./Polygon";
export { Rectangle } from "./Rectangle";
export { Shape2D } from "./Shape2D";
export { Square } from "./Square";
` +
                shapes
                    .slice(5)
                    .map((s) => `export { ${s} } from "./${s}";`)
                    .join("\n"),
            "utf8"
        );
    } catch (e) {
        console.error(e);

        process.exit(1);
    }
})();
