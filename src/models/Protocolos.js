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
            Protocolos.belongsTo(models.Especialidades, {
                as: 'Especialidad',
                foreignKey: 'idEspecialidad',
                target_key: 'id'
            });
            Protocolos.belongsTo(models.Usuarios, {
                foreignKey: 'creadoPor',
                target_key: 'id'
            });

            Protocolos.belongsTo(models.Areas, {
                foreignKey: 'idArea',
                target_key: 'id'
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