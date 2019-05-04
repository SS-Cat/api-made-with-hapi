const methodsList = require('./base/methodsList')
const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')

const PasswordHelper = require('./../../helpers/passwordHelper')

const Context = require('./../db/strategies/base/contextStrategy')
const MySql = require('./../db/strategies/mySql/mySqlStrategy')
const UserSchema = require('./../db/strategies/mySql/schemas/usuarioSchema')

const failAction = (request, h, err) => {
	throw err
}
const USER = {
	username: 'Bellosom',
	password: '543'
}

const JWT_TOKEN = { 
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbGxvc29tIiwiaWQiOjEsImlhdCI6MTU1Mzc4NTc1Nn0.aIwDXbk6g4Ptb5OstStxujY_x03gqOsC-E0lbziteKQ' 
}

class AuthRoutes {
	constructor(db, secret) {
		this.db = db
		this.secret = secret
	}

	login() {
		return {
			path: '/login',
			method: 'POST',
			config: {
				auth: false,
				tags: ['api'],
				description: 'Obter Dados Token',
				notes: 'faz login com user e senha no banco',
				validate: {
					failAction,
					payload: {
						username: Joi.string().required(),
						password: Joi.string().min(3).required()
					}
				}
			},
			handler: async (request, h) => {
				try {
					const { username, password } = request.payload

					const [usuario] = await await this.db.read({ username })
					if(!usuario) return Boom.unauthorized('O usuario ou senha invalidos!!')
					const match = await PasswordHelper.comparePassword(password, usuario.password)

					if(!match) return Boom.unauthorized('O usuario ou senha invalidos!!')
	
					// if(username !== USER.username || password !== USER.password)
						// return Boom.unauthorized()
	
					const token = Jwt.sign({
						username,
						id: usuario.id
					}, this.secret)
	
					return {
						token
					}
				} catch(err) {
					console.error('Error in: login route', err)
					return Boom.internal()
				}
			}
		}
	}

}

AuthRoutes.methods = methodsList.bind(AuthRoutes)

module.exports = AuthRoutes