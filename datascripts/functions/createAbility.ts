import { std } from "wow/wotlk";

export function createAbility(name: string, spell: uint32) {
    const DUMMY_SPELL = std.Spells.create('magic-core', `${spell}-${name}`)
        .Name.enGB.set(`Scroll of ${name}`)
        .Description.enGB.set(`Learn the ability ${name}`)
        .Range.set(1)
        .Visual.set(7265)
        .Effects.addMod(eff => eff
            .Type.APPLY_AURA.set()
            .Aura.DUMMY.set()
            .ImplicitTargetA.UNIT_CASTER.set()
            .MiscValueA.set(spell)
        )
        .Attributes.IS_HIDDEN_FROM_LOG.set(true)
        .Tags.add("magic-core", "LEARN_ABILITY")

    const ABILITY = std.Items.create('magic-core', `${spell}-${name}`)
        .Name.enGB.set(`Scroll of ${name}`)
        .DisplayInfo.set(2616)
        .Class.SCROLL.set()
        .Material.CLOTH.set()
        .Quality.WHITE.set()
        .BagFamily.INSCRIPTION_SUPPLIES.set(true)
        .Price.PlayerSellPrice.set(1000)
        .Spells.addMod(spell => spell
            .Spell.set(DUMMY_SPELL.ID)
            .Charges.Raw.set(-1)
            .Trigger.ON_USE.set()
        )
}