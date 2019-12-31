/**
 * @abstract
 */
class Controller {

    constructor(windowManager, repository) {
        /**
         * @type {Repository}
         * @public
         */
        this._repository = repository;

        /**
         * @type {Binding}
         * @private
         */
        this._binding = null;

        /**
         * @type {Window}
         */
        this._window = windowManager;
    }

    /**
     * Check if it can unblock the UI and will do so if there's no block task
     */
    canUnblock() {
        if (!this._window.clientManager.getPluginController().upgrading) {
            this._binding.unblock();
        }
    }

    /**
     * Block the UI because there's for example an upgrade going on
     * @return {Promise<boolean>}
     */
    blockUi() {
        this._binding.blockUi();
        return Promise.resolve(true);
    }

    /**
     * Called when the controller should update its content
     * @abstract
     */
    update() {
    }

    /**
     *
     * @param entity
     * @param configuration an option configuration object
     * @abstract
     */
    render(entity, configuration) {
    }

    /**
     * Detach the ui
     */
    detach() {
        if (this._binding) {
            // the binding may be null
            this._binding.detach();
        }
    }

    /**
     * @param {} entity
     * @param {Trello.Card} card
     */
    insert(entity, card) {
        if (entity && this._repository.isNew(entity)) {
            this._repository.add(entity, card);
        } else if (entity) {
            this._repository.replace(entity, card);
        }
    }

    /**
     * Create an entity from the json
     * @param json
     * @param configuration
     * @return {}
     * @abstract
     */
    create(json, configuration) {
    }

    /**
     * Called when an event has occurred
     * @param {PInput} source
     * @param args
     */
    onEvent(source, args) {
    }

    /**
     * Get all module configs
     * @returns {Array}
     */
    list() {
        return this._repository.all();
    }

    /**
     * Get the number of module configs
     * @returns {number}
     */
    size() {
        return Object.keys(this.list()).length;
    }

    /**
     * Fetch all module configs from Trello
     */
    fetchAll() {
    }

    /**
     * Persist the entity to Trello
     * @param trelloApi
     * @param entity
     * @param cardId optionally a card id if it should not be the current one
     * @returns {Promise} the set promise request
     */
    persist(entity, cardId) {

    }

    /**
     * Clear all module configs from trello
     */
    clear() {

    }

    /**
     * Get the artikel for the passed trello card
     * @param {id: number} card
     * @returns {*}
     */
    getByCard(card) {
        return this._repository.get(card);
    }

    /**
     * Check if the artikel is empty or not. It will return true if the entity has some content otherwise false
     * @param entity
     * @return {boolean}
     */
    hasContent(entity) {
        return !entity.isEmpty()
    }

    /**
     *
     * @param {} editable
     * @param {Artikel|Plan|ModuleConfig} entity
     * @param defaultValue
     * @return {*}
     */
    getMapping(editable, entity, defaultValue) {
        switch (editable.type) {
            case "select":
                let index = this.getPropertyByName(entity, editable.id, -1);
                return index !== -1 ? editable.values[index] : defaultValue;
            default:
                return this.getPropertyByName(entity, editable.id, defaultValue);
        }
    }

    /**
     * @param {Artikel|Plan|ModuleConfig} entity
     * @param editableId
     * @param defaultValue
     * @return {*} the property value
     * @abstract
     */
    getPropertyByName(entity, editableId, defaultValue) {
    }

    /**
     * @param {PluginModuleConfig} pluginModuleConfig the plugin module configuration
     * @return {[]} all fields that this controller knows about
     */
    getFields(pluginModuleConfig) {
        const that = this;
        return [[{
            'group': 'Felder',
            'groupId': `${pluginModuleConfig.id}`,
            'fields': pluginModuleConfig.config.editables.filter(that.isImportableField)
        }]];
    }

    /**
     * @param {{id: string, desc: string, visible: boolean, type: string}} field
     */
    isImportableField(editable) {
        return editable.visible && (editable.type === "text" || editable.type === "select")
    }

}