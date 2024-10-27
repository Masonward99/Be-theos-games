import { checkExists } from "../utils";

describe(`check exists`, () => {
    it('returns a rejected promise if the item doesnt exist in the db', () => {
        return expect( checkExists('games', 'game_id', [19])).rejects.toEqual({status: 404, msg:'Resource not found'})
    })
    it('resolves to an undefined promise if value does exist', () => {
        return expect(checkExists('games', 'game_id', [1])).resolves.toBe(undefined)
    })
})