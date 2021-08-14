import { CreateArray, CreateMatrix, GenericMatrix } from "./types";
import { rotate, LinearAlgebraError } from "./utils";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

export class Matrix<Width extends number, Height extends number> extends Array<CreateArray<Width>> {
    public constructor(public readonly width: Width, public readonly height: Height, contents?: CreateMatrix<Width, Height>) {
        super();

        if (width < 0 || height < 0) throw new LinearAlgebraError("matrices cannot have a negative width or height");

        for (let y = 0; y < height; y++) this[y] = new Array<number>(width).fill(0) as CreateArray<Width>;

        if (contents) this.forEach((row, y) => row.forEach((_, x) => (this[y][x] = contents[y][x])));
    }

    public add(matrix: Matrix<Width, Height>): this;
    public add(scalar: number): this;
    public add(factor: number | Matrix<Width, Height>): this {
        if (Matrix.isMatrix(factor)) {
            if (this.width !== factor.width || this.height !== factor.height)
                throw new LinearAlgebraError("the first matrix's dimensions must be the same as the second's");

            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] += factor[y][x])));
        } else {
            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] += factor)));
        }

        return this;
    }

    public subtract(matrix: Matrix<Width, Height>): this;
    public subtract(scalar: number): this;
    public subtract(factor: number | Matrix<Width, Height>): this {
        if (Matrix.isMatrix(factor)) {
            if (this.width !== factor.width || this.height !== factor.height)
                throw new LinearAlgebraError("the first matrix's dimensions must be the same as the second's");

            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] -= factor[y][x])));
        } else {
            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] -= factor)));
        }

        return this;
    }

    public multiply(matrix: Matrix<number, number>): this;
    public multiply(scalar: number): this;
    public multiply(factor: number | Matrix<number, number>): this {
        if (Matrix.isMatrix(factor)) {
            if (this.width !== (factor.height as number))
                throw new LinearAlgebraError("the first matrix's width must be the same as the second matrix's height");

            const matrix = Matrix.rotate(factor, 1);

            const buffer = new Matrix(this.width, factor.height);

            this.forEach((a, y) => {
                matrix.forEach((row, x) => {
                    const [b] = new Matrix(row.length, 1, [row]).rotate(1).toArray();

                    const product = a.reduce((p, v, i) => p + v * b[i], 0);

                    buffer[y][x] = product;
                });
            });

            buffer.forEach((row, y) => row.forEach((_, x) => (this[y][x] = buffer[y][x])));
        } else {
            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] *= factor)));
        }

        return this;
    }

    public divide(matrix: Matrix<Width, Height>): this;
    public divide(scalar: number): this;
    public divide(factor: number | Matrix<Width, Height>): this {
        if (Matrix.isMatrix(factor)) {
            if (this.width !== (factor.height as number))
                throw new LinearAlgebraError("the first matrix's width must be the same as the second matrix's height");

            this.multiply(factor.inverse as Matrix<Width, Height>);
        } else {
            this.forEach((row, y) => row.forEach((_, x) => (this[y][x] /= factor)));
        }

        return this;
    }

    public negate() {
        this.multiply(-1);

        return this;
    }

    public determinant(): number {
        const { width, height } = this as { width: number; height: number };

        if (width !== height) return NaN;

        if (width === 1) return this[0][0];

        if (width === 2) return this[0][0] * this[1][1]! - this[0][1]! * this[1][0];

        return this[0].reduce(
            (r, e, i) => r + (-1) ** (i + 2) * e * Matrix.fromArray(this.slice(1).map((c) => c.filter((_, j) => i != j)) as GenericMatrix).determinant(),
            0
        );
    }

    public get minors() {
        const minors = new Matrix(this.width, this.height);

        this.forEach((row, y) => {
            row.forEach((_, x) => {
                const minor = Matrix.fromArray(
                    (this.toArray() as number[][]).filter((_, i) => i !== y).map((row) => row.filter((_, i) => i !== x)) as GenericMatrix
                );

                minors[y][x] = minor.determinant();
            });
        });

        return minors;
    }

    public get cofactors() {
        const checkerboard = new Array(this.height)
            .fill(void 0)
            .map((_, y) => new Array(this.width).fill(void 0).map((_, x) => ((y + x) % 2 === 0 ? 1 : -1))) as CreateMatrix<Width, Height>;

        const { minors } = this;

        checkerboard.forEach((row, y) => row.forEach((_, x) => (minors[y][x] *= checkerboard[y][x])));

        return minors;
    }

    public get adjugate() {
        return this.cofactors.transpose();
    }

    public get inverse() {
        const determinant = this.determinant();

        if (determinant === 0) throw new LinearAlgebraError("the determinant of this matrix is zero");

        const { adjugate } = this;

        return Matrix.fromArray(adjugate.map((row) => row.map((_, i) => (1 / determinant) * row[i])) as GenericMatrix);
    }

    public toArray() {
        return new Array(this.height).fill(void 0).map((_, i) => [...this[i]]) as CreateMatrix<Width, Height>;
    }

    public toString() {
        const rows = this.map((row) => {
            return (
                "│ " +
                row
                    .map(
                        (v, i) =>
                            (this.map((row) => row[i]).some((v) => v < 0) && row[i] >= 0 ? " " : "") +
                            v.toString().padEnd(Math.max(...this.map((row) => row[i])).toString().length, " ")
                    )
                    .join(" ") +
                " │"
            );
        });

        return [`┌${" ".repeat(rows[0].length - 2)}┐`, ...rows, `└${" ".repeat(rows[0].length - 2)}┘`].join("\n");
    }

    public clone() {
        return new Matrix(this.width, this.height, this.toArray());
    }

    public rotate(dir: number) {
        for (let y = 0; y < this.length; ++y) for (let x = 0; x < y; ++x) [this[x][y], this[y][x]] = [this[y][x], this[x][y]];

        if (dir > 0) this.forEach((row) => row.reverse());
        else this.reverse();

        const indices = this.flatMap((_, i) => (_.every((v) => typeof v === "undefined") ? [i] : []));

        indices.forEach((i) => this.splice(i, 1));

        return this;
    }

    public transpose() {
        this.reverse();

        this.rotate(1);

        return this;
    }

    public static rotate<Width extends number, Height extends number>(matrix: Matrix<Width, Height>, dir: number) {
        return matrix.clone().rotate(dir);
    }

    public static zeros<Width extends number, Height extends number>(w: Width, h: Height) {
        return new Matrix(w, h, new Array(h).fill(void 0).map(() => new Array(w).fill(0)) as CreateMatrix<Width, Height>);
    }

    public static ones<Width extends number, Height extends number>(w: Width, h: Height) {
        return new Matrix(w, h, new Array(h).fill(void 0).map(() => new Array(w).fill(1)) as CreateMatrix<Width, Height>);
    }

    public static identity<Width extends number>(s: Width) {
        return new Matrix(s, s, new Array(s).fill(void 0).map((_, y) => new Array(s).fill(0).map((v, x) => (x === y ? 1 : v))) as CreateMatrix<Width, Width>);
    }

    public static fromArray<Width extends number, Height extends number>(a: CreateMatrix<Width, Height>) {
        return new Matrix(a.length, a[0].length, a as GenericMatrix);
    }

    public static fromVector2(a: Vector2, b: Vector2) {
        return new Matrix(2, 2, rotate([a.toArray(), b.toArray()], 1) as CreateMatrix<2, 2>);
    }

    public static fromVector3(a: Vector3, b: Vector3, c: Vector3) {
        return new Matrix(3, 3, rotate([a.toArray(), b.toArray(), c.toArray()], 1) as CreateMatrix<3, 3>);
    }

    public static fromVector4(a: Vector4, b: Vector4, c: Vector4, d: Vector4) {
        return new Matrix(4, 4, rotate([a.toArray(), b.toArray(), c.toArray(), d.toArray()], 1) as CreateMatrix<4, 4>);
    }

    public static isMatrix(v: any): v is Matrix<number, number> {
        return v instanceof Matrix;
    }
}
