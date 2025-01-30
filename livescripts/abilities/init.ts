import { Ability } from "./ability"
import { Necromancy } from "./necromancy"

export function Skills(events: TSEvents) {
    Ability(events)
    Necromancy(events)
}