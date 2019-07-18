/**
 * Repository contract
 * @abstract
 */
class Repository {

    constructor() {
        this._repository = {};
    }
    /**
     * Get all entities
     * @returns {{}}
     */
    all() {
        return this._repository;
    }

    /**
     * Add the entity for the given card
     * @param entity
     * @param {{id: number}} card
     */
    add(entity, card) {
        this._repository[card.id] = entity;
    }

    /**
     * Replace the entity in the given card
     * @param entity
     * @param {{id: number}} card
     */
    replace(entity, card) {
        this._repository[card.id] = entity;
    }

    /**
     * Remove all entries in this repository
     */
    clearAll() {
        let that = this;
        Object.keys(this._repository).forEach(function(key) {
            delete that._repository[key];
        });
    }

    /**
     *
     * @param card
     * @returns {{id: number}}
     */
    get(card) {
        return this._repository[card.id];
    }

    /**
     * @param predicate
     * @returns {any}
     */
    find(predicate) {
        return Object.values(this._repository)
            .find(predicate);
    }

    /**
     * Check if the passed entity is already in this repository or not
     * @param {{}} entity
     * @returns {boolean}
     *
     * @abstract
     */
    isNew(entity) {}
}