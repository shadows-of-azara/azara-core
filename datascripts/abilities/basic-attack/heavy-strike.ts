import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";

// Create Spell //
const SPELL = std.Spells.create("azara-core", "heavy-strike")
    .Name.enGB.set("Heavy Strike")
    .Description.enGB.set("A 2 handed melee attack that does your weapon damage plus $s1 to the target.")
    .Icon.setPath("Ability_Warrior_Cleave")
    .PreventionType.PACIFY.set()
    .ItemEquips.set2HWeapon()
    .FacingCasterFlags.set("SPELL_FACING_FLAG_INFRONT")
    .Attributes.set(['NEXT_SWING','IS_ABILITY','NOT_SHAPESHIFTED','SHEATHE_UNCHANGED','MELEE_COMBAT_START','MAINHAND_REQUIRED'])
    .SchoolMask.set(['PHYSICAL'])
    .DefenseType.set(2)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(25)
    .Range.setSimple(0, 5)
    .Visual.set(219)
    .Effects.addMod(x => x
        .Type.WEAPON_DAMAGE.set()
        .DamageBase.set(15)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

// Export as an Ability //
export const HEAVY_STRIKE = createAbility(SPELL.ID)