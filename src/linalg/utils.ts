export function clone<A extends any[]>(array: A): A {
    return [...array] as A;
}

export class LinearAlgebraError extends Error {
    public readonly name = "LinearAlgebraError";

    public constructor(public readonly message: string = "") {
        super(message);
    }
}

export function rotate<T extends any[][]>(m: T, dir: number): T {
    for (let y = 0; y < m.length; ++y) for (let x = 0; x < y; ++x) [m[x][y], m[y][x]] = [m[y][x], m[x][y]];

    if (dir > 0) m.forEach((row) => row.reverse());
    else m.reverse();

    const indices = m.flatMap((_, i) => (_.every((v) => typeof v === "undefined") ? [i] : []));

    indices.forEach((i) => m.splice(i, 1));

    return m;
}
