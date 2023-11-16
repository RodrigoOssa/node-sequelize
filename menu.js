const optionsMenu = require('./optionsMenu.json');
const rl = require('./readLine');
const model = require('./model');
const myAppEmitter = require('./emitter');

class Options {

    constructor() {
        this.optionsMenu = optionsMenu;
        this.selectedOption = false;
    }

    setSelectedOption(param) {
        this.selectedOption = param;
    }
    selectOption(input) {
        switch (input) {
            case "add":
                this.addUser();
                break;
            case "showOptions":
                this.showOptions();
                break;
            case "showAll":
                this.showUsers();
                break;
            case "findName":
                this.findByName();
                break;
            case "findSurname":
                this.findBySurname();
                break;
            case "findAge":
                this.findByAge();
                break;
            case "ageRange":
                this.findByAgeRange();
                break;
            case "modifyID":
                this.modifyByID();
                break;
            case "delete":
                this.deleteUser();
                break;
            case "test":
                this.test();
                break;
            default:
                console.log("Comando no valido.")
        }
    }

    showOptions() {
        console.log();
        console.log("Las opciones disponibles son:");
        this.optionsMenu.map(option => {
            console.log(`${option.nombre}           ${option.text}`)
        })
        console.log();
    }

    addUser() {
        this.setSelectedOption(true);
        setTimeout(() => {
            let cont = 3;
            let tempUser = {};
            console.log("Ingrese el nombre: ");
            rl.on('line', input => {
                if (cont === 3) {
                    tempUser.name = input;
                    console.log("Ingrese el Apellido: ");
                    cont--;
                }
                else if (cont === 2) {
                    tempUser.surname = input;
                    console.log("Ingrese la Edad: ");
                    cont--;
                }
                else if (cont === 1) {
                    if (!isNaN(+input)) { //<---- No dejar así
                        tempUser.age = parseInt(input, 10);
                        console.log("Ingrese el DNI: ");
                        cont--;
                    } else {
                        throw ("El dato ingresado no es un numero")
                    }
                }
                else if (cont === 0) {
                    if (!isNaN(+input)) { //<---- No dejar así
                        tempUser.dni = parseInt(input, 10);
                        cont = 4;
                        console.log(tempUser);
                        console.log("Es correcto? (SI / NO)")
                    } else {
                        throw ("El dato ingresado no es un numero")
                    }
                } else if (cont === 4) {
                    if (input.toLocaleLowerCase() === "si") {
                        model.addUser(tempUser)
                            .then(msg => console.log(msg.msg))
                            .then(() => this.setSelectedOption(false))
                            .then(() => this.showOptions())
                            .then(() => cont = 5)
                            .catch(err => {
                                console.log(err.err)
                                console.log("Se ha producido un error.")
                                console.log("Ingrese nombre nuevamente: ")
                                cont = 3;
                            })
                    } else {
                        cont = 3;
                        console.log("Ingrese nombre nuevamente: ")
                    }
                }
            });
        }, 1000);
    }
    deleteUser() {
        let allow = true;
        console.log("Ingrese el ID del usuario que desea borrar: ");
        this.setSelectedOption(true);
        rl.on("line", (input) => {
            if (allow) {
                model.deleteByID(parseInt(input, 10))
                    .then(() => console.log("Usuario eliminado con éxito"))
                    .then(() => allow = false)
                    .then(() => this.setSelectedOption(false))
                    .catch(err => console.log(err))
            }
        });
    }
    showUsers() {
        console.log("Mostrando lista de los usuarios...");
        const listUsers = (usrs) => {
            let arrayOfUsers = [];
            usrs.map((u) => {
                let temp = {};
                let { id, name, surname, age, dni } = u;
                temp = {
                    id,
                    name,
                    surname,
                    age,
                    dni
                }
                arrayOfUsers.push(temp);
            })
            console.table(arrayOfUsers)
        }
        model.showAll()
            .then(allUsers => listUsers(allUsers))
            .catch(err => console.log(err))
    }
    findByName() {
        let allow = true;
        console.log("Ingrese el nombre que desea buscar: ");
        this.setSelectedOption(true);
        rl.on("line", (input) => {
            if (allow) {
                let arrayOfUsers = [];
                let temp = {};
                model.showBy("name", input)
                    .then(data => {
                        console.log("Coincidencias: ", data.length);
                        data.map(usr => {
                            let { id, name, surname, age, dni } = usr;
                            temp = {
                                id,
                                name,
                                surname,
                                age,
                                dni
                            }
                            arrayOfUsers.push(temp)
                        })
                        console.log(arrayOfUsers)
                    })
                    .then(() => allow = false)
                    .then(() => this.setSelectedOption(false))
                    .catch((err) => console.log(err))
            }
        });
    }
    findBySurname() {
        let allow = true;
        console.log("Ingrese el apellido que desea buscar: ");
        this.setSelectedOption(true);
        rl.on("line", (input) => {
            if (allow) {
                let arrayOfUsers = [];
                let temp = {};
                model.showBy("surename", input)
                    .then(data => {
                        console.log("Coincidencias: ", data.length);
                        data.map(usr => {
                            let { id, name, surname, age, dni } = usr;
                            temp = {
                                id,
                                name,
                                surname,
                                age,
                                dni
                            }
                            arrayOfUsers.push(temp)
                        })
                        console.log(arrayOfUsers)
                    })
                    .then(() => allow = false)
                    .then(() => this.setSelectedOption(false))
                    .catch((err) => console.log(err))
            }
        });
    }
    findByAgeRange() {
        let count = 2;
        console.log("Ingrese la edad mínima a buscar: ");
        this.setSelectedOption(true);
        let range = {};
        rl.on("line", (input) => {
            if (count === 2) {
                range.min = parseInt(input, 10);
                console.log("Ingrese la edad máxima a buscar: ");
                count--;
            } else if (count === 1) {
                range.max = parseInt(input, 10);
                count--;
                let arrayOfUsers = [];
                let temp = {};
                model.showByAgeRange(range.min, range.max)
                    .then(data => {
                        console.log();
                        console.log("Coincidencias: ", data.length);
                        data.map(usr => {
                            let { id, name, surname, age, dni } = usr;
                            temp = {
                                id,
                                name,
                                surname,
                                age,
                                dni
                            }
                            arrayOfUsers.push(temp)
                        })
                        console.log(arrayOfUsers)
                    })
                    .then(() => count = 0)
                    .then(() => this.setSelectedOption(false))
                    .catch((err) => console.log(err))
            }
        });
    }
    findByAge() {
        let allow = true;
        console.log("Ingrese la edad que desea buscar: ");
        this.setSelectedOption(true);
        rl.on("line", (input) => {
            if (allow) {
                let arrayOfUsers = [];
                let temp = {};
                model.showBy("age", parseInt(input, 10))
                    .then(data => {
                        console.log("Coincidencias: ", data.length);
                        data.map(usr => {
                            let { id, name, surname, age, dni } = usr;
                            temp = {
                                id,
                                name,
                                surname,
                                age,
                                dni
                            }
                            arrayOfUsers.push(temp)
                        })
                        console.log(arrayOfUsers)
                    })
                    .then(() => allow = false)
                    .then(() => this.setSelectedOption(false))
                    .catch((err) => console.log(err))
            }
        });
    }
    modifyByID() {
        let count = 3;
        let option, id, dato = "";
        console.log("Ingrese el ID que desea modificar: ")
        this.setSelectedOption(true);
        rl.on("line", (input) => {
            if (count === 3) {
                id = parseInt(input, 10);
                console.log("Escriba el dato que desea modificar: ");
                console.log("([nombre], [apellido], [edad], [dni])");
                count--;
            } else if (count === 2) {
                option = input;
                switch (option) {
                    case "nombre":
                        console.log("Ingrese el nuevo Nombre: ");
                        option = "name";
                        count--;
                        break;
                    case "apellido":
                        console.log("Ingrese el nuevo Apellido: ");
                        option = "surname";
                        count--;
                        break;
                    case "edad":
                        console.log("Ingrese la nueva Edad: ");
                        option = "age";
                        count--;
                        break;
                    case "dni":
                        console.log("Ingrese el nuevo DNI: ");
                        option = "dni";
                        count--;
                        break;
                    default:
                        console.log("No ha ingresado un valor válido, intente de nuevo: ");
                        break;

                }
            } else if (count === 1) {
                count--;
                dato = input;
                let obj = {};
                obj[option] = dato;
                console.log("Datos a modificar: ", obj)
                model.modifyByID(id, obj)
                    .then(() => console.log(`Elemento con ID ${id} modificado con éxito!`))
                    .then(() => model.showBy("id", id)
                        .then((usr) => {
                            usr.map((dato) => {
                                console.log(`id:${dato.id} name:${dato.name} surname:${dato.surname} age:${dato.age} dni:${dato.dni}`)
                            })
                        }))
                    .then(() => this.setSelectedOption(false))
                    .catch((err) => console.log(err))
            }
        });
    }
    test() {
        this.setSelectedOption(true);
        setTimeout(() => {
            this.setSelectedOption(false);
            //console.log(this.selectedOption)
            myAppEmitter.emit('menu');
        }, 500)
    }
}

module.exports = Options;
//const menu = new Options();
//menu.showOptions();
//menu.addUser();
//menu.showUsers();
