const MongoDbStrategy = require('../src/db/strategies/mongoDb/mongoDbStrategy')
const MongoDbSchema = require('../src/db/strategies/mongoDb/schemas/pokeSchema')
const Context = require('../src/db/strategies/base/contextStrategy.js')

let context
let Id
const PokeCreate = {
	nome: 'Torchic',
	tipo: 'Fogo'
}

const PokeUpdate = {
	nome: 'pokabu'
}

beforeAll(async () => {
	const connection = MongoDbStrategy.connect()
	context = new Context(new MongoDbStrategy(connection, MongoDbSchema))
	const [{_id}] = await context.read(PokeCreate)
	Id = _id
})

test('MongoDb is Connected',async () => {
	const result = await context.isConnected()
	expect(result).toBe('Conectado')
})

test('Cadastrar', async () => {
	const { nome, tipo } = await context.create(PokeCreate)
	expect({ nome, tipo }).toEqual(PokeCreate)
})

test('Ler', async () => {
	const [{ nome, tipo }] = await context.read(PokeCreate)
	expect({ nome, tipo }).toEqual(PokeCreate)
})

test('Atualizar', async () => {
	const result = await context.update(Id, {nome: 'Charizard'})
	expect(result).toEqual({"n": 1, "nModified": 1, "ok": 1})
})

test('Remove', async () => {
	const result = await context.delete(Id)
	expect(result).toEqual({"deletedCount": 1, "n": 1, "ok": 1})
})

