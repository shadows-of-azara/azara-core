import { std } from "wow/wotlk"
import { ABILITY_VENDOR } from "../../../creatures/ability-vendor"
import { LIGHT_STRIKE } from "../../../abilities/basic-attack/light-strike"
import { HEAVY_STRIKE } from "../../../abilities/basic-attack/heavy-strike"

// Create scroll item for ability //
const SCROLL = std.Items.create("azara-core", `heavy-strike-ability-scroll`)
    .Name.enGB.set(`Scroll of Heavy Strike`)
    .DisplayInfo.set(2616)
    .Class.SCROLL.set()
    .Material.CLOTH.set()
    .Quality.WHITE.set()
    .BagFamily.INSCRIPTION_SUPPLIES.set(true)
    .Price.PlayerSellPrice.set(1000)
    .Spells.addMod(mod => mod
        .Spell.set(HEAVY_STRIKE.ID)
        .Charges.Raw.set(-1)
        .Trigger.ON_USE.set()
    )

// Add to Vendor //
ABILITY_VENDOR.Vendor.add(SCROLL.ID)