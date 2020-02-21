class Import {

    static create(name, json) {
        const instance = new Import(name);
        if (json) {
            const _header = JsonSerialization.getProperty(json, 'header');
            const header = new HeaderNode(null, _header._label, _header._address, _header._comments, _header._color);
            header.addAll(_header._children.map(it => new HeaderNode(header, it._label, it._address, it._comments, it._color)));
            instance.header = header;
        }
        return instance;
    }

    /**
     * @return {DataNode[]}
     */
    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    /**
     * @return {HeaderNode}
     */
    get header() {
        return this._header;
    }

    set header(value) {
        this._header = value;
    }
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    constructor(title) {
        /**
         * @type {string}
         */
        this._title = title;
        /**
         * @type {HeaderNode}
         */
        this._header = null;

        /**
         * Data holder
         * @type {DataNode[]}
         */
        this._data = [];
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
                if (it.address.hasOwnProperty('c') && it.address.hasOwnProperty('r')) {
                    headers[XLSX.utils.encode_cell(it.address)] = it;
                } else if (it.address.hasOwnProperty('constant')) {
                    headers[XLSX.utils.encode_cell(it.address)] = it.address.constant;
                }
            }
        });
        return headers;
    }

    /**
     * @return {HeaderNode[]}
     */
    getNormalizedHeaders() {
        return this.getHeaders(this.header);
    }

    /**
     * @param {DataNode} node
     */
    put(node) {
       this.data.push(node);
    }

    /**
     * Insert the headerToInsert right before the referenced afterHeader
     * @param {HeaderNode} afterHeader
     * @param {HeaderNode} headerToInsert
     */
    insertAt(afterHeader, headerToInsert) {
        const parent = this.getHeader(afterHeader.address).parent;
        const idx = parent.children.findIndex(it => {
            return it.isSameAddress(afterHeader.address);
        });
        if (idx !== -1) {
            parent.children.splice(idx + 1, 0, headerToInsert);
        }
    }

    removeAt(header) {
        const parent = this.getHeader(header.address).parent;
        const idx = parent.children.findIndex(it => {
            return it.isSameAddress(header.address);
        });
        if (idx !== -1) {
            parent.children.splice(idx, 1);
        }
    }

    /**
     * Get a sample value if there's one at the given position
     * @param {HeaderNode} header
     * @return {Promise<{header: string, value: {h: string, v: string, t: string}}|null>}
     */
    getSample(header) {
        if (this.data.length > 0) {
            return Promise.resolve(this.data[0].get(header));
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * @param {{value: {h: string, v: string, t: string}}} sample
     * @param {AbstractField} field
     * @return {string|string|number|{}|*|*}
     */
    getSampleText(sample, field) {
        if (field && sample) {
            return field.getValue(sample);
        } else if (sample && sample.value) {
            const type = sample.value.t;
            const raw = sample.value.v;
            switch (type) {
                case "b":
                    return raw === true ? 'An' : 'Aus';
                case "e":
                    return "Ungültiger Wert";
                case "n": // number
                    return sample.value.w ? sample.value.w : raw;
                case "d": // date
                    return raw.toISOString();
                case "s":
                    return sample.value.w ? sample.value.w : raw;
                default:
                    return sample.value.w ? sample.value.w : raw;
            }
        } else {
            return '';
        }
    }

    /**
     * @param {{header: string, value: any}|null} sample
     * @param {Document} document
     * @param {AbstractField} field
     */
    getSampleHtml(sample, document, field = null) {
        if (field && sample) {
            return this._getHtml(field.getValue(sample), document);
        } else if (sample && sample.value) {
            const type = sample.value.t;
            const raw = sample.value.v;
            return this._getSampleHtml(sample, raw, type, document);
        } else {
            return '<p>&nbsp;</p>';
        }
    }

    _getSampleHtml(sample, raw, type, document) {
        switch (type) {
            case "b":
                return this._getHtml(raw, document);
            case "e":
                return "Ungültiger Wert";
            case "n": // number
                return this._getHtml(sample.value.w ? sample.value.w : raw, document);
            case "d": // date
                return this._getHtml(raw, document);
            case "s":
                return this._getHtml(this.getSampleText(sample), document);
            default:
                return this._getHtml(sample.value.w ? sample.value.w : raw, document);
        }
    }

    _getHtml(raw, document) {
        if (typeof raw === 'boolean') {
            return this._getSwitch(raw, document);
        } else if (raw instanceof Date) {
            return this._getDateTime(raw);
        } else if (isNumber(raw)) {
            return raw;
        } else if (Array.isArray(raw)) {
            return raw.map(it => this._getHtml(it, document)).reduce((prev,cur) => {
                prev += cur;
                return prev;
            }, '');
        } else if (raw !== null) {
            return `<p class="nobreak" title="${raw}">${raw}</p>`;
        } else {
            return '<p>&nbsp;</p>';
        }
    }

    _getDateTime(raw) {
        const dateOf = raw instanceof Date ? raw : DateField.getDateOf(raw);
        return dateOf ? dateOf.toLocaleDateString() : raw;
    }

    _getSwitch(raw, document) {
        const bvalue = typeof raw === 'boolean' ? raw : BooleanField.getBooleanValue(raw);
        const item = new SwitchItem(document, "", bvalue, true);
        item.additionalStyles = "borderless";
        return item.render().innerHTML;
    }

}