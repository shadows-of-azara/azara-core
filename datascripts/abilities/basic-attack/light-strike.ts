import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";

// Create Spell //
const SPELL = std.Spells.create("azara-core", "light-strike")
    .Name.enGB.set("Light Strike")
    .Description.enGB.set("A melee attack that increases attack power by $s1.")
    .Icon.setPath("Ability_MeleeDamage")
    .PreventionType.PACIFY.set()
    .FacingCasterFlags.set("SPELL_FACING_FLAG_INFRONT")
    .Attributes.set(['NEXT_SWING','NEXT_SWING2','NOT_SHAPESHIFTED','SHEATHE_UNCHANGED','MAINHAND_REQUIRED'])
    .SchoolMask.set(['PHYSICAL'])
    .DefenseType.set(2)
    .CastTime.set(6000)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(10)
    .Range.setSimple(0, 5)
    .Visual.set(39)
    .Effects.addMod(x => x
        .Type.WEAPON_DAMAGE.set()
        .DamageBase.set(5)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

// Export as an Ability //
export const LIGHT_STRIKE = createAbility(SPELL.ID)