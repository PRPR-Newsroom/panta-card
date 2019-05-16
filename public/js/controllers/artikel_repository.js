class ArtikelRepository extends Repository {

    constructor() {
        super();
    }

    add(artikel, card) {
        super.add(artikel, card);
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