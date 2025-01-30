import { std } from "wow/wotlk";
import { RaceIDs, RaceMask } from "wow/wotlk/std/Race/RaceType";
import { PLAYER_CLASS } from "./playerClass";
import { SkillLine } from "wow/wotlk/std/SkillLines/SkillLine";
import { MaskCon } from "wow/data/cell/cells/MaskCell";

[
    { skill: std.EquipSkills.Axes1H, spell: 196, race: RaceIDs.DWARF },
    { skill: std.EquipSkills.Maces1H, spell: 198, race: RaceIDs.NIGHTELF },
    { skill: std.EquipSkills.Swords1H, spell: 201, race: RaceIDs.HUMAN },
    { skill: std.EquipSkills.Shields, spell: 9116 },

    //{ skill: std.EquipSkills.Axes2H, spell: 197 },
    //{ skill: std.EquipSkills.Maces2H, spell: 199 },
    //{ skill: std.EquipSkills.Swords2H, spell: 202 },
    //{ skill: std.EquipSkills.Staves, spell: 227 },
    //{ skill: std.EquipSkills.Bows, spell: 264 },
    //{ skill: std.EquipSkills.Polearms, spell: 200 },
    //{ skill: std.EquipSkills.Guns, spell: 266 },
    //{ skill: std.EquipSkills.Daggers, spell: 1180 },
    //{ skill: std.EquipSkills.Thrown, spell: 2567 },
    //{ skill: std.EquipSkills.Wands, spell: 5009 },
    //{ skill: std.EquipSkills.Crossbows, spell: 5011 },
    //{ skill: std.EquipSkills.FistWeapons, spell: 15590 },

    { skill: std.EquipSkills.Cloth, spell: 9078 },
    { skill: std.EquipSkills.Leather, spell: 9077 },

    //{ skill: std.EquipSkills.Mail, spell: 8737 },
    //{ skill: std.EquipSkills.Plate, spell: 750 }

].forEach(skill => {
    if (skill.race == RaceIDs.HUMAN) learnSkill(skill.skill.Skill.get(), skill.spell, "HUMAN")

    if (skill.race == RaceIDs.DWARF) learnSkill(skill.skill.Skill.get(), skill.spell, "DWARF")

    if (skill.race == RaceIDs.NIGHTELF) learnSkill(skill.skill.Skill.get(), skill.spell, "NIGHTELF")

    if (!skill.race) learnSkill(skill.skill.Skill.get(), skill.spell)
})

function learnSkill(skill: SkillLine, spell: uint32, race?: MaskCon<keyof typeof RaceMask>) {
    if (race) {
        skill.enableAutolearn(PLAYER_CLASS.Mask, race)
        std.Spells.load(spell).AutoLearn.add(1, PLAYER_CLASS.Mask, race)
    } else {
        skill.enableAutolearn(PLAYER_CLASS.Mask)
        std.Spells.load(spell).AutoLearn.add(1, PLAYER_CLASS.Mask)
    }
}