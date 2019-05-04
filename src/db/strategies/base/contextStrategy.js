const InterfaceDb = require('./interfaceDb')

class ContextStrategy extends InterfaceDb {
	constructor(dataBase){
		super()
		this._dataBase = dataBase
	}
	create(item){
		return this._dataBase.create(item)
	}
	read(item, limit){
		return this._dataBase.read(item, limit)
	}
	update(id, item, upsert = false){
		return this._dataBase.update(id, item, upsert)
	}
	delete(id){
		return this._dataBase.delete(id)
	}
	isConnected(){
		return this._dataBase.isConnected()
	}
	conect(){
		return this._dataBase.connect()
	}
}

module.exports = ContextStrategy