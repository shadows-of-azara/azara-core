import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";
import { AbilityCategory } from "../../functions/abilityCategory";

const SPELL = std.Spells.create("azara-core", "corruption-ability")
    .Name.enGB.set("Corruption")
    .Description.enGB.set("Corrupts the target, causing $o1 Shadow damage over $d.")
    .AuraDescription.enGB.set("$s1 Shadow damage every $t1 seconds.")
    .Icon.setPath("Spell_Shadow_AbominationExplosion")
    .PreventionType.SILENCE.set()
    .DispelType.DISPEL_MAGIC.set()
    .Attributes.set(['NOT_SHAPESHIFTED', 'UNK82'])
    .InterruptFlags.set(['ON_MOVEMENT', 'ON_PUSHBACK', 'ON_INTERRUPT_CAST', 'ON_INTERRUPT'])
    .SchoolMask.set(['PHYSICAL', 'SHADOW'])
    .Visual.set(8629)
    .Duration.setSimple(12000)
    .Cooldown.GlobalCategory.set(133)
    .Cooldown.GlobalTime.set(1500)
    .Power.Type.MANA.set()
    .Power.CostPercent.set(9)
    .Range.setSimple(0, 30)
    .Effects.addMod(x => x
        .Type.APPLY_AURA.set()
        .Aura.PERIODIC_DAMAGE.set()
        .DamagePeriod.set(3000)
        .DamageBase.set(10)
        .DamageDieSides.set(1)
        .BonusMultiplier.set(0.06239999830722809)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )

export const CORRUPTION = createAbility(SPELL.ID, AbilityCategory.Necromancy, 25)
