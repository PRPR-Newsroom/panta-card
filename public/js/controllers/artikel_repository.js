class ArtikelRepository {

    constructor() {
        this._repository = {};

        this._contains = function(artikel) {
            return function(value, index) {
                return value.id === artikel.id;
            }
        };
    }

    /**
     * Get all artikels
     * @returns {{}}
     */
    all() {
        return this._repository;
    }

    add(artikel, card) {
        this._repository[card.id] = artikel;
        console.debug("Artikel added: " + artikel.id + " (size=" + this._repository.length + ")");
    }

    replace(artikel, card) {
        this._repository[card.id] = artikel;
    }

    get(card) {
        return this._repository[card.id];
    }

    /**
     * Check if the passed artikel is already in this repository or not
     * @param {Artikel} artikel
     * @returns {boolean}
     */
    isNew(artikel) {
        let that = this;
        return Object.keys(this._repository).find(function(key, index) {
            return that._repository[key].id === artikel.id;
        }) === null;
    }

}