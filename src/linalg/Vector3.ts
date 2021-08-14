import { Matrix } from "./Matrix";
import { CreateMatrix } from "./types";
import { clone, rotate, LinearAlgebraError } from "./utils";

export class Vector3 {
    public static readonly ORDER = 3;

    private coords: [x: number, y: number, z: number];

    public constructor(x?: number, y?: number, z?: number) {
        this.coords = [x ?? 0, y ?? 0, z ?? 0];
    }

    public *[Symbol.iterator]() {
        yield* this.coords;
    }

    public add(vector: Vector3): this;
    public add(scalar: number): this;
    public add(x: number, y: number, z: number): this;
    public add(x: Vector3 | number, y?: number, z?: number): this {
        if (Vector3.isVector3(x)) {
            this.x += x.x;
            this.y += x.y;
            this.z += x.z;
        } else {
            this.x += x;
            this.y += y ?? x;
            this.z += z ?? x;
        }

        return this;
    }

    public subtract(vector: Vector3): this;
    public subtract(scalar: number): this;
    public subtract(x: number, y: number, z: number): this;
    public subtract(x: Vector3 | number, y?: number, z?: number): this {
        if (Vector3.isVector3(x)) {
            this.x -= x.x;
            this.y -= x.y;
            this.z -= x.z;
        } else {
            this.x -= x;
            this.y -= y ?? x;
            this.z -= z ?? x;
        }

        return this;
    }

    public multiply(vector: Vector3): this;
    public multiply(scalar: number): this;
    public multiply(x: number, y: number, z: number): this;
    public multiply(x: Vector3 | number, y?: number, z?: number): this {
        if (Vector3.isVector3(x)) {
            this.x *= x.x;
            this.y *= x.y;
            this.z *= x.z;
        } else {
            this.x *= x;
            this.y *= y ?? x;
            this.z *= z ?? x;
        }

        return this;
    }

    public divide(vector: Vector3): this;
    public divide(scalar: number): this;
    public divide(x: number, y: number, z: number): this;
    public divide(x: Vector3 | number, y?: number, z?: number): this {
        if (Vector3.isVector3(x)) {
            this.x /= x.x;
            this.y /= x.y;
            this.z /= x.z;
        } else {
            this.x /= x;
            this.y /= y ?? x;
            this.z /= z ?? x;
        }

        return this;
    }

    public negate() {
        this.multiply(-1);

        return this;
    }

    public angleTo(vector: Vector3) {
        return Math.acos((this.dot(vector) / this.magnitude) * vector.magnitude);
    }

    public dot(vector: Vector3) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    public cross(a: Vector3, b: Vector3) {
        return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    }

    public determinant(a: Vector3, b: Vector3) {
        return new Matrix(3, 3, rotate([[...this.coords], [...a.coords], [...b.coords]], 1) as CreateMatrix<3, 3>).determinant();
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

    public equals(vector: Vector3) {
        return vector.x === this.x && vector.y === this.y && vector.z === this.z;
    }

    public toString() {
        return `Vector3 (${this.coords.join(", ")})`;
    }

    public clone() {
        return new Vector3(...this.coords);
    }

    public toArray() {
        return clone(this.coords);
    }

    public toPoint() {
        const { x, y, z } = this;

        return { x, y, z };
    }

    public transform(transformation: Matrix<3, 3>) {
        const [i, j, k] = transformation.multiply(new Matrix(1, 3, [[this.x], [this.y], [this.z]]))[0];

        this.x = i;
        this.y = j;
        this.z = k;

        return this;
    }

    public get magnitude() {
        return Math.cbrt(this.x * this.x + this.y * this.y + this.z * this.z);
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

    public static get up() {
        return new Vector3(0, 1, 0);
    }

    public static get down() {
        return new Vector3(0, -1, 0);
    }

    public static get left() {
        return new Vector3(-1, 0, 0);
    }

    public static get right() {
        return new Vector3(1, 0, 0);
    }

    public static get back() {
        return new Vector3(0, 0, -1);
    }

    public static get front() {
        return new Vector3(0, 0, 1);
    }

    public static lerp(a: Vector3, b: Vector3, t: number) {
        if (t < 0 || t > 1) throw new LinearAlgebraError("t in lerp(a, b, t) is between 0 and 1 inclusive");

        const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

        return new Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t));
    }

    public static add(a: Vector3, b: Vector3) {
        return a.clone().add(b.clone());
    }

    public static subtract(a: Vector3, b: Vector3) {
        return a.clone().subtract(b.clone());
    }

    public static multiply(a: Vector3, b: Vector3) {
        return a.clone().multiply(b.clone());
    }

    public static divide(a: Vector3, b: Vector3) {
        return a.clone().divide(b.clone());
    }

    public static negate(vector: Vector3) {
        return vector.clone().negate();
    }

    public static angleTo(a: Vector3, b: Vector3) {
        return a.clone().angleTo(b.clone());
    }

    public static normalize(vector: Vector3) {
        return vector.clone().normalize();
    }

    public static isVector3(v: any): v is Vector3 {
        return v instanceof Vector3;
    }
}
