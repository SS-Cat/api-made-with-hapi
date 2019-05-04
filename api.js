const env = process.env.NODE_ENV || 'dev'
require('assert').ok(
  env === 'prod' || env === 'dev',
  'env invalida, ou prod ou dev'
)
require('dotenv').config({
  path: require('path').resolve(__dirname, 'config', `.env.${env}`)
})

const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const HapiJwt = require('hapi-auth-jwt2')

const Context = require('./src/db/strategies/base/contextStrategy.js')

const MongoDb = require('./src/db/strategies/mongoDb/mongoDbStrategy.js')
const MongoDbSchema = require('./src/db/strategies/mongoDb/schemas/pokeSchema.js')

const MySql = require('./src/db/strategies/mySql/mySqlStrategy')
const UserSchema = require('./src/db/strategies/mySql/schemas/usuarioSchema')

const PokeRoutes = require('./src/routes/PokeRoutes')
const AuthRoutes = require('./src/routes/AuthRoutes')

const JWT_SECRET = process.env.JWT_KEY

function mapRoutes (instance, methods) {
  return methods.map(method => instance[method]())
}

async function main () {
  const connection = MongoDb.connect()
  const contextMongoDB = new Context(new MongoDb(connection, MongoDbSchema))

  const connectionMySql = await MySql.connect()
  const UserSchemaMySql = await MySql.defineModel(connectionMySql, UserSchema)
  const contextMySql = new Context(new MySql(connectionMySql, UserSchemaMySql))

  const app = Hapi.Server({ port: process.env.PORT || 5000 })

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: {
        info: {
          title: 'API Pokemons - MysteryMew',
          version: 'v0.1'
        },
        lang: 'pt'
      }
    }
  ])

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    options: {
      // expiresIn: 24 * 60 * 60 * 1000
    },
    validate: (dado, request) => {
      return { isValid: true }
    }
  })
  app.auth.default('jwt')

  app.route([
    ...mapRoutes(new PokeRoutes(contextMongoDB), PokeRoutes.methods()),
    ...mapRoutes(new AuthRoutes(contextMySql, JWT_SECRET), AuthRoutes.methods())
  ])

  await app.start()
  console.log(`Server running at ${app.info.uri}`)

  return app
}

module.exports = main()
