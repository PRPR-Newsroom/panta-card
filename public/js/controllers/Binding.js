/**
 *
 * @abstract
 */
class Binding {

    constructor(document, entity, action, context) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        /**
         * @type {}
         */
        this._entity = entity;

        /**
         * The action to be called when data has changed
         */
        this._action = action;

        /**
         * The context that is passed to the data change action handler
         */
        this._context = context;
    }

    /**
     *
     * @param config
     *
     * @returns {Binding}
     * @abstract
     */
    update(config) {

    }

    /**
     *
     * @returns {Binding}
     * @abstract
     */
    bind() {

    }
}
