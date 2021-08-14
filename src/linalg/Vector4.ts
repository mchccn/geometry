import { Matrix } from "./Matrix";
import { CreateMatrix } from "./types";
import { clone, rotate, LinearAlgebraError } from "./utils";

export class Vector4 {
    public static readonly ORDER = 4;

    private coords: [x: number, y: number, z: number, w: number];

    public constructor(x?: number, y?: number, z?: number, w?: number) {
        this.coords = [x ?? 0, y ?? 0, z ?? 0, w ?? 0];
    }

    public *[Symbol.iterator]() {
        yield* this.coords;
    }

    public add(vector: Vector4): this;
    public add(scalar: number): this;
    public add(x: number, y: number, z: number, w: number): this;
    public add(x: Vector4 | number, y?: number, z?: number, w?: number): this {
        if (Vector4.isVector4(x)) {
            this.x += x.x;
            this.y += x.y;
            this.z += x.z;
            this.w += x.w;
        } else {
            this.x += x;
            this.y += y ?? x;
            this.z += z ?? x;
            this.w += w ?? x;
        }

        return this;
    }

    public subtract(vector: Vector4): this;
    public subtract(scalar: number): this;
    public subtract(x: number, y: number, z: number, w: number): this;
    public subtract(x: Vector4 | number, y?: number, z?: number, w?: number): this {
        if (Vector4.isVector4(x)) {
            this.x -= x.x;
            this.y -= x.y;
            this.z -= x.z;
            this.w -= x.w;
        } else {
            this.x -= x;
            this.y -= y ?? x;
            this.z -= z ?? x;
            this.w -= w ?? x;
        }

        return this;
    }

    public multiply(vector: Vector4): this;
    public multiply(scalar: number): this;
    public multiply(x: number, y: number, z: number, w: number): this;
    public multiply(x: Vector4 | number, y?: number, z?: number, w?: number): this {
        if (Vector4.isVector4(x)) {
            this.x *= x.x;
            this.y *= x.y;
            this.z *= x.z;
            this.w *= x.w;
        } else {
            this.x *= x;
            this.y *= y ?? x;
            this.z *= z ?? x;
            this.w *= w ?? x;
        }

        return this;
    }

    public divide(vector: Vector4): this;
    public divide(scalar: number): this;
    public divide(x: number, y: number, z: number, w: number): this;
    public divide(x: Vector4 | number, y?: number, z?: number, w?: number): this {
        if (Vector4.isVector4(x)) {
            this.x /= x.x;
            this.y /= x.y;
            this.z /= x.z;
            this.w /= x.w;
        } else {
            this.x /= x;
            this.y /= y ?? x;
            this.z /= z ?? x;
            this.w /= w ?? x;
        }

        return this;
    }

    public negate() {
        this.multiply(-1);

        return this;
    }

    public angleTo(vector: Vector4) {
        return Math.acos((this.dot(vector) / this.magnitude) * vector.magnitude);
    }

    public dot(vector: Vector4) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    public determinant(a: Vector4, b: Vector4, c: Vector4) {
        return new Matrix(4, 4, rotate([[...this.coords], [...a.coords], [...b.coords], [...c.coords]], 1) as CreateMatrix<4, 4>).determinant();
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

    public equals(vector: Vector4) {
        return vector.x === this.x && vector.y === this.y && vector.z === this.z && vector.w === this.w;
    }

    public toString() {
        return `Vector4 (${this.coords.join(", ")})`;
    }

    public clone() {
        return new Vector4(...this.coords);
    }

    public toArray() {
        return clone(this.coords);
    }

    public toPoint() {
        const { x, y, z, w } = this;

        return { x, y, z, w };
    }

    public transform(transformation: Matrix<4, 4>) {
        const [i, j, k, l] = transformation.multiply(new Matrix(1, 4, [[this.x], [this.y], [this.z], [this.w]]))[0];

        this.x = i;
        this.y = j;
        this.z = k;
        this.w = l;

        return this;
    }

    public get magnitude() {
        return Math.pow(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w, 1 / 4);
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

    public get z() {
        return this.coords[2];
    }

    public set z(v: number) {
        this.coords[2] = v;
    }

    public get w() {
        return this.coords[3];
    }

    public set w(v: number) {
        this.coords[3] = v;
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

    public get 2() {
        return this.coords[2];
    }

    public set 2(v: number) {
        this.coords[2] = v;
    }

    public get 3() {
        return this.coords[3];
    }

    public set 3(v: number) {
        this.coords[3] = v;
    }

    public static get up() {
        return new Vector4(0, 1, 0, 0);
    }

    public static get down() {
        return new Vector4(0, -1, 0, 0);
    }

    public static get left() {
        return new Vector4(-1, 0, 0, 0);
    }

    public static get right() {
        return new Vector4(1, 0, 0, 0);
    }

    public static get back() {
        return new Vector4(0, 0, -1, 0);
    }

    public static get front() {
        return new Vector4(0, 0, 1, 0);
    }

    public static get ana() {
        return new Vector4(0, 0, 0, 1);
    }

    public static get kata() {
        return new Vector4(0, 0, 0, -1);
    }

    public static lerp(a: Vector4, b: Vector4, t: number) {
        if (t < 0 || t > 1) throw new LinearAlgebraError("t in lerp(a, b, t) is between 0 and 1 inclusive");

        const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

        return new Vector4(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t), lerp(a.w, b.w, t));
    }

    public static add(a: Vector4, b: Vector4) {
        return a.clone().add(b.clone());
    }

    public static subtract(a: Vector4, b: Vector4) {
        return a.clone().subtract(b.clone());
    }

    public static multiply(a: Vector4, b: Vector4) {
        return a.clone().multiply(b.clone());
    }

    public static divide(a: Vector4, b: Vector4) {
        return a.clone().divide(b.clone());
    }

    public static negate(vector: Vector4) {
        return vector.clone().negate();
    }

    public static angleTo(a: Vector4, b: Vector4) {
        return a.clone().angleTo(b.clone());
    }

    public static normalize(vector: Vector4) {
        return vector.clone().normalize();
    }

    public static isVector4(v: any): v is Vector4 {
        return v instanceof Vector4;
    }
}
