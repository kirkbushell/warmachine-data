type Advantage =
	"jackMarshal" |
	"advanceDeployment" |
	"ambush" |
	"amphibious" |
	"arcNode" |
	"assault" |
	"cavalry" |
	"combinedMeleeAttack" |
	"combinedRangedAttack" |
	"construct" |
	"dualAttack" |
	"eyelessSight" |
	"flight" |
	"gladiator" |
	"gunfighter" |
	"headbuttPowerAttack" |
	"incorporeal" |
	"pathfinder" |
	"resistanceBlast" |
	"resistanceCold" |
	"resistanceCorrosion" |
	"resistanceElectricity" |
	"resistanceFire" |
	"slamPowerAttack" |
	"soulless" |
	"stealth" |
	"tough" |
	"tramplePowerAttack" |
	"undead" |
	"unstoppable"

type Faction = "necrofactorium"

type Feat = {
	[key: string]: {
		name: string
		rules: string
	}
}

type Spell = {
	name: string
	rules: string
	statistics: {
		cost: number
		duration: "round" | "upkeep"
		offensive: boolean
		power?: number
		range: SpellRange
	}
}

type SpellRange = number | "controlRange" | "self"

type Statistics = {
	arcana?: number
	arcaneAttack?: number
	armour: number
	controlRange?: number
	defense: number
	health: number
	meleeAttack?: number
	rangedAttack?: number
	speed: number
}

type Unit = {
	advantages?: Advantage[]
	baseSize: number
	faction: Faction
	keywords: []
	name: string
	statistics: Statistics
	type: UnitType
}

type UnitType =
	"attachment" |
	"battleEngine" |
	"solo" |
	"structure" |
	"unit" |
	"warbeast" |
	"warcaster" |
	"warjack" |
	"warlock"

type Warcaster = Unit & {
	name: string
	type: UnitType
	feat: Feat
	spells: string[]
}

type WeaponQuality =
	"blessed" |
	"buckler" |
	"chainWeapon" |
	"continuousEffectCorrosion" |
	"continuousEffectFire" |
	"criticalCorrosion" |
	"criticalDisruption" |
	"criticalFire" |
	"damageTypeCold" |
	"damageTypeCorrosion" |
	"damageTypeElectricity" |
	"damageTypeFire" |
	"damageTypeMagical" |
	"disruption" |
	"pistol" |
	"shield" |
	"throwPowerAttack" |
	"weaponMaster"

type Weapons = {
	[key: string]: {
		name: string
		weaponQualities?: WeaponQuality[]
		abilities?: string
		statistics: {
			range: number
			power: number
		}
		type: WeaponType
	}
}

type WeaponType =
	"melee" |
	"ranged"