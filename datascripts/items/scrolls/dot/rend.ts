import { std } from "wow/wotlk";
import { REND } from "../../../abilities/dot/rend";
import { ABILITY_VENDOR } from "../../../creatures/ability-vendor";

// Create scroll item for ability //
const SCROLL = std.Items.create("azara-core", "rend-ability-scroll")
    .Name.enGB.set("Scroll of Rend")
    .DisplayInfo.set(2616)
    .Class.SCROLL.set()
    .Material.CLOTH.set()
    .Quality.WHITE.set()
    .BagFamily.INSCRIPTION_SUPPLIES.set(true)
    .Price.PlayerSellPrice.set(1000)
    .Spells.addMod(mod => mod
        .Spell.set(REND.ID)
        .Charges.Raw.set(-1)
        .Trigger.ON_USE.set()
    )

// Add to Vendor //
ABILITY_VENDOR.Vendor.add(SCROLL.ID)