'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuarios_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Usuarios_log.belongsTo(models.Usuarios, {
        foreignKey: 'id',
        target_key: 'idUsuario'
        });
    }
  }
  Usuarios_log.init({
    idUsuario: DataTypes.INTEGER,
    descripcion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuarios_log',
  });
  return Usuarios_log;
};