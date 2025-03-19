"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const primitives_1 = require("./primitives");
exports.default = zod_1.z.object({
    name: zod_1.z.string(),
    rules: zod_1.z.string(),
    statistics: zod_1.z.object({
        areaOfEffect: zod_1.z.union([zod_1.z.number().positive(), zod_1.z.literal("controlRange")]).optional(),
        cost: zod_1.z.number().positive(),
        duration: zod_1.z.enum(["round", "upkeep"]).optional(),
        offensive: zod_1.z.boolean(),
        power: zod_1.z.union([zod_1.z.number().positive(), zod_1.z.string().regex(new RegExp("^[0-9]+/[0-9]+$"))]).optional(),
        range: primitives_1.Range.optional(),
    })
});
