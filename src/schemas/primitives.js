"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = exports.Statistics = exports.Weapons = exports.Weapon = exports.WeaponType = exports.WeaponQuality = exports.Range = exports.Points = exports.Feat = exports.Faction = exports.Advantage = exports.Abilities = exports.Dataset = void 0;
const zod_1 = require("zod");
// This schema is used to validate the core structure of the files that contain the required schema.
exports.Dataset = zod_1.z.record(zod_1.z.string(), zod_1.z.any());
exports.Abilities = zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]));
exports.Advantage = zod_1.z.enum([
    "jackMarshal",
    "advanceDeployment",
    "ambush",
    "amphibious",
    "arcNode",
    "assault",
    "cavalry",
    "combinedMeleeAttack",
    "combinedRangedAttack",
    "construct",
    "dualAttack",
    "eyelessSight",
    "flight",
    "gladiator",
    "gunfighter",
    "headbuttPowerAttack",
    "incorporeal",
    "pathfinder",
    "resistanceBlast",
    "resistanceCold",
    "resistanceCorrosion",
    "resistanceElectricity",
    "resistanceFire",
    "slamPowerAttack",
    "soulless",
    "stealth",
    "tough",
    "tramplePowerAttack",
    "undead",
    "unstoppable"
]);
exports.Faction = zod_1.z.enum([
    "necrofactorium",
]);
exports.Feat = zod_1.z.record(zod_1.z.string(), zod_1.z.object({
    name: zod_1.z.string(),
    rules: zod_1.z.string(),
}));
exports.Points = zod_1.z.number().positive();
exports.Range = zod_1.z.union([zod_1.z.number().positive(), zod_1.z.literal("self")]);
exports.WeaponQuality = zod_1.z.enum([
    "blessed",
    "buckler",
    "chainWeapon",
    "continuousEffectCorrosion",
    "continuousEffectFire",
    "criticalCorrosion",
    "criticalDisruption",
    "criticalFire",
    "damageTypeCold",
    "damageTypeCorrosion",
    "damageTypeElectricity",
    "damageTypeFire",
    "damageTypeMagical",
    "disruption",
    "pistol",
    "shield",
    "throwPowerAttack",
    "weaponMaster",
]);
exports.WeaponType = zod_1.z.enum([
    "melee",
    "ranged",
]);
exports.Weapon = zod_1.z.object({
    abilities: exports.Abilities.optional(),
    name: zod_1.z.string(),
    qualities: zod_1.z.array(exports.WeaponQuality).optional(),
    quantity: zod_1.z.number().positive(),
    statistics: zod_1.z.object({
        range: zod_1.z.union([zod_1.z.number(), zod_1.z.string().regex(new RegExp("^Spray [0-9]+$"))]),
        rateOfFire: zod_1.z.union([zod_1.z.number(), zod_1.z.string().optional()]),
        power: zod_1.z.number(),
    }),
    type: exports.WeaponType,
});
exports.Weapons = zod_1.z.record(zod_1.z.string(), exports.Weapon);
exports.Statistics = zod_1.z.object({
    arcana: zod_1.z.number().optional(),
    arcaneAttack: zod_1.z.number().optional(),
    armour: zod_1.z.number(),
    controlRange: zod_1.z.number().optional(),
    defense: zod_1.z.number(),
    health: zod_1.z.number(),
    meleeAttack: zod_1.z.number().optional(),
    rangedAttack: zod_1.z.number().optional(),
    speed: zod_1.z.number(),
});
exports.Option = zod_1.z.object({
    granted: zod_1.z.array(zod_1.z.string()).optional(),
    name: zod_1.z.string(),
    points: exports.Points,
    weapons: zod_1.z.array(exports.Weapon).optional(),
});
