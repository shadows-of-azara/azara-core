import { DBC, SQL, std } from "wow/wotlk"
import { PLAYER_CLASS } from "./playerClass"
import { write } from "wow"
import { AbilityCategory } from "./abilityCategory"

const DEFAULT_ABILITIES: Array<uint32> = []

export function createAbility(spell: uint32, category: AbilityCategory, isDefault?: boolean) {
    const LOADED_SPELL = std.Spells.load(spell)
    const SPELL_NAME = LOADED_SPELL.Name.enGB.get()

    const ABILITY = std.Spells.create("azara-core", `${spell}-${SPELL_NAME.replace(/[:\s]+/g, '-').toLowerCase()}`)
        .Name.enGB.set(SPELL_NAME)
        .Description.enGB.set(`Teaches you the ability ${SPELL_NAME}.`)
        .Range.set(1)
        .Visual.set(7265)
        .Visual.modRefCopy(visual => {
            visual.PrecastKit.set(3790)
        })
        .CastTime.setSimple(1000)
        .Effects.addMod(eff => eff
            .Type.APPLY_AURA.set()
            .Aura.DUMMY.set()
            .ImplicitTargetA.UNIT_CASTER.set()
            .MiscValueA.set(spell)
        )
        .Attributes.IS_HIDDEN_FROM_LOG.set(true)
        .InterruptFlags.ON_MOVEMENT.set(true)
        .Tags.add("azara-core", "LEARN_ABILITY")

    if (isDefault) {
        LOADED_SPELL.Tags.add("azara-core", "DEFAULT_ABILITY")

        DEFAULT_ABILITIES.push(spell)

        LOADED_SPELL.SkillLines.addMod(category, 0, 0, skill => skill
            .AcquireMethod.LEARN_ON_CREATE.set()
        )

    } else {
        LOADED_SPELL.SkillLines.add(category)
    }

    LOADED_SPELL.Tags.add("azara-core", DBC.SkillLine.query({ ID: category }).DisplayName.enGB.get().replace(/[:\s]+/g, '_').toUpperCase())
    LOADED_SPELL.Tags.add("azara-core", "ABILITY")

    LOADED_SPELL.Effects.mod(2, eff => eff
        .MiscValueA.set(category)
    )

    return ABILITY
}

write("default-abilities", () => {
    DEFAULT_ABILITIES.forEach((ability, index) => {
        [1, 4, 8].forEach((race) => {
            SQL.playercreateinfo_action.add(race, PLAYER_CLASS.ID, index, { action: ability, type: 0 })
        })

        std.Spells.load(ability).AutoLearn.add(1, PLAYER_CLASS.Mask)
    })
})
