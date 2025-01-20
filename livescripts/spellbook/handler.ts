import { Spellbook } from "./table";

export function Handler(events: TSEvents) {
    events.Player.OnSave(player => {
        Spellbook.Save(player);
    });

    events.Player.OnDelete(guid => {
        Spellbook.Delete(guid);
    });
}