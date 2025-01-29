import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";

// Create Spell //
const SPELL = std.Spells.create("azara-core", "shadow-bolt-ability")

SPELL.Name.enGB.set("Shadow Bolt")
    .Description.enGB.set("Sends a shadowy bolt at the enemy, causing $s1 Shadow damage.")
    .Icon.setPath("Spell_Shadow_ShadowBolt")
    .PreventionType.SILENCE.set()
    .FacingCasterFlags.set(["SPELL_FACING_FLAG_INFRONT"])
    .Attributes.set(["NOT_SHAPESHIFTED"])
    .InterruptFlags.set(["ON_MOVEMENT", "ON_PUSHBACK", "ON_INTERRUPT_CAST", "ON_INTERRUPT"])
    .SchoolMask.set(["PHYSICAL", "SHADOW"])
    .Visual.set(64)
    .DefenseType.set(1)
    .Speed.set(20)
    .CastTime.setSimple(1700)
    .Cooldown.GlobalTime.set(1500)
    .Cooldown.GlobalCategory.set(133)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(10)
    .Range.setSimple(0, 30)
    .Effects.addMod(x => x
        .Type.SCHOOL_DAMAGE.set()
        .DamageBase.set(14)
        .DamageDieSides.set(5)
        .DamagePerLevel.set(0.4000000059604645)
        .BonusMultiplier.set(0.14000000059604645)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

export const SHADOW_BOLT = createAbility(SPELL.ID, true)