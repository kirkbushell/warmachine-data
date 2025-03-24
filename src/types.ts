import Ability from "./schemas/Ability"
import Advantage from "./schemas/Advantage"
import CommandCard from "./schemas/CommandCard"
import Keyword from "./schemas/Keyword"
import * as Primitives from "./schemas/primitives"
import Spell from "./schemas/Spell"
import * as Units from "./schemas/units"
import z from "zod"

export type Ability = z.infer<typeof Ability>
export type Advantage = z.infer<typeof Advantage>
export type Attachment = z.infer<typeof Units.Attachment>
export type CommandCard = z.infer<typeof CommandCard>
export type Dataset = z.infer<typeof Primitives.Dataset>
export type Faction = z.infer<typeof Primitives.Faction>
export type Generic = Ability | Advantage | Attachment | CommandCard | Solo | Spell | Unit | Warcaster | Warjack
export type Feat = z.infer<typeof Primitives.Feat>
export type Keyword = z.infer<typeof Keyword>
export type ModelAdvantage = z.infer<typeof Primitives.ModelAdvantage>
export type Option = z.infer<typeof Primitives.Option>
export type Points = z.infer<typeof Primitives.Points>
export type Range = z.infer<typeof Primitives.Range>
export type Solo = z.infer<typeof Units.Solo>
export type Spell = z.infer<typeof Spell>
export type Statistics = z.infer<typeof Primitives.Statistics>
export type Unit = z.infer<typeof Units.Unit>
export type Warcaster = z.infer<typeof Units.Warcaster>
export type Warjack = z.infer<typeof Units.Warjack>
export type Weapon = z.infer<typeof Primitives.Weapon>
export type WeaponQuality = z.infer<typeof Primitives.WeaponQuality>
export type WeaponType = z.infer<typeof Primitives.WeaponType>
