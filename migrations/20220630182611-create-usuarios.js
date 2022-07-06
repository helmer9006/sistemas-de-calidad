'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombres: {
        type: Sequelize.STRING
      },
      apellidos: {
        type: Sequelize.STRING
      },
      tipoDoc: {
        type: Sequelize.STRING
      },
      documento: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      fechaNacimiento: {
        type: Sequelize.DATE
      },
      celular: {
        type: Sequelize.STRING
      },
      clave: {
        type: Sequelize.STRING
      },
      perfil: {
        type: Sequelize.STRING
      },
      estado: {
        type: Sequelize.INTEGER
      },
      idArea: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Areas',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      idEspecialidad: {
        type: Sequelize.INTEGER,
        references: {
            model: 'Especialidades',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
        
      },
      foto: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuarios');
  }
};