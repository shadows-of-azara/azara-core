export function Ability(events: TSEvents) {
    events.Spell.OnAfterCast(TAG("azara-core", "ABILITY"), spell => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }

        let skillLine = spell.GetSpellInfo().GetEffect(2).GetMiscValue()

        if (Math.random() <= 0.2) {
            player.AdvanceSkill(skillLine, 1)
        }
    })
}