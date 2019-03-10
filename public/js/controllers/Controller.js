/**
 * @abstract
 */
class Controller {

    constructor(repository) {
        /**
         * @type {Repository}
         * @public
         */
        this._repository = repository;
    }

    update() {}

    /**
     *
     * @param entity
     * @param configuration an option configuration object
     * @abstract
     */
    render(entity, configuration) {}

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
     * @return {}
     * @abstract
     */
    create(json) {}

    /**
     * Called when an event has occurred
     * @param {PInput} source
     * @param args
     */
    onEvent(source, args) {}

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
}