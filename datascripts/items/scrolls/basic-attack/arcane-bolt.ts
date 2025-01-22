import { std } from "wow/wotlk"
import { ABILITY_VENDOR } from "../../../creatures/ability-vendor"
import { ARCANE_BOLT } from "../../../abilities/basic-attack/arcane-bolt"

const SCROLL = std.Items.create("azara-core", `arcane-bolt-ability-scroll`)
        .Name.enGB.set(`Scroll of Arcane Bolt`)
        .DisplayInfo.set(2616)
        .Class.SCROLL.set()
        .Material.CLOTH.set()
        .Quality.WHITE.set()
        .BagFamily.INSCRIPTION_SUPPLIES.set(true)
        .Price.PlayerSellPrice.set(1000)
        .Spells.addMod(mod => mod
            .Spell.set(ARCANE_BOLT.ID)
            .Charges.Raw.set(-1)
            .Trigger.ON_USE.set()
        )

    ABILITY_VENDOR.Vendor.add(SCROLL.ID)