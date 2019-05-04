const Sequelize = require('sequelize')
module.exports = {
	name: 'pokemon',
	schema: {
		id: {
			type: Sequelize.INTEGER,
			required: true,
			primaryKey: true,
			autoIncrement: true,
		},
		nome: {
			type: Sequelize.STRING,
			required: true,
		},
		tipo: {
			type: Sequelize.STRING,
			required: true,
		},
	},
	options: {
		//opcoes para base existente
		tableName: 'pokemon',
		freezeTableName: false,
		timestamps: false,
	}
}