import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";
import { AbilityCategory } from "../../functions/abilityCategory";

// Create spell //
const SPELL = std.Spells.create("azara-core", "rend-ability")
    .Name.enGB.set("Rend")
    .Description.enGB.set("Wounds the target causing them to bleed for $o1 damage plus an additional ${0.2*5*(($MWB+$mwb)/2+$AP/14*$MWS)} (based on weapon damage) over $d.")
    .AuraDescription.enGB.set("Bleeding for $s1 plus a percentage of weapon damage every $t1 seconds.")
    .Icon.setPath("Ability_Gouge")
    .PreventionType.PACIFY.set()
    .Mechanic.set(15)
    .DefenseType.set(2)
    .FacingCasterFlags.set(['SPELL_FACING_FLAG_INFRONT'])
    .Attributes.set(['IS_ABILITY','NOT_SHAPESHIFTED','SHEATHE_UNCHANGED','MELEE_COMBAT_START','UNK10','MAINHAND_REQUIRED','UNK82'])
    .SchoolMask.set(['PHYSICAL'])
    .Visual.set(372)
    .Duration.setSimple(15000)
    .Cooldown.GlobalTime.set(1500)
    .Cooldown.GlobalCategory.set(133)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(10)
    .Range.setSimple(0, 5)
    .Effects.addMod(x => x
        .Type.APPLY_AURA.set()
        .Aura.PERIODIC_DAMAGE.set()
        .DamagePeriod.set(3000)
        .DamageBase.set(5)
        .DamageDieSides.set(1)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

// Export spell as an ability //
export const REND = createAbility(SPELL.ID, AbilityCategory.One_Handed, 0, true)