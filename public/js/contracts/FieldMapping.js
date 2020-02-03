/**
 * @abstract
 */
class FieldMapping {

    constructor(trello, adminService, pantaFields) {
        /**
         * @protected
         */
        this._trello = trello;
        /**
         * @type {AdminService}
         * @protected
         */
        this._adminService = adminService;
        /**
         * @type {ClientManager}
         * @protected
         */
        this._clientManager = ClientManager.getInstance(window);

        /**
         * @type {PromiseLike<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never> | Promise<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never>}
         * @protected
         */
        this._pantaFields = pantaFields;
    }

    /**
     * @param {{id: string, name: string, desc: string, due: string, members: {}[], labels: {}[], idList: string}} card
     * @param {AbstractField} field
     */
    map(card, field) {
        const that = this;
        switch (field.reference) {
            case 'trello.title':
                return card.name;
            case 'trello.description':
                return card.desc;
            case 'trello.duedate':
                return card.due;
            case 'trello.members':
                return that.mapArray(card.members.map(that.mapMember));
            case 'trello.labels':
                return that.mapArray(card.labels
                    .filter(it => that.labelFilter(it, field))
                    .map(it => that.mapLabel(it))) || that.emptyValue();
            case 'trello.list':
                return that._adminService.getListById(card.idList)
                    .then(it => {
                        return it.name;
                    });
            default:
                return that._getPantaFields()
                    .then(its => {
                        /**
                         * @type {{id: string, desc: string, visible: boolean, type: string, values?: string[]}}
                         */
                        const it = its
                            .flatMap(its => its)
                            .map(it => {
                                const groupId = it.groupId;
                                const moduleId = it.moduleId;
                                const section = it.section;
                                const found = it.fields.find(it => `${groupId}.${it.id}` === field.reference);
                                if (found) {
                                    const controller = that._clientManager.getController(moduleId);
                                    const entity = controller.getByCard(card);
                                    return controller.getPropertyByName(entity, section, found.id, that.emptyValue());
                                }
                                return null;
                            })
                            .find(it => it !== null);
                        return it ? it : that.emptyValue();
                    });
        }
    }

    emptyValue() {
        return "";
    }

    mapLabel(label) {
        return '';
    }

    labelFilter(label, field) {
        return !!label;
    }

    /**
     * @param member
     * @return {string}
     * @abstract
     */
    mapMember(member) {
        return ``;
    }

    /**
     * @param array
     * @return {*}
     * @abstract
     */
    mapArray(array) {
        return array;
    }

    /**
     * @return {PromiseLike<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never> | Promise<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never>}
     * @private
     */
    _getPantaFields() {
        return this._pantaFields;
    }

}