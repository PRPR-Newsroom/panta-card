
class ImportConfiguration {

    /**
     * @return {AbstractField[]}
     */
    get mapping() {
        return this._mapping;
    }

    constructor() {
        /**
         * @type {AbstractField[]}
         * @private
         */
        this._mapping = [];
    }

    /**
     * @param field
     * @return {AbstractField}
     */
    get(field) {
        return this.mapping
            .find(it => {
                return it.reference === field;
            });
    }

}