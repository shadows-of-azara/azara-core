import { Spellbook } from "./table";

export function Handler(events: TSEvents) {
    events.Player.OnSave(player => {
        Spellbook.Save(player);
    });

    events.Player.OnDelete(guid => {
        Spellbook.Delete(guid);
    });

    events.Player.OnCreate((player) => {
        TAG("azara-core", "DEFAULT_ABILITY").forEach(ability => {
            Spellbook.Learn(player, ability)
            Spellbook.ActivateAbility(player, ability)
        })
    })
}
