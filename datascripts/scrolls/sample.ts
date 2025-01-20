import { std } from "wow/wotlk";
import { ARCANE_INTELLECT, CHARGE, CONCUSSIVE_SHOT, EVISCERATE, FIREBALL, FROSTBOLT, HAMSTRING, HEAL, MIND_BLAST, RENEW } from "../spells/sample";
import { SPELL_VENDOR } from "../creatures/spell-vendor";

let spells = [FROSTBOLT, FIREBALL, ARCANE_INTELLECT, HEAL, RENEW, EVISCERATE, CHARGE, CONCUSSIVE_SHOT, MIND_BLAST, HAMSTRING]

spells.forEach(spell => {
     const SCROLL = std.Items.create("azara-core", `${spell.ID}-scroll`)
    .Name.enGB.set(`Scroll of ${spell.Name.enGB.get()}`)
    .DisplayInfo.set(2616)
    .Class.SCROLL.set()
    .Material.CLOTH.set()
    .Quality.WHITE.set()
    .BagFamily.INSCRIPTION_SUPPLIES.set(true)
    .Price.PlayerSellPrice.set(1000)
    .Spells.addMod(mod => mod
        .Spell.set(spell.ID)
        .Charges.Raw.set(-1)
        .Trigger.ON_USE.set()
    )

    SPELL_VENDOR.Vendor.add(SCROLL.ID)
})