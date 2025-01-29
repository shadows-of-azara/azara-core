import { Ability } from "./ability"
import { BasicAttack } from "./basic-attack"

export function Skills(events: TSEvents) {
    Ability(events)
    BasicAttack(events)
}