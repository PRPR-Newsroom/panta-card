
class DataNode {
    constructor(row) {
        this._row = row;
        /**
         * @type {{header:HeaderNode,value:any}[]}
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

    /**
     * Get the value at the address/position of the argument header
     * @param {HeaderNode} header
     * @return {{header: HeaderNode, value: any}}
     */
    get(header) {
        return this._values.find(it => {
            return it.header.isSameAddress(header.address);
        });
    }

}