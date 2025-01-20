@CharactersTable
export class Spellbook extends DBArrayEntry {
    constructor(player: TSGUID, ability: uint32) {
        super()
        this.player = player
        this.ability = ability
    }

    @DBPrimaryKey
    player: TSGUID = CreateGUID(0, 0)

    @DBField
    ability: uint32 = 0

    @DBField
    active: uint8 = 0

    static get(player: TSPlayer): DBContainer<Spellbook> {
        return player.GetObject('Spellbook', LoadDBArrayEntry(Spellbook, player.GetGUID()))
    }

    static Save(player: TSPlayer) {
        Spellbook.get(player).Save();
    }

    static Delete(guid: uint64) {
        QueryCharacters(`DELETE FROM spellbook WHERE player=${guid}`);
    }

    static Learn(player: TSPlayer, ability: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.ability == ability)

        if (!query) {
            entry.Add(new Spellbook(player.GetGUID(), ability))
            entry.Save()
        } else {
            return
        }
    }

    static HasAbility(player: TSPlayer, ability: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.ability == ability)

        if (query) {
            return true
        } else {
            return false
        }
    }

    static ActivateAbility(player: TSPlayer, ability: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.ability == ability)

        if (query) {
            query.active = 1
            query.MarkDirty()
            entry.Save()
        } else {
            return
        }
    }

    static DeactivateAbility(player: TSPlayer, ability: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.ability == ability)

        if (query) {
            query.active = 0
            query.MarkDirty()
            entry.Save()
        } else {
            return
        }
    }

    static IsActive(player: TSPlayer, ability: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.ability == ability)

        return query.active
    }

    static GetActiveCount(player: TSPlayer) {
        let entry = Spellbook.get(player)

        let query = entry.ToArray().filter(x => x.player == player.GetGUID() && x.active == 1)

        return query.length
    }
}