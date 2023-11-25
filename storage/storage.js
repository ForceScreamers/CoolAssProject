const fs = require('fs');

class Storage {
    constructor(path) {
        this.path = path;
    }

    init() {
        if (!fs.existsSync(this.path)) {
            fs.openSync(this.path);
        }

    }

    getItem(key) {

    }
    setItem(key, value) {
        fs.writeSync(this.path, 'yaaa');
    }
    updateItem(key, value) {

    }
    removeItem(key) {

    }
}

module.exports = Storage