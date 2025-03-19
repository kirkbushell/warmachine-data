"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitSchema = exports.Attachment = exports.Warjack = exports.Unit = exports.Solo = exports.Warcaster = exports.BaseUnit = void 0;
const zod_1 = require("zod");
const primitives_1 = require("./primitives");
const Record = zod_1.z.object({}).strict();
exports.BaseUnit = Record.extend({
    abilities: primitives_1.Abilities,
    advantages: zod_1.z.array(primitives_1.ModelAdvantage),
    baseSize: zod_1.z.number().positive(),
    faction: primitives_1.Faction,
    fieldAllowance: zod_1.z.union([zod_1.z.number().positive(), zod_1.z.literal('c')]),
    keywords: zod_1.z.array(zod_1.z.string()),
    name: zod_1.z.string(),
    statistics: primitives_1.Statistics,
    type: zod_1.z.enum(["attachment", "battleEngine", "solo", "structure", "unit", "warbeast", "warcaster", "warjack", "warlock"]),
});
exports.Warcaster = exports.BaseUnit.extend({
    feat: primitives_1.Feat,
    rackSlots: zod_1.z.number().positive(),
    spells: zod_1.z.array(zod_1.z.string()),
    weapons: primitives_1.Weapons
});
exports.Solo = exports.BaseUnit.extend({
    points: primitives_1.Points,
    weapons: primitives_1.Weapons
});
exports.Unit = exports.BaseUnit.extend({
    grunts: zod_1.z.number().positive(),
    points: primitives_1.Points,
    weapons: primitives_1.Weapons
});
exports.Warjack = exports.BaseUnit.extend({
    damageGrid: zod_1.z.array(zod_1.z.number()).length(6),
    options: zod_1.z.record(zod_1.z.string(), zod_1.z.record(zod_1.z.string(), primitives_1.Option)),
});
exports.Attachment = exports.BaseUnit.extend({
    points: primitives_1.Points,
    weapons: primitives_1.Weapons
});
/**
 * A simple method to return the appropriate schema based on the data record provided.
 */
const unitSchema = (record) => {
    switch (record.type) {
        case 'attachment':
            return exports.Attachment;
        case 'solo':
            return exports.Solo;
        case 'unit':
            return exports.Unit;
        case 'warcaster':
            return exports.Warcaster;
        case 'warjack':
            return exports.Warjack;
    }
    throw new Error(`Invalid unit type ${record.type}`);
};
exports.unitSchema = unitSchema;
