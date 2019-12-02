
class DataNode {
    constructor(row) {
        this._row = row;
        /**
         * @type {{header:string,value:any}[]}
         * @private
         */
        this._values = [];
    }

    get row() {
        return this._row;
    }

    get values() {
        return this._values;
    }

    set(header, value) {
        this._values.push({
            "header": header,
            "value": value
        });
    }

    get(header) {
        return this._values.find(it => {
            return it.header === header;
        });
    }

}