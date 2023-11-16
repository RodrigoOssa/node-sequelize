//Importo los modulos necesarios para crear la tabla, lo tipos de datos y el modulo propio de sequelize.
const { Sequelize, Model, DataTypes, Op } = require('sequelize');

//Seteo que no es necesario loguearse para acceder a la base de datos.
const options = { logging: false };
//Instancio la clase de sequelize y le digo qué DB voy a usar y paso por parametros además las opciones.
const sequelize = new Sequelize("sqlite:db.sqlite", options);

class RegisterOfUsers extends Model { }

RegisterOfUsers.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            isAlpha: {
                msg: "Solo se permite letras"
            }
        }
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            isAlpha: {
                msg: "Solo se permiten letras"
            }
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        validate: {
            isInt: {
                msg: "Solo se permiten numeros"
            }
        }
    },
    dni: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            isInt: {
                msg: "Solo se permiten numeros"
            }
        }
    }

}, { sequelize, modelName: 'RegisterOfUsers' });

const createTable = () => {
    RegisterOfUsers.sync()
        .then(() => console.log("Tabla creada con éxito"))
        .catch(err => {
            console.log("Hubo un problema para crear la tabla.");
            console.log(err);
        })
}

addUser = data => {
    console.log("Agregando usuario a la base de datos...");
    console.log();
    return new Promise((resolve, reject) => {
        RegisterOfUsers.create(data)
            .then(ok => {
                resolve({
                    msg: "Usuario creado correctamente. "
                })
            })
            .catch(error => {
                reject({
                    err: error.name
                })
            })
    })
}

showAll = async () => {
    let users = await RegisterOfUsers.findAll();
    return users;
}

showBy = async (type, parameter) => {
    let filter = {};
    if (type === "name") {
        filter = {
            name: {
                [Op.eq]: parameter
            }
        }
    }
    if (type === "surname") {
        filter = {
            surname: {
                [Op.eq]: parameter
            }
        }
    }
    if (type === "age") {
        filter = {
            age: {
                [Op.eq]: parameter
            }
        }
    }
    if (type === "dni") {
        filter = {
            surname: {
                [Op.eq]: parameter
            }
        }
    }
    if (type === "id") {
        filter = {
            id: {
                [Op.eq]: parameter
            }
        }
    }
    let users = await RegisterOfUsers.findAll({
        where: filter
    });
    return users;
}

showByAgeRange = async (min, max) => {
    let users = await RegisterOfUsers.findAll({
        where: {
            age: {
                [Op.between]: [min, max]
            }
        }
    });
    return users;
}

modifyByID = async (id, data = {}) => {
    let user = await RegisterOfUsers.update(data, {
        where: {
            id: id
        }
    })
    /* showBy("id", id)
        .then(data => console.log(data)) */
}

deleteByID = async (id) => {
    await RegisterOfUsers.destroy({
        where: {
            id: id
        }
    })
}

module.exports = { addUser, showAll, showBy, showByAgeRange, modifyByID, deleteByID }