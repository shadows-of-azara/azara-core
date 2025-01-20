import { std } from "wow/wotlk";
import { ARCANE_INTELLECT, CHARGE, CONCUSSIVE_SHOT, FIREBALL, FROSTBOLT, HAMSTRING, HEAL, MIND_BLAST, RENEW, SINISTER_STRIKE } from "../abilities/sample";
import { ABILITY_VENDOR } from "../creatures/ability-vendor";

let abilities = [FROSTBOLT, FIREBALL, ARCANE_INTELLECT, HEAL, RENEW, CHARGE, CONCUSSIVE_SHOT, MIND_BLAST, HAMSTRING, SINISTER_STRIKE]

abilities.forEach(ability => {
    const SCROLL = std.Items.create("azara-core", `${ability.ID}-scroll`)
        .Name.enGB.set(`Scroll of ${ability.Name.enGB.get()}`)
        .DisplayInfo.set(2616)
        .Class.SCROLL.set()
        .Material.CLOTH.set()
        .Quality.WHITE.set()
        .BagFamily.INSCRIPTION_SUPPLIES.set(true)
        .Price.PlayerSellPrice.set(1000)
        .Spells.addMod(mod => mod
            .Spell.set(ability.ID)
            .Charges.Raw.set(-1)
            .Trigger.ON_USE.set()
        )

    ABILITY_VENDOR.Vendor.add(SCROLL.ID)
})