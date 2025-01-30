import { std } from "wow/wotlk"
import { Spell } from "wow/wotlk/std/Spell/Spell"

export function createScroll(spell: Spell, soulbound?: boolean) {
    const NAME = spell.Name.enGB.get()

    const SCROLL = std.Items.create("azara-core", `${NAME.replace(/[:\s]+/g, '-').toLowerCase()}-scroll`)
        .Name.enGB.set(`Scroll of ${NAME}`)
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
        SCROLL.Requirements.Skill.Skill.set(spell.Effects.get(1).MiscValueA.get())
        SCROLL.Requirements.Skill.Rank.set(spell.Effects.get(1).MiscValueB.get())

    if (soulbound) SCROLL.Bonding.BINDS_ON_PICKUP.set()

    return SCROLL
}