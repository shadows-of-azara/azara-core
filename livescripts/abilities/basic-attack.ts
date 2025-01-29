// This is an example of targetting a specific category of abilities

export function BasicAttack(events: TSEvents) {
    events.Spell.OnAfterCast(TAG("azara-core", "BASIC_ATTACK"), spell => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }
    })
}