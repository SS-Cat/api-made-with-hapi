const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = 'Vensauro@45ponto2.9dot'
const HASH = '$2b$04$Fyj3cnOpG/OIax6nR0GntesXOC4EmeietUJTuNECa5CG0CesMoj6W'

describe.only('UserHelper test suite', () => {
	test('deve gerar uma hash a partir de uma senha', async () => {
		const result = await PasswordHelper.hashPassword(SENHA)
		expect(result.length).toBeGreaterThan(10)
	})

	test('deve comparar uma senha e seu hash', async () => {
		const result = await PasswordHelper.comparePassword(SENHA, HASH)
		expect(result).toBeTruthy()
	})
})