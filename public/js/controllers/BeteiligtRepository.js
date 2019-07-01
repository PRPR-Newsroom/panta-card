
class BeteiligtRepository extends Repository {

    constructor() {
        super();
    }

    /**
     *
     * @param {ModuleConfig} entity
     * @returns {boolean}
     */
    isNew(entity) {
        let that = this;
        return Object.keys(this._repository).find(function(key, index) {
            return that._repository[key].id === entity.id;
        }) === null;
    }
}