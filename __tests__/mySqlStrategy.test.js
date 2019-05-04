const MySqlStrategy = require('./../src/db/strategies/mySql/mySqlStrategy')
const MySqlScheme = require('./../src/db/strategies/mySql/schemas/pokeSchema')
const Context = require('./../src/db/strategies/base/contextStrategy')

let context

const PokeCadastra = {
	nome: 'Bulbasaur',
	tipo: 'Planta'
}

beforeAll(async () => {
	const connection = await MySqlStrategy.connect()
	const model = await MySqlStrategy.defineModel(connection, MySqlScheme)
	context = new Context(new MySqlStrategy(connection, model))

	const result = await context.delete()
})


test('MySql Connect', async () => {
	const result = await MySqlStrategy.connect()
	expect(result).toHaveProperty('connectionManager.config.database', 'pokehapi')
})

test('MySql is Connected', async () => {
	const result = await context.isConnected()
	expect(result).toBeTruthy()
})

test('MySql Create', async () => {
	const {nome , tipo} = await context.create(PokeCadastra)
	expect({nome, tipo}).toEqual(PokeCadastra)
})

test('MySql Read', async () => {
	const [{nome , tipo}] = await context.read(PokeCadastra)
	expect({nome , tipo}).toEqual(PokeCadastra)
})

describe('MySql Update', () => {
	test('MySql Update result 1 sucess', async () => {
		const [result] = await context.read({})
		const newItem = {
			...result,
			nome: 'chikorita'
		}
		const [updateResult] = await context.update(result.id, newItem)
		expect(updateResult).toBe(1)
	})
	test('MySql Update Search for updatated item', async () => {
		const [result] = await context.read({})
		const newItem = {
			...result,
			nome: 'chikorita'
		}
		await context.update(result.id, newItem)
		const [updated] = await context.read({id: result.id})
	
		expect(updated).toEqual(newItem)
	})
})

test('MySql Remove', async () => {
	const [item] = await context.read({})
	const result = await context.delete(item.id)
	expect(result).toBe(1)
})