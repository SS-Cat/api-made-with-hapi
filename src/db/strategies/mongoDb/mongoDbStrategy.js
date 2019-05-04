const InterfaceDb = require('./../base/interfaceDb')
const Mongoose = require('mongoose')
const STATUS = {
	0: 'Disconectado',
	1: 'Conectado',
	2: 'Conectando',
	3: 'Disconectando',
	4: 'Invalid Credentials'
}

class MongoDB extends InterfaceDb{
	constructor(connection, model){
		super()
		this._connetion = connection
		this._collection = model
		this._state = STATUS[0]
	}

	async isConnected(){
		const state = STATUS[this._connetion.readyState]
		if( state === 'Conectado') return state
		if( state !== 'Conectando') return state
		await new Promise(resolve => setTimeout(resolve, 3000))
		return STATUS[this._connetion.readyState]
	}

	static connect(){
		Mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true}).then(
			() => {
				// console.info(`MongoDB Connection State: ${STATUS[Mongoose.connection.readyState]}`)
				this._state = STATUS[Mongoose.connection.readyState]
			},
			// err => console.err('Falha na conexão com mongoDb', err)
		)
		return Mongoose.connection
		// connection.once('open',() => console.log('database Rodando'))
		// return connection
	}

	async create(item){
		return this._collection.create(item)
	}

	async read(item = {}, limit = 10) {
		return this._collection.find(item).limit(limit)
	}

    async update(id, item) {
        return this._collection.updateOne({_id: id}, { $set: item})
    }
    
    async delete(id) {
        return this._collection.deleteOne({_id: id})
    }
}

module.exports = MongoDB