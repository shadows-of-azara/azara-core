import { DBC, std } from "wow/wotlk";
import { ClassIDs } from "wow/wotlk/std/Class/ClassIDs";

// Create class
export const PLAYER_CLASS = std.Classes.create("azara-core", "player", "MAGE")
    .Name.enGB.set("Player")
    .RequiredExpansion.set(0)
    .Races.add("HUMAN")
    .Races.add("DWARF")
    .Races.add("NIGHTELF")
    .UI.ButtonPos.setRelativePoint('BOTTOMLEFT')
    .UI.ButtonPos.setRelativeTo('UIPARENT')
    .UI.ButtonPos.setPos(-100, -100)

PLAYER_CLASS.row.Filename.set("WARRIOR");

// Disable default classes
[
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
    
].forEach((v) => {
    std.Classes.load(v)
        .RequiredExpansion.set(5)
        .UI.ButtonPos.setRelativePoint('BOTTOMLEFT')
        .UI.ButtonPos.setRelativeTo('UIPARENT')
        .UI.ButtonPos.setPos(-100, -100);
});

// Disable races
[2, 5, 6, 7, 8, 10, 11].forEach(race => {
    std.DBC.ChrRaces.findById(race)
        .Required_Expansion.set(5)
        .Flags.set(1)
})

DBC.SkillLineCategory.query({ID: 7}).Name.enGB.set("Abilities")