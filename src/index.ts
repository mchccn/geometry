import * as euclidean from "./euclidean";
import * as linalg from "./linalg";

export * from "./euclidean";
export * from "./linalg";

const geometry = { ...euclidean, ...linalg };

export default geometry;
module.exports = geometry;
exports.default = geometry;
