import { Learn } from "./learn"
import { Packets } from "./packets"

export function Spellbook(events: TSEvents) {
    Learn(events)
    Packets(events)
}