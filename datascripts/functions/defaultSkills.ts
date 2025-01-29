import { MaskCon } from "wow/data/cell/cells/MaskCell";
import { std } from "wow/wotlk";
import { RaceMask } from "wow/wotlk/std/Race/RaceType";
import { PLAYER_CLASS } from "./playerClass";

[
    //{ skill: std.EquipSkills.Axes1H, spell: 196 },
    //{ skill: std.EquipSkills.Axes2H, spell: 197 },
    //{ skill: std.EquipSkills.Maces1H, spell: 198 },
    //{ skill: std.EquipSkills.Maces2H, spell: 199 },
    //{ skill: std.EquipSkills.Polearms, spell: 200 },
    { skill: std.EquipSkills.Swords1H, spell: 201 },
    { skill: std.EquipSkills.Swords2H, spell: 202 },
    { skill: std.EquipSkills.Staves, spell: 227 },
    { skill: std.EquipSkills.Bows, spell: 264 },
    //{ skill: std.EquipSkills.Guns, spell: 266 },
    //{ skill: std.EquipSkills.Daggers, spell: 1180 },
    //{ skill: std.EquipSkills.Thrown, spell: 2567 },
    //{ skill: std.EquipSkills.Wands, spell: 5009 },
    //{ skill: std.EquipSkills.Crossbows, spell: 5011 },
    { skill: std.EquipSkills.Shields, spell: 9116 },
    //{ skill: std.EquipSkills.FistWeapons, spell: 15590 },

    { skill: std.EquipSkills.Cloth, spell: 9078 },
    { skill: std.EquipSkills.Leather, spell: 9077 },
    { skill: std.EquipSkills.Mail, spell: 8737 },
    //{ skill: std.EquipSkills.Plate, spell: 750 }

].forEach(skill => {
    const RACES: MaskCon<keyof typeof RaceMask> = ["HUMAN", "DWARF", "NIGHTELF"]
    if (skill.skill.Skill.get().RaceClassInfos.length === 0) {
        skill.skill.Skill.get().enableAutolearn(PLAYER_CLASS.Mask, RACES)
    } else {
        skill.skill.Skill.get().RaceClassInfos.forEach(x => x.ClassMask.add(PLAYER_CLASS.Mask).RaceMask.add(RACES))
        skill.skill.Skill.get().Autolearn.addGet(PLAYER_CLASS.Mask, RACES)
    }

    std.Spells.load(skill.spell).AutoLearn.add(1, PLAYER_CLASS.Mask)
})