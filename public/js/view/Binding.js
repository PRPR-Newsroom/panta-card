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

        this._autoUpdater = null;
    }

    /**
     *
     * @param entity
     * @param configuration
     *
     * @returns {Binding}
     * @abstract
     */
    update(entity, configuration) {

    }

    /**
     *
     * @returns {Binding}
     * @abstract
     */
    bind() {

    }

    /**
     * Detach the UI
     * @abstract
     */
    detach() {

    }

    /**
     * Blocks the UI by
     * @returns {Promise<T>|PromiseLike<T>}
     */
    blockUi() {
        if (this.document.getElementsByClassName('overlay').length > 0) {
            return Promise.resolve(true);
        }
        let that = this;
        let overlay = this.document.createElement("div");
        overlay.addClass("overlay");

        overlay.appendChild(this.document.createTextNode("Plugin Daten werden aktualisiert..."));

        this.document.getElementsByTagName("body").item(0).appendChild(overlay);
        this._autoUpdater = this._autoUpdater || setInterval(function() {
            that._context.canUnblock();
        }, 500);
        return Promise.resolve(true);
    }

    /**
     * Unblock the UI
     */
    unblock() {
        this.document.getElementsByClassName("overlay").forEach(function(item) {
            item.parentNode.removeChild(item);
        });
        if (this._autoUpdater) {
            clearInterval(this._autoUpdater);
        }
    }
}
