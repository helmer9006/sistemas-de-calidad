"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Areas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Areas.hasMany(models.Usuarios, {
        foreignKey: "idArea",
      });
      Areas.hasMany(models.Protocolos, {
        foreignKey: "idArea",
      });
    }
  }
  Areas.init(
    {
      nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
      ubicacion: DataTypes.STRING,
      imagen: DataTypes.STRING,
      padreId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Areas",
    }
  );
  return Areas;
};
