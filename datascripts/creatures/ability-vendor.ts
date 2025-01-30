import { std } from "wow/wotlk"
import { createScroll } from "../functions/createScroll"
import { ARCANE_BOLT } from "../abilities/evocation/arcane-bolt"
import { REND } from "../abilities/one-handed/rend"
import { CORRUPTION } from "../abilities/necromancy/corruption"

const MODEL = std.CreatureOutfits.create().fromString(
    `
    Character\Human\male\humanmale.m2
    1 0
    10 18 8 3 1 8 1
    0
    0
    0
    0
    0
    0
    7478
    7477
    0
    0
    0
    0
    0
    0
    0
    `
)

const SCROLLS = [
    createScroll(ARCANE_BOLT, true),
    createScroll(CORRUPTION),
    createScroll(REND)
]

export const ABILITY_VENDOR = std.CreatureTemplates.create("azara-core", "ability-vendor")
    .Name.enGB.set("Ability Vendor")
    .Level.set(20)
    .FactionTemplate.STORMWIND.set()
    .UnitClass.WARRIOR.set()
    .Type.HUMANOID.set()
    .Rank.ELITE.set()
    .Models.addIds(MODEL.ID)
    .NPCFlags.VENDOR.set(true)
    .Spawns.add("azara-core", "ability-vendor", { map: 0, x: -8940.504883, y: -141.321716, z: 83.484573, o: 0.844251},)

SCROLLS.forEach(scroll => {
    ABILITY_VENDOR.Vendor.add(scroll.ID)
})