class Import {

    constructor(title) {
        /**
         * @type {string}
         */
        this.title = title;
        /**
         * @type {HeaderNode}
         */
        this.header = null;

        /**
         * Data holder
         * @type {DataNode[]}
         */
        this.data = [];
    }

    /**
     * @param address
     * @return {HeaderNode}
     */
    getHeader(address) {
        const headers = this.getHeaders(this.header);
        return Object.entries(headers).filter(it => {
            return XLSX.utils.decode_cell(it[0]).c === address.c;
        }).map(it => it[1])[0];
    }

    /**
     * @param {HeaderNode} node
     */
    getHeaders(node) {
        const that = this;
        const headers = {};
        node.children.forEach(it => {
            if (it.hasChildren()) {
                Object.entries(that.getHeaders(it)).forEach(it => {
                    headers[it[0]] = it[1];
                });
            } else {
                headers[XLSX.utils.encode_cell(it.address)] = it;
            }
        });
        return headers;
    }

    put(node) {
       this.data.push(node);
    }

}