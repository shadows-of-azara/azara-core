import { std } from "wow/wotlk";

std.Items.create("azara-core", "crit-helm")
    .Name.enGB.set("Crit Helm")
    .Description.enGB.set("Sets all stats to maximum values.")
    .DisplayInfo.set(46514)
    .Class.CLOTH_EQUIP.set()
    .InventoryType.HEAD.set()
    .Quality.ORANGE.set()
    .Stats.add("CRIT_SPELL_RATING", 50)