'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Especialidades extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Especialidades.hasMany(models.Usuarios, {
        foreignKey: 'idEspecialidad'
      });
      Especialidades.hasMany(models.Protocolos, {
        foreignKey: 'idEspecialidad'
      });
    }
  }
  Especialidades.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Especialidades',
  });
  return Especialidades;
};