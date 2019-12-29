class ImportConfiguration {

    static create(json) {
        const config = new ImportConfiguration();
        if (json) {
            // config.mapping = JsonSerialization.getProperty(json, 'mapping');
            config.mapping = JsonSerialization.getProperty(json, 'mapping').map(it => {
                switch (JsonSerialization.getProperty(it, 'type')) {
                    case 'date':
                        return new DateField(
                            JsonSerialization.getProperty(it, 'name'),
                            JsonSerialization.getProperty(it, 'reference'),
                            HeaderNode.create(JsonSerialization.getProperty(it, 'source'))
                        );
                    case 'text':
                        return new TextField(
                            JsonSerialization.getProperty(it, 'name'),
                            JsonSerialization.getProperty(it, 'reference'),
                            HeaderNode.create(JsonSerialization.getProperty(it, 'source'))
                        );
                    case 'boolean':
                        return new BooleanField(
                            JsonSerialization.getProperty(it, 'name'),
                            JsonSerialization.getProperty(it, 'reference'),
                            HeaderNode.create(JsonSerialization.getProperty(it, 'source'))
                        );
                    case 'array':
                        return new ArrayField(
                            JsonSerialization.getProperty(it, 'name'),
                            JsonSerialization.getProperty(it, 'reference'),
                            HeaderNode.create(JsonSerialization.getProperty(it, 'source'))
                        );
                    default:
                        return null;
                }
            });
            config.labels = JsonSerialization.getProperty(json, 'labels');
        }
        console.debug('config', config);
        return config;
    }

    /**
     * @return {{id: string, color: string, idBoard: string, name: string}[]}
     */
    get labels() {
        return this._labels;
    }

    set labels(value) {
        this._labels = value;
    }

    /**
     * @return {AbstractField[]}
     */
    get mapping() {
        return this._mapping;
    }

    set mapping(value) {
        this._mapping = value;
    }

    constructor() {
        /**
         * @type {AbstractField[]}
         * @private
         */
        this._mapping = [];
        /**
         * @type {{id: string, color: string, idBoard: string, name: string}[]}
         * @private
         */
        this._labels = [];
    }

    /**
     * @param {string} field name of that field
     * @return {AbstractField[]}
     */
    get(field) {
        return this.mapping
            .filter(it => {
                return it.reference === field;
            });
    }

    single(field) {
        const fields = this.get(field);
        return fields && fields.length === 1 ? fields[0] : null;
    }

}