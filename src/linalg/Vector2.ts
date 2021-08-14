import { Matrix } from "./Matrix";
import { CreateMatrix } from "./types";
import { clone, rotate, CalculationError } from "./utils";

export class Vector2 {
    public static readonly ORDER = 2;

    private coords: [x: number, y: number];

    public constructor(x?: number, y?: number) {
        this.coords = [x ?? 0, y ?? 0];
    }

    public *[Symbol.iterator]() {
        yield* this.coords;
    }

    public add(vector: Vector2): this;
    public add(scalar: number): this;
    public add(x: number, y: number): this;
    public add(x: Vector2 | number, y?: number): this {
        if (Vector2.isVector2(x)) {
            this.x += x.x;
            this.y += x.y;
        } else {
            this.x += x;
            this.y += y ?? x;
        }

        return this;
    }

    public subtract(vector: Vector2): this;
    public subtract(scalar: number): this;
    public subtract(x: number, y: number): this;
    public subtract(x: Vector2 | number, y?: number): this {
        if (Vector2.isVector2(x)) {
            this.x -= x.x;
            this.y -= x.y;
        } else {
            this.x -= x;
            this.y -= y ?? x;
        }

        return this;
    }

    public multiply(vector: Vector2): this;
    public multiply(scalar: number): this;
    public multiply(x: number, y: number): this;
    public multiply(x: Vector2 | number, y?: number): this {
        if (Vector2.isVector2(x)) {
            this.x *= x.x;
            this.y *= x.y;
        } else {
            this.x *= x;
            this.y *= y ?? x;
        }

        return this;
    }

    public divide(vector: Vector2): this;
    public divide(scalar: number): this;
    public divide(x: number, y: number): this;
    public divide(x: Vector2 | number, y?: number): this {
        if (Vector2.isVector2(x)) {
            this.x /= x.x;
            this.y /= x.y;
        } else {
            this.x /= x;
            this.y /= y ?? x;
        }

        return this;
    }

    public negate() {
        this.multiply(-1);

        return this;
    }

    public angleTo(vector: Vector2) {
        return Math.acos((this.dot(vector) / this.magnitude) * vector.magnitude);
    }

    public dot(vector: Vector2) {
        return this.x * vector.x + this.y * vector.y;
    }

    public cross(vector: Vector2) {
        return this.determinant(vector);
    }

    public determinant(vector: Vector2) {
        return new Matrix(2, 2, rotate([[...this.coords], [...vector.coords]], 1) as CreateMatrix<2, 2>).determinant();
    }

    public get min() {
        return Math.min(...this.coords);
    }

    public get max() {
        return Math.max(...this.coords);
    }

    public normalize() {
        this.divide(this.magnitude);

        return this;
    }

    public equals(vector: Vector2) {
        return vector.x === this.x && vector.y === this.y;
    }

    public toString() {
        return `Vector2 (${this.coords.join(", ")})`;
    }

    public clone() {
        return new Vector2(...this.coords);
    }

    public toArray() {
        return clone(this.coords);
    }

    public toPoint() {
        const { x, y } = this;

        return { x, y };
    }

    public transform(transformation: Matrix<2, 2>) {
        const [i, j] = transformation.multiply(new Matrix(1, 2, [[this.x], [this.y]]))[0];

        this.x = i;
        this.y = j;

        return this;
    }

    public get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public get length() {
        return this.magnitude;
    }

    public get x() {
        return this.coords[0];
    }

    public set x(v: number) {
        this.coords[0] = v;
    }

    public get y() {
        return this.coords[1];
    }

    public set y(v: number) {
        this.coords[1] = v;
    }

    public get 0() {
        return this.coords[0];
    }

    public set 0(v: number) {
        this.coords[0] = v;
    }

    public get 1() {
        return this.coords[1];
    }

    public set 1(v: number) {
        this.coords[1] = v;
    }

    public static get up() {
        return new Vector2(0, 1);
    }

    public static get down() {
        return new Vector2(0, -1);
    }

    public static get left() {
        return new Vector2(-1, 0);
    }

    public static get right() {
        return new Vector2(1, 0);
    }

    public static lerp(a: Vector2, b: Vector2, t: number) {
        if (t < 0 || t > 1) throw new CalculationError("t in lerp(a, b, t) is between 0 and 1 inclusive");

        const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

        return new Vector2(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
    }

    public static add(a: Vector2, b: Vector2) {
        return a.clone().add(b.clone());
    }

    public static subtract(a: Vector2, b: Vector2) {
        return a.clone().subtract(b.clone());
    }

    public static multiply(a: Vector2, b: Vector2) {
        return a.clone().multiply(b.clone());
    }

    public static divide(a: Vector2, b: Vector2) {
        return a.clone().divide(b.clone());
    }

    public static negate(vector: Vector2) {
        return vector.clone().negate();
    }

    public static angleTo(a: Vector2, b: Vector2) {
        return a.clone().angleTo(b.clone());
    }

    public static normalize(vector: Vector2) {
        return vector.clone().normalize();
    }

    public static isVector2(v: any): v is Vector2 {
        return v instanceof Vector2;
    }
}
