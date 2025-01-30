// This is an example of targetting a specific category of abilities

export function Necromancy(events: TSEvents) {
    events.Spell.OnAfterCast(TAG("azara-core", "NECROMANCY"), spell => {
        const player = ToPlayer(spell.GetCaster())

        if (!player) {
            return
        }

        console.log("Necromancy spell casted!")
    })
}