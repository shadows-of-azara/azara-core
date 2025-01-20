import { std } from "wow/wotlk"
import { CORRUPTION } from "../../../abilities/dot/corruption"
import { ABILITY_VENDOR } from "../../../creatures/ability-vendor"

const SCROLL = std.Items.create("azara-core", `corruption-ability-scroll`)
        .Name.enGB.set(`Scroll of Corruption`)
        .DisplayInfo.set(2616)
        .Class.SCROLL.set()
        .Material.CLOTH.set()
        .Quality.WHITE.set()
        .BagFamily.INSCRIPTION_SUPPLIES.set(true)
        .Price.PlayerSellPrice.set(1000)
        .Spells.addMod(mod => mod
            .Spell.set(CORRUPTION.ID)
            .Charges.Raw.set(-1)
            .Trigger.ON_USE.set()
        )

    ABILITY_VENDOR.Vendor.add(SCROLL.ID)