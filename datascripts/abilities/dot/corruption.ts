import { std } from "wow/wotlk";
import { createAbility } from "../../functions/createAbility";

const SPELL = std.Spells.create("azara-core", "corruption-ability")
    .Name.set({"enGB":"Corruption"})
    .Description.set({"enGB":"Corrupts the target, causing $o1 Shadow damage over $d."})
    .AuraDescription.set({"enGB":"$s1 Shadow damage every $t1 seconds."})
    .Icon.setFullPath("Interface\\Icons\\Spell_Shadow_AbominationExplosion")
    .PreventionType.SILENCE.set()
    .DispelType.DISPEL_MAGIC.set()
    .Attributes.set(['NOT_SHAPESHIFTED','UNK82'])
    .InterruptFlags.set(['ON_MOVEMENT','ON_PUSHBACK','ON_INTERRUPT_CAST','ON_INTERRUPT'])
    .SchoolMask.set(['PHYSICAL','SHADOW'])
    .Visual.set(8629)
    .Duration.modRefCopy(x=>x
        .Duration.set(12000)
        .MaxDuration.set(12000)
    )
    .Cooldown.mod(x=>x
        .GlobalTime.set(1500)
        .GlobalCategory.set(133)
    )
    .Power.mod(x=>x
        .Type.MANA.set()
        .CostPercent.set(9)
    )
    .Range.setSimple(0, 30)
    .Effects.addMod(x=>x
        .Type.APPLY_AURA.set()
        .Aura.PERIODIC_DAMAGE.set()
        .DamagePeriod.set(3000)
        .DamageBase.set(10)
        .DamageDieSides.set(1)
        .DamagePerLevel.set(0)
        .DamagePerCombo.set(0)
        .BonusMultiplier.set(0.06239999830722809)
        .ImplicitTargetA.UNIT_TARGET_ENEMY.set()
    )
    
export const CORRUPTION = createAbility(SPELL.ID)