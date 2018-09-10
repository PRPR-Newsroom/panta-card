class ArtikelRepository {

    constructor() {
        this._repository = [];

        this._contains = function(artikel) {
            return function(value, index) {
                return value.id === artikel.id;
            }
        };
    }

    /**
     * @returns {Array}
     */
    all() {
        return this._repository;
    }

    add(artikel) {
        this._repository.push(artikel);
        console.debug("Artikel added: " + artikel.id + " (size=" + this._repository.length + ")");
    }

    replace(artikel) {
        let position = this._repository.findIndex(this._contains(artikel));
        if (position !== -1) {
            this._repository[position] = artikel;
            console.debug("Artikel updated: " + artikel.id + " (size=" + this._repository.length + ")");
        } else {
            console.debug("Cannot replace artikel because it's not yet in the repo");
        }
    }

    /**
     * @param {Artikel} artikel
     * @returns {boolean}
     */
    isNew(artikel) {
        return this._repository.find(this._contains(artikel)) == null;
    }

}