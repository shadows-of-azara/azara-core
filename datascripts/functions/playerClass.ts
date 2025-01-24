import { MaskCon, MaskCell32 } from "wow/data/cell/cells/MaskCell";
import { std } from "wow/wotlk";
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs";
import { ClassMask } from "wow/wotlk/std/Class/ClassRegistry";
import { RaceMask } from "wow/wotlk/std/Race/RaceType";
import { EquipSkill } from "wow/wotlk/std/SkillLines/EquipSkills";

function enableSkill(skill: EquipSkill, classMask?: MaskCon<keyof typeof ClassMask>, race: MaskCon<keyof typeof RaceMask> = MaskCell32.AllBits, rank: number = 0) {
    if (skill.Skill.get().RaceClassInfos.length === 0) {
        skill.Skill.get().enableAutolearn(classMask, race)
    } else {
        skill.Skill.get().RaceClassInfos.forEach(x => x.ClassMask.add(classMask).RaceMask.add(race))
        skill.Skill.get().Autolearn.addGet(classMask, race).Rank.set(rank);
    }
}

export const PLAYER_CLASS = std.Classes.create("azara-core", "player", "MAGE")
    .Name.enGB.set("Player")
    .RequiredExpansion.set(0)
    .Races.add("HUMAN")
    .Races.add("DWARF")
    .Races.add("NIGHTELF")
    .UI.ButtonPos.setRelativePoint('BOTTOMLEFT')
    .UI.ButtonPos.setRelativeTo('UIPARENT')
    .UI.ButtonPos.setPos(-100, -100)

PLAYER_CLASS.row.Filename.set("WARRIOR")

export const PLAYER_SKILL = std.SkillLines.create("azara-core", "player-skill")
    .Name.enGB.set("Player")
    .Category.set(7)

const SKILLS = [
    std.EquipSkills.Axes1H,
    std.EquipSkills.Axes2H,
    std.EquipSkills.Maces1H,
    std.EquipSkills.Maces2H,
    std.EquipSkills.Polearms,
    std.EquipSkills.Swords1H,
    std.EquipSkills.Swords2H,
    std.EquipSkills.Staves,
    std.EquipSkills.Bows,
    std.EquipSkills.Guns,
    std.EquipSkills.Daggers,
    std.EquipSkills.Thrown,
    std.EquipSkills.Wands,
    std.EquipSkills.Crossbows,
    std.EquipSkills.Shields,
    std.EquipSkills.FistWeapons,

    std.EquipSkills.Cloth,
    std.EquipSkills.Leather,
    std.EquipSkills.Mail,
    std.EquipSkills.Plate,
]

const SKILL_SPELLS = [
    196, // 1H Axes
    197, // 2H Axes
    198, // 1H Maces
    199, // 2H Maces
    200, // Polearms
    201, // 1H Swords
    202, // 2H Swords
    227, // Staves
    264, // Bows
    266, // Guns
    1180, // Daggers
    2567, // Thrown
    5009, // Wands
    5011, // Crossbows
    9116, // Shield
    15590, // Fist Weapons

    9078, // Cloth
    9077, // Leather
    8737, // Mail
    750, // Plate
]

SKILLS.forEach(skill => enableSkill(skill, PLAYER_CLASS.Mask, ["HUMAN", "DWARF", "NIGHTELF"]))

SKILL_SPELLS.forEach(skill => std.Spells.load(skill).AutoLearn.add(1, PLAYER_CLASS.Mask))

// Disable default classes
const CLASSES = [
    ClassIDs.WARRIOR,
    ClassIDs.PALADIN,
    ClassIDs.HUNTER,
    ClassIDs.ROGUE,
    ClassIDs.PRIEST,
    ClassIDs.DEATH_KNIGHT,
    ClassIDs.SHAMAN,
    ClassIDs.MAGE,
    ClassIDs.WARLOCK,
    ClassIDs.DRUID,
]

CLASSES.forEach((v) => {
    std.Classes.load(v)
        .RequiredExpansion.set(5)
        .UI.ButtonPos.setRelativePoint('BOTTOMLEFT')
        .UI.ButtonPos.setRelativeTo('UIPARENT')
        .UI.ButtonPos.setPos(-100, -100);
})

const DISABLED_RACES = [2, 5, 6, 7, 8, 10, 11]

DISABLED_RACES.forEach(race => {
    std.DBC.ChrRaces.findById(race)
        .Required_Expansion.set(5)
        .Flags.set(1)
})
