class ModulePlanController extends Controller {

    static get SHARED_NAME() {
        return "panta.Plan";
    }

    static get PROPERTY_BAG_NAME() {
        return "panta.Plan.PropertyBag";
    }

    /**
     * Get the singleton instance
     * @param trelloApi
     * @param windowManager
     * @returns {ModulePlanController}
     */
    static getInstance(trelloApi, windowManager, telephone) {
        if (!windowManager.hasOwnProperty('planController')) {
            windowManager.planController = new ModulePlanController(windowManager, trelloApi, telephone);
        }
        return windowManager.planController;
    }

    constructor(windowManager, trelloApi, telephone) {
        super(new ModulePlanRepository());
        this._window = windowManager;
        this._trello = trelloApi;
        /**
         * The wire to the client manager
         * @type {MessagePort}
         */
        this._telephone = telephone;
        let that = this;
        this._telephone.onmessage = function (ev) {
            let response = ev.data;
            Object.values(response.result || []).forEach(function (item) {
                Object.entries(item).forEach(function (item) {
                    let property = item[0];
                    let value = item[1];
                    switch (property) {
                        case "fee:current":
                            this._entity.fee = value;
                            break;
                        case "fee:overall":
                            this._entity.projectFee = value;
                            break;
                        case "charge:current":
                            this._entity.thirdPartyCharges = value;
                            break;
                        case "charge:overall":
                            this._entity.thirdPartyTotalCosts = value;
                            break;
                        case "costs:overall":
                            that._entity.totalCosts = value;
                            break;
                    }
                }, this);
            }, that);
            that._entity.capOnDepenses = that.getCapOnDepenses();
            that._binding.update(that._entity);

        };
        /**
         * @type {ModulePlanBinding}
         * @private
         */
        this._binding = null;
        /**
         * A property bag that can be used to store just plain old values
         * @type {{}}
         * @private
         */
        this._propertyBag = {};

        // this is async!
        this.readPropertyBag();
    }

    render(entity) {
        /**
         * @type Plan
         */
        this._entity = entity;
        this._binding = this._binding ? this._binding.update(entity) : new ModulePlanBinding(this._window.document, entity, this.onEvent, this).bind();
        return super.render(entity);
    }

    update() {
        this._telephone.postMessage({
            'get': ['fee:current',
                'fee:overall',
                'charge:current',
                'charge:overall',
                'costs:overall']
        });
        this._entity.capOnDepenses = this.getCapOnDepenses();
        this._entity.totalCosts = this.getProjectCosts();
        this._binding.update(this._entity);
        return super.update();
    }

    onEvent(source, args) {
        let event = args.hasOwnProperty('event') ? args['event'] : 'change';
        switch (event) {
            case 'change':
                args['context']._onChange.call(args['context'], source);
                break;
            default:
                // do nothing yet
                break;
        }
    }

    /**
     * Get a property by its name. This is not accessing trello but uses the internal state
     * @param propertyName the name of the property
     * @param defaultValue if not present return this default value
     * @returns {*}
     */
    getProperty(propertyName, defaultValue) {
        return this._propertyBag[propertyName] || defaultValue;
    }

    /**
     * Set a property in trello
     * @param propertyName
     * @param propertyValue
     */
    setProperty(propertyName, propertyValue) {
        this._propertyBag[propertyName] = propertyValue;
        this._trello.set('board', 'shared', ModulePlanController.PROPERTY_BAG_NAME, this._propertyBag);
    }

    /**
     * Read the properties from trello and store the result internally so future calls to {@code getProperty} will return
     * this remote property value
     */
    readPropertyBag() {
        let that = this;
        this._trello.get('board', 'shared', ModulePlanController.PROPERTY_BAG_NAME, {})
            .then(function (bag) {
                that._propertyBag = bag;
            });
    }

    /**
     * Get "Kostendach" property
     *
     * <pre>Ein Betrag wird auf irgendeiner CARD des BOARD eingetippt und ist dann auf jeder CARD sichtbar</pre>
     *
     * @returns {number}
     */
    getCapOnDepenses() {
        let cod = this.getProperty('cap_on_depenses');
        return isNaN(cod) ? 0.0 : parseFloat(cod);
    }

    /**
     * Get overall project costs (charges + thirdPartyCharges)
     */
    getProjectCosts() {
        return Object.values(this._repository.all()).map(function (item) {
            return [isNaN(item.projectFee) ? 0 : item.projectFee, isNaN(item.thirdPartyTotalCosts) ? 0 : item.thirdPartyTotalCosts];
        }).flat().reduce(function (previousValue, currentValue) {
            return parseInt(previousValue) + parseInt(currentValue);
        }, 0);
    }

    /**
     * Get all third-party costs over the current board
     *
     * <pre>Rechnet über das ganze Board das aktuelle Total der Drittkosten</pre>
     *
     * @returns {any}
     */
    getThirdPartyCosts() {
        return Object.values(this._repository.all()).map(function (item, index) {
            let number = parseInt(item.thirdPartyCharges);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        }).reduce(function (previousValue, currentValue) {
            return parseInt(previousValue) + parseInt(currentValue);
        }, 0);
    }

    /**
     * Get total fee costs on this board
     *
     * <pre>Hier wird automatisch die laufende SUMME von «Honorar Total CHF» PLUS «Drittkosten Total CHF»
     * gerechnet und dargestellt</pre>
     *
     * @returns {any}
     */
    getTotalFeeCharges() {
        return Object.values(this._repository.all()).map(function (item, index) {
            let number = parseInt(item.fee);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        }).reduce(function (previousValue, currentValue) {
            return parseInt(previousValue) + parseInt(currentValue);
        }, 0);
    }

    /**
     * Get the entity by card
     * @param card
     * @returns {{}}
     */
    getByCard(card) {
        return this._repository.get(card);
    }

    /**
     * @param {Plan} entity
     * @returns {boolean}
     */
    hasContent(entity) {
        return !entity.isEmpty()
    }

    getRegionMapping(region) {
        return ArtikelBinding.getRegionMapping(region);
    }

    getOnlineMapping(online) {
        return ArtikelBinding.getTagMapping(online);
    }

    persist(entity, cardId) {
        return this._trello.set(cardId || 'card', 'shared', ModulePlanController.SHARED_NAME, entity);
    }

    remove() {
        return this._trello.remove('board', 'shared', ModulePlanController.SHARED_NAME);
    }

    _onChange(source) {
        source.setProperty();
        switch (source.getBoundProperty()) {
            case "capOnDepenses":
                this.setProperty('cap_on_depenses', source.getValue());
                break;
            default:
                this.persist.call(this, source.getBinding());
                break;
        }
    }

}