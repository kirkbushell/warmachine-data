"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const primitives_1 = require("./primitives");
exports.default = zod_1.z.object({
    name: zod_1.z.string(),
    rules: zod_1.z.string(),
    type: zod_1.z.enum(["action", "attack", "passive", "weapon"]),
    range: primitives_1.Range.optional()
});
