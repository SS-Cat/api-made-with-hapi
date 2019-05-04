	const api = require('../api')



describe('Suite de testes da API de Pokemon', () => {
	let app;
	let MOCK_UP_ID;

	const headers = {
		authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbGxvc29tIiwiaWQiOjEsImlhdCI6MTU1Mzc4ODAwN30.GA01nI_TLPBLddLssRuGdJV-v49kqZhjI4IN0wINCDI"
	}
	const MOCK_POKEMON_CADASTRAR = {
		nome: `Torchic`,
		tipo: `Fogo`
	}
	const MOCK_POKEMON_INICIAL = {
		nome: 'Torterra',
		tipo: 'Planta'
	}

	beforeAll(async () => {
		app = await api
		const result = await app.inject({
			method: 'POST',
			headers,
			url: '/pokemons',
			payload: JSON.stringify(MOCK_POKEMON_INICIAL)
		})
		MOCK_UP_ID = JSON.parse(result.payload).result._id
	})

	afterAll(() => {
		app.stop()
	})

	test('listar /pokemons', async () => {
		const result = await app.inject({
			method: 'GET',
			headers,
			url: '/pokemons'
		})

		const dados = JSON.parse(result.payload)
		const statusCode = result.statusCode

		expect(statusCode).toBe(200)
		expect(dados).toBeInstanceOf(Array)
	})

	test('listar /pokemons - deve retornar somente 10 registros', async () => {
		const result = await app.inject({
			method: 'GET',
			headers,
			url: '/pokemons?limit=10'
		})

		const dados = JSON.parse(result.payload)
		const statusCode = result.statusCode

		expect(statusCode).toEqual(200)
		expect(dados).toBeInstanceOf(Array)
		expect(dados.length).toBe(10)
	})

	test('listar /pokemons - deve filtrar pelo nome', async () => {
		const result = await app.inject({
			method: 'GET',
			headers,
			url: '/pokemons?nome=torchic'
		})

		const dados = JSON.parse(result.payload)
		const statusCode = result.statusCode
		/* TODO */
	})

	test('cadastrar /pokemons - deve retornar "Sucesso" ao cadastrar pokemon', async () => {
		const result = await app.inject({
			method: 'POST',
			headers,
			url: '/pokemons',
			payload: JSON.stringify(MOCK_POKEMON_CADASTRAR)
		})

		const dados = JSON.parse(result.payload)
		expect(result.statusCode).toBe(200)
		expect(dados.mensagem).toBe(`Sucesso`)
	})

	test('cadastrar /pokemons - deve retornar o objeto cadastrado ao cadastrar pokemon', async () => {
		const result = await app.inject({
			method: 'POST',
			headers,
			url: '/pokemons',
			payload: JSON.stringify(MOCK_POKEMON_CADASTRAR)
		})

		const { result: { nome, tipo } } = JSON.parse(result.payload)
		expect({ nome, tipo }).toEqual(MOCK_POKEMON_CADASTRAR)
	})

	test('atualizar PATCH - /pokemons/:id', async () => {
		const updateItem = {
			nome: 'Charizard'
		}
		const result = await app.inject({
			method: 'PATCH',
			headers,
			url: `/pokemons/${MOCK_UP_ID}`,
			payload: JSON.stringify(updateItem)
		})

		const dados = JSON.parse(result.payload)

		expect(result.statusCode).toBe(200)
		expect(dados.mensagem).toBe('Sucesso')
	})

	test('deletar DELETE - /pokemons/:id', async () => {
		const updateItem = {
			nome: 'Charizard'
		}
		const result = await app.inject({
			method: 'DELETE',
			headers,
			url: `/pokemons/${MOCK_UP_ID}`,
			payload: JSON.stringify(updateItem)
		})

		const dados = JSON.parse(result.payload)

		expect(result.statusCode).toBe(200)
		expect(dados.mensagem).toBe('Sucesso')
	})

})