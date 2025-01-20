import { std } from "wow/wotlk"

export function createSpell(spell: uint32) {
    let name = std.Spells.load(spell).Name.enGB.get()

    const SPELL = std.Spells.create("azara-core", `${spell}-${name.replace(/[:\s]+/g, '-').toLowerCase()}`)
        .Name.enGB.set(name)
        .Description.enGB.set(`Teaches you the spell ${name}.`)
        .Range.set(1)
        .Visual.set(7265)
        .Effects.addMod(eff => eff
            .Type.APPLY_AURA.set()
            .Aura.DUMMY.set()
            .ImplicitTargetA.UNIT_CASTER.set()
            .MiscValueA.set(spell)
        )
        .Attributes.IS_HIDDEN_FROM_LOG.set(true)
        .Tags.add("azara-core", "LEARN_SPELL")

    return SPELL
}