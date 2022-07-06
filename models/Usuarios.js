'use strict';
const { Model } = require('sequelize');
const { Constants } = require("../constants/Constants");
module.exports = (sequelize, DataTypes) => {
    class Usuarios extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Usuarios.belongsTo(models.Areas, {
                foreignKey: 'id',
                target_key: 'idArea'
            });
            Usuarios.belongsTo(models.Especialidades, {
                foreignKey: 'id',
                target_key: 'idEspecialidad'
            });

            Usuarios.hasMany(models.Usuarios_log, {
                foreignKey: 'idUsuario'
            });

            Usuarios.hasMany(models.Protocolos, {
                foreignKey: 'creadoPor'
            });
        }
    }
    Usuarios.init({
        nombres: DataTypes.STRING,
        apellidos: DataTypes.STRING,
        tipoDoc: DataTypes.STRING,
        documento: DataTypes.STRING,
        correo: DataTypes.STRING,
        fechaNacimiento: DataTypes.DATE,
        celular: DataTypes.STRING,
        clave: DataTypes.STRING,
        perfil: DataTypes.STRING,
        estado: DataTypes.INTEGER,
        idArea: DataTypes.INTEGER,
        idEspecialidad: DataTypes.INTEGER,
        foto: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Usuarios',
    });

    // //metodo para guardar automaticamente los archivos
    // Usuarios.prototype.setFotoUrl = function setFotoUrl(filename) {
    //     this.foto = `${Constants.APP_HOST}:${Constants.APP_PORT}/public/images/${filename}`;
    // };
    return Usuarios;
};