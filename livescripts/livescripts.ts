import { Skills } from "./abilities/init"
import { Spellbook } from "./spellbook/init"

export function Main(events: TSEvents) {
    Spellbook(events)
    Skills(events)
}