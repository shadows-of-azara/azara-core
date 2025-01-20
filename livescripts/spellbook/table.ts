@CharactersTable
export class Spellbook extends DBArrayEntry {
    constructor(player: TSGUID, spell: uint32) {
        super()
        this.player = player
        this.spell = spell
    }

    @DBPrimaryKey
    player: TSGUID = CreateGUID(0, 0)

    @DBField
    spell: uint32 = 0

    @DBField
    active: uint8 = 0

    static get(player: TSPlayer): DBContainer<Spellbook> {
        return player.GetObject('Spellbook', LoadDBArrayEntry(Spellbook, player.GetGUID()))
    }

    static Learn(player: TSPlayer, spell: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.spell == spell)

        if (!query) {
            entry.Add(new Spellbook(player.GetGUID(), spell))
            entry.Save()
        } else {
            return
        }
    }

    static HasSpell(player: TSPlayer, spell: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.spell == spell)

        return query.active
    }

    static Deactivate(player: TSPlayer, spell: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.spell == spell)

        if (query) {
            query.active = 0
            query.MarkDirty()
            entry.Save()
        } else {
            return
        }
    }

    static Activate(player: TSPlayer, spell: uint32) {
        let entry = Spellbook.get(player)

        let query = entry.find(x => x.player == player.GetGUID() && x.spell == spell)

        if (query) {
            query.active = 1
            query.MarkDirty()
            entry.Save()
        } else {
            return
        }
    }

    static ActiveCount(player: TSPlayer) {
        let entry = Spellbook.get(player)

        let query = entry.ToArray().filter(x => x.player == player.GetGUID() && x.active == 1)

        return query.length
    }
}