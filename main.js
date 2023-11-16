const rl = require('./readLine');
const menu = require('./menu');
const myAppEmitter = require('./emitter')

const appMenu = new menu();

appMenu.showOptions();
rl.on('line', input => {
    if (!appMenu.selectedOption) {
        appMenu.selectOption(input);
    }
})

//Borrar luego
myAppEmitter.on('menu', () => {
    rl.resume();
    appMenu.showOptions();
})
