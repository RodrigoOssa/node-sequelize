const EventEmitter = require('events');

/* class MyAppEmitter extends EventEmitter {
    constructor() {
        super();
    }
    disparo() {
        console.log("Esto emite un disparo")
        this.emit('disparo')
    }
}; */

const myAppEmitter = new EventEmitter;

module.exports = myAppEmitter;