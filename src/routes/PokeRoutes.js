const methodsList = require('./base/methodsList')
const Joi = require('joi')
const Boom = require('boom')

const failAction = (request, h, err) => {
	throw err
}

const headers = Joi.object({
	authorization: Joi.string().required()
}).unknown()

class PokeRoute {
	constructor(db) {
		this.db = db
	}

	
	listar() {
		return {
			path: '/pokemons',
			method: 'GET',
			config: {
				tags: ['api'],
				description: 'Deve Listar Pokemons',
				notes: 'pode paginar resultados e filtrar por nome',
				validate: {
					failAction,
					headers,
					query: {
						nome: Joi.string().min(3).max(100),
						limit: Joi.number().integer().default(10)
					}
				}
			},
			handler: (request, h) => {
				try {
					const { nome, limit } = request.query
					let query = nome ? { nome : {$regex: `.*${nome}*.`} } : {}
					return this.db.read(query, limit)
				} catch(err) {
					console.error('Error in: listar route', err)
					return Boom.internal()
				}
			}
		}
	}

	create(){
		return {
			path: `/pokemons`,
			method: `POST`,
			config: {
				tags: ['api'],
				description: 'Deve Cadastrar Pokemons',
				notes: 'É necessario nome e tipo',
				validate: {
					failAction,
					headers,
					payload: {
						nome: Joi.string().min(3).max(50).required(),
						tipo: Joi.string().min(3).max(10).required()
					}
				}
			},
			handler: async (request, h) => {
				try {
					const { nome, tipo } = request.payload
					const result = await this.db.create({ nome, tipo })
					return {
						result,
						mensagem: 'Sucesso'
					}
				} catch(err) {
					console.error('Error in: create route', err)
					return Boom.internal()
				}
			}
		}
	}

	update(){
		return {
			path: '/pokemons/{id}',
			method: 'PATCH',
			config: {
				tags: ['api'],
				description: 'Deve Atualizar Pokemons',
				notes: 'É requerido id',
				validate: {
					failAction,
					headers,
					params: {
						id: Joi.string().required()
					},
					payload: {
						nome: Joi.string().min(3).max(50),
						tipo: Joi.string().min(3).max(10)
					}
				}
			},
			handler: async (request, h) => {
				try {
					const { params: { id }, payload } = request
					const dados = JSON.parse(JSON.stringify(payload))

					const result = await this.db.update(id, dados)

					if(result.nModified	!== 1) return Boom.preconditionFailed('Id não encontrado')

					return {
						result,
						mensagem: 'Sucesso'
					}
				} catch(err) {
					console.error('Error in: create route', err)
					return Boom.internal()
				}
			}
		}
	}

	delete(){
		return {
			path: '/pokemons/{id}',
			method: 'DELETE',
			config: {
				tags: ['api'],
				description: 'Deve Deletar Pokemons',
				notes: 'É requerido id',
				validate: {
					failAction,
					headers,
					params: {
						id: Joi.string().required()
					}
				}
			},
			handler: async (request, h) => {
				try {
					const { id } = request.params

					const result = await this.db.delete(id)

					if(result.n	!== 1) return Boom.preconditionFailed('Id não encontrado')

					return {
						result,
						mensagem: 'Sucesso'
					}
				} catch(err) {
					console.error('Error in: create route', err)
					return Boom.internal()
				}
			}
		}
	}
	
}

PokeRoute.methods = methodsList.bind(PokeRoute)

module.exports = PokeRoute