const Mongoose = require('mongoose')
const PokeSchema = new Mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	tipo: {
		type: String,
		required: true	
	},
	insertedAt: {
		type: Date,
		default: new Date()
	}
})

module.exports = Mongoose.models.herois || Mongoose.model('pokemon', PokeSchema)