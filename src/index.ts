import * as twod from "./2d";
import * as linalg from "./linalg";

export * from "./2d";
export * from "./linalg";

const geometry = { ...twod, ...linalg };

export default geometry;
