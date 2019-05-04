const api = require('../api')
const Context = require('./../src/db/strategies/base/contextStrategy.js')
const MySql = require('./../src/db/strategies/mySql/mySqlStrategy')
const UserSchemaMySql = require('./../src/db/strategies/mySql/schemas/usuarioSchema')

describe.only('Auth test suite', () => {
	let app;
''
	const USER = {
		username: 'Bellosom',
		password: '123'
	}

	const USER_DB = {
		...USER,
		password: '$2b$04$1poyQHkZaqxmJNAN6qxOGOTxx/TD521c/a6xUwwNFMwdUb1sRzFvK'
	}

	beforeAll(async () => {
		app = await api

		const connectionMySql = await MySql.connect()
		const model = await MySql.defineModel(connectionMySql, UserSchemaMySql)
		const contextMySql = new Context(new MySql(connectionMySql, model))
		const result = await contextMySql.update(null, USER_DB, true)
	})

	afterAll(() => {
		app.stop()
	})

	test('deve obter o token', async () => {
		const result = await app.inject({
			method: 'POST',
			url: '/login',
			payload: USER
		})

		const dados = JSON.parse(result.payload)

		expect(result.statusCode).toBe(200)
		expect(dados.token.length).toBeGreaterThan(10)
	})
})