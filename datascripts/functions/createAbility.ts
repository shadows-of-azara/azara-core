import { DBC, SQL, std } from "wow/wotlk"
import { Ids } from "wow/wotlk/std/Misc/Ids"
import { PLAYER_CLASS, PLAYER_SKILL } from "./playerClass"
import { write } from "wow"

const DEFAULT_ABILITIES: Array<uint32> = []

export function createAbility(spell: uint32, isDefault?: boolean) {
    let name = std.Spells.load(spell).Name.enGB.get()

    const ABILITY = std.Spells.create("azara-core", `${spell}-${name.replace(/[:\s]+/g, '-').toLowerCase()}`)
        .Name.enGB.set(name)
        .Description.enGB.set(`Teaches you the ability ${name}.`)
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
        std.Spells.load(spell).Tags.add("azara-core", "DEFAULT_ABILITY")

        DEFAULT_ABILITIES.push(spell)

        DBC.SkillLineAbility.add(Ids.SkillLineAbility.id())
            .SkillLine.set(PLAYER_SKILL.ID)
            .Spell.set(spell)
            .AcquireMethod.set(2)
            .MinSkillLineRank.set(1)
    }

    return ABILITY
}

write("default-abilities", () => {
    DEFAULT_ABILITIES.forEach((ability, index) => {
        const RACES = [1, 4, 8]

        RACES.forEach((race) => {
            SQL.playercreateinfo_action.add(race, PLAYER_CLASS.ID, index, { action: ability, type: 0 })
        })

        std.Spells.load(ability).AutoLearn.add(1, PLAYER_CLASS.Mask)
    })
})
