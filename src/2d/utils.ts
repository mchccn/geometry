import { Vector2 } from "../linalg/Vector2";
import { Circle } from "./Circle";
import { Shape2D } from "./Shape2D";

export function ends<T>(a: T[]): [T, T] {
    return [a[0], a[a.length - 1]];
}

export function project(vertices: Vector2[], axis: Vector2) {
    const dots = vertices.map((vertex) => vertex.dot(axis));

    return [Math.min(...dots), Math.max(...dots)] as [number, number];
}

export function direction(point0: Vector2, point1: Vector2) {
    return new Vector2(point1.x - point0.x, point1.y - point0.y);
}

export function edges(vertices: Vector2[]) {
    return vertices.map((_, i) => direction(vertices[i], vertices[(i + 1) % vertices.length]));
}

export function orthogonal(vector: Vector2) {
    return new Vector2(vector.y, -vector.x);
}

export function overlap(projection1: [number, number], projection2: [number, number]) {
    return Math.min(...projection1) <= Math.max(...projection2) && Math.min(...projection2) <= Math.max(...projection1);
}

export function minmax(p: Shape2D | Circle): [number, number, number, number] {
    if (p instanceof Circle) {
        const k = Math.SQRT2 * p.r;

        return [p.x - k, p.y - k, p.x + k, p.y + k];
    }

    const [minX, maxX] = ends(p.vertices.map((v) => v.x).sort((a, b) => a - b));

    const [minY, maxY] = ends(p.vertices.map((v) => v.y).sort((a, b) => a - b));

    return [minX, maxX, minY, maxY];
}
