import { AbilityHook } from "./hook";
import { AbilityPackets } from "./packet";

export function Abilities(events: TSEvents) {
    AbilityHook(events);
    AbilityPackets(events);
}