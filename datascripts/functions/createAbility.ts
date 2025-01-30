import { DBC, SQL, std } from "wow/wotlk"
import { PLAYER_CLASS } from "./playerClass"
import { write } from "wow"
import { Category } from "./abilityCategory"

const DEFAULT_ABILITIES: Array<uint32> = []

export function createAbility(spell: uint32, category: Category, requiredSkill?: uint32, learnOnCreate?: boolean) {
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
        .Effects.mod(0, eff => eff
            .Type.APPLY_AURA.set()
            .Aura.DUMMY.set()
            .ImplicitTargetA.UNIT_CASTER.set()
            .MiscValueA.set(spell)
        )
        .Effects.mod(1, eff => eff
            .MiscValueA.set(category.GetSkill())
        )
        .Attributes.IS_HIDDEN_FROM_LOG.set(true)
        .InterruptFlags.ON_MOVEMENT.set(true)
        .Tags.add("azara-core", "LEARN_ABILITY")

    if (requiredSkill) {
        ABILITY.Effects.mod(1, (eff => eff
            .MiscValueB.set(requiredSkill)
        ))
    }

    if (learnOnCreate) {
        LOADED_SPELL.Tags.add("azara-core", "DEFAULT_ABILITY")

        DEFAULT_ABILITIES.push(spell)

    } else {
        LOADED_SPELL.SkillLines.add(category.GetSkill())
    }

    LOADED_SPELL.Tags.add("azara-core", DBC.SkillLine.query({ ID: category.GetSkill() }).DisplayName.enGB.get().replace(/[:\s]+/g, '_').toUpperCase())
    LOADED_SPELL.Tags.add("azara-core", "ABILITY")

    LOADED_SPELL.Effects.mod(2, eff => eff
        .MiscValueA.set(category.GetSkill())
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