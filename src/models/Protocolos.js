'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Protocolos extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Protocolos.belongsTo(models.Areas, {
                foreignKey: 'id',
                target_key: 'idArea'
            });
            Protocolos.belongsTo(models.Especialidades, {
                foreignKey: 'id',
                target_key: 'idEspecialidad'
            });
            Protocolos.belongsTo(models.Usuarios, {
                foreignKey: 'id',
                target_key: 'creadoPor'
            });
        }
    }
    Protocolos.init({
        nombre: DataTypes.STRING,
        idEspecialidad: DataTypes.INTEGER,
        idArea: DataTypes.INTEGER,
        creadoPor: DataTypes.INTEGER,
        url: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Protocolos',
    });
    return Protocolos;
};