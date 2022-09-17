'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        //CREAR ESPECIALIDAD
        await queryInterface.bulkInsert('Areas', [{
            id: 1,
            nombre: "Todas",
            ubicacion: "Todas",
            imagen: 'https://cdn.euroinnova.edu.es/img/subidasEditor/istock_000024206907_xxxlarge-1610545662.webp',
            createdAt: '2022-09-17 16:39',
            updatedAt:'2022-09-17 16:39'
        }], {});

        //CREAR AREA
        await queryInterface.bulkInsert('Especialidades', [{
            id: 1,
            nombre: "Todas",
            createdAt: '2022-09-17 16:39',
            updatedAt:'2022-09-17 16:39'
        }], {});

        //CREAR USUARIO
        await queryInterface.bulkInsert('Usuarios', [{
            id: 1,
            nombres: 'Helmer',
            apellidos: 'Villarreal',
            tipoDoc: 'CC',
            documento: '105163530',
            correo: 'helmervillarreal@gmail.com',
            fechaNacimiento: '1990-08-06 00:00:00',
            celular: '3013555186',
            clave: '$2b$10$cu8ewRjBzMEgECHMYZtn0eR3.wo.bE27aCFQ/VKvNyJ9ZH1VCLnh6',
            perfil: 'admin',
            estado: 1,
            idArea: 1,
            idEspecialidad: 1,
            foto: 'http://localhost:4000/public/imagenes/0.g695g9o8ogj.png',
            createdAt: '2022-09-17 16:39',
            updatedAt:'2022-09-17 16:39'
        }], {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
