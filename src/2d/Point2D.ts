export default class Point2D {
    private coords;

    public constructor(x: number, y: number) {
        this.coords = [x, y] as [number, number];
    }

    *[Symbol.iterator]() {
        yield* this.coords;
    }

    public get 0() {
        return this.coords[0];
    }

    public get 1() {
        return this.coords[1];
    }

    public set 0(value: number) {
        this.coords[0] = value;
    }

    public set 1(value: number) {
        this.coords[1] = value;
    }

    public get x() {
        return this.coords[0];
    }

    public get y() {
        return this.coords[1];
    }

    public set x(value: number) {
        this.coords[0] = value;
    }

    public set y(value: number) {
        this.coords[1] = value;
    }

    public toArray() {
        return this.coords;
    }

    public static from(coords: [number, number]) {
        return new Point2D(coords[0], coords[1]);
    }
}
