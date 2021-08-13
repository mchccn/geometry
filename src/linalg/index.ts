import { Matrix } from "./Matrix";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { Vector4 } from "./Vector4";

const linalg = Object.freeze({ Matrix, Vector2, Vector3, Vector4 });

export { Matrix, Vector2, Vector3, Vector4 };
export default linalg;

module.exports = linalg;
exports.default = linalg;
