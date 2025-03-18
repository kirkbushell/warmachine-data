import {z, ZodObject} from "zod"

// This schema is used to validate the core structure of the files that contain the required schema.
export const Base = (schema: ZodObject<any>) => z.record(z.string(), schema)

export const Advantage = z.enum([
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
])

export const Faction = z.enum([
	"necrofactorium",
])

export const Feat = z.record(z.string(), z.object({
	name: z.string(),
	rules: z.string(),
}))

export const Range = z.union([z.number().positive(), z.literal("self")])

export const WeaponQuality = z.enum([
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
])

export const WeaponType = z.enum([
	"melee",
	"ranged",
])

export const Weapons = z.record(z.string(), z.object({
	abilities: z.string().optional(),
	name: z.string(),
	statistics: z.object({
		range: z.number(),
		power: z.number(),
	}),
	type: WeaponType,
	qualities: z.array(WeaponQuality).optional(),
}))

export const Statistics = z.object({
	arcana: z.number().optional(),
	arcaneAttack: z.number().optional(),
	armour: z.number(),
	controlRange: z.number().optional(),
	defense: z.number(),
	health: z.number(),
	meleeAttack: z.number().optional(),
	rangedAttack: z.number().optional(),
	speed: z.number(),
})

export const Unit = z.object({
	advantages: z.array(Advantage),
	baseSize: z.number().positive(),
	faction: Faction,
	fieldAllowance: z.union([z.number().positive(), z.literal('c')]),
	keywords: z.array(z.string()),
	name: z.string(),
	statistics: Statistics,
	type: z.enum(["attachment", "battleEngine", "solo", "structure", "unit", "warbeast", "warcaster", "warjack", "warlock"]),
})