let fs = require('fs');



class Storage {
    constructor(path) {
        this.path = path;
    }

    init() {
        fs.writeFileSync(this.path, 'hello!')
    }

    getItem(key) {

    }
    setItem(key, value) {

    }
    updateItem(key, value) {

    }
    removeItem(key) {

    }
}

module.exports = Storage;