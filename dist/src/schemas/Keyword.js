"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
exports.default = zod_1.z.object({
    name: zod_1.z.string(),
    rules: zod_1.z.string(),
});
