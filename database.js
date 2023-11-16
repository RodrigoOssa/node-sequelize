/* 
La idea de esta prueba es crear una base de datos, poder guardar datos y poder acceder a ellos.
Primero se debe instalar un ORM (Object Relational Mapping) que es una libreria que encapsula valores y comandos SQL orientado a objetos.
En este caso se utilizará "sequelize"
npm install sequelize

Además se necesita que esté instalado un sistema de gestión de base de datos como lo es SQL. (SGBDR). Se suele utilizar SQLite pero mas que nada para entornos de prueba ya que para entornos de producción se recomiendan sistemas mas robustos como POSTGRES.
npm install sqlite

*/
const { Sequelize, Model, DataTypes } = require('sequelize');

const options = { logging: false };
const sequelize = new Sequelize("sqlite:db.sqlite", options);

class User extends Model { }
User.init({
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
    },
    dni: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: 'User'
});

//Se puede usar dos maneras para crear el modelo (la tabla). Una es para crear un modelo en particular utilizando NOMBREMODELO.sync() o para crear todos los modelos a la vez se usa sequelize.sync().

User.sync();

//Agregar datos a la base de datos (insertar una sola fila)
const agregar = async () => {
    const persona1 = await User.create({ nombre: "Daiana", apellido: "Monaco", dni: 23232334 });
    console.log("Persona 1 agregada", persona1.nombre);
    console.log(persona1)
}
//agregar();

//Agregar datos en masa a la base de datos (Insertar varias filas)
const agregarMuchos = async () => {
    const muchos = await User.bulkCreate([
        { nombre: "Alberto", apellido: "Del Valle", dni: 23232334 },
        { nombre: "Micaela", apellido: "Mentrosa", dni: 23444568 },
        { nombre: "Pedro", apellido: "Escamoso", dni: 33754211 }
    ])
    console.log(muchos)
}
//agregarMuchos()

//Acceder a los datos de la DB ( se usa el findAll para tomar todos los valores, pero se puede filtrar)
const datos = async () => await User.findAll();

const mostrar = (async () => {
    console.log("Peticion mandada")
    const db = await datos();
    for await (let users of db) {
        console.log(users.nombre)
    }
})();

let usuario = async () => {
    let algo = await User.build({ nombre: "Juan instancia", apellido: "Instanciado", dni: 12345567 })
    algo.save()
}
//usuario();
(async () => {
    console.log("Devuelve el primer objeto que encuentra: ", await User.findOne());
    console.log("Devuelve el objeto con la clave primaria: ", await User.findByPk(3));
    console.log("Devuelve el numero de obj en una tabla: ", await User.count())
})()
