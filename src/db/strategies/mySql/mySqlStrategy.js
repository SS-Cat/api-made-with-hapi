const InterfaceDb = require('./../base/interfaceDb')
const Sequelize = require('sequelize')

class MySqlStrategy extends InterfaceDb {
	constructor(connection, schema){
		super()
		this._db = schema
		this._connection = connection
	}

	static async defineModel(connection, schema){
		const model = connection.define(schema.name, schema.schema, schema.options)
		await model.sync()
		return model
	}

	static async connect(){
		return new Sequelize(process.env.MYSQL_URL,
			// 'pokehapi', 'root', 'root', 
		{
			host: 'localhost',
			dialect: 'mysql',
			quoteIdentifiers: false,
			operatorsAliases: false,
			logging: false,
			ssl: process.env.SSL_DB,
			dialectOptions: {
				ssl: process.env.SSL_DB
			}
		})
	}

	async isConnected(id){
		try{
			await this._connection.authenticate()
			return true
		}catch(err){
			console.error('fail!', error)
			return false
		}
	}
	create(item){
		return this._db.create(item, {
			raw: true
		})
	}
	read(item){
		return this._db.findAll({
			where: item,
			raw: true
		})
	}
	update(id, item, upsert = false){

		const fn = upsert ? 'upsert' : 'update'

		return this._db[fn](item, {
			where: {
				id
			}
		})
	}
	delete(id){
		const query = id ? { id } : {}
		return this._db.destroy({ where: query })
	}
}

module.exports = MySqlStrategy