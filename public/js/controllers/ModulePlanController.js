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
        super(windowManager, new ModulePlanRepository());
        this._trello = trelloApi;
        /**
         * The wire to the client manager
         * @type {MessagePort}
         */
        this._telephone = telephone;
        let that = this;
        this._telephone.onmessage = function (ev) {
            let response = ev.data;
            let needUpdate = Object.values(response.result || [])
                .map(function (item) {
                    return Object.entries(item);
                })
                .flat()
                .reduce(function (previous, propertyItem) {
                    let property = propertyItem[0];
                    let value = propertyItem[1];
                    switch (property) {
                        case "fee:current":
                            previous |= that._entity.fee !== value ? (that._entity.fee = value, true) : false;
                            break;
                        case "fee:overall":
                            previous |= that._entity.projectFee !== value ? (that._entity.projectFee = value, true) : false;
                            break;
                        case "charge:current":
                            previous |= that._entity.thirdPartyCharges !== value ? (that._entity.thirdPartyCharges = value, true) : false;
                            break;
                        case "charge:overall":
                            previous |= that._entity.thirdPartyTotalCosts !== value ? (that._entity.thirdPartyTotalCosts = value, true) : false;
                            break;
                        case "costs:overall":
                            previous |= that._entity.totalCosts !== value ? (that._entity.totalCosts = value, true) : false;
                            break;
                    }
                    return previous;
                }, false);
            if (that._entity.capOnDepenses !== that.getCapOnDepenses()) {
                that._entity.capOnDepenses = that.getCapOnDepenses();
            }
            if (needUpdate) {
                that._binding.update(that._entity);
            }
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

    render(entity, configuration) {
        /**
         * @type Plan
         */
        this._entity = entity;
        this._binding = this._binding ? this._binding.update(entity, configuration) : new ModulePlanBinding(this._window.document, entity, this.onEvent, this, configuration).bind();
        return super.render(entity);
    }

    update() {
        if (!this._window.clientManager.isPlanModuleEnabled()) {
            throw "Module is not enabled";
        }

        this._telephone.postMessage({
            'get': ['fee:current',
                'fee:overall',
                'charge:current',
                'charge:overall',
                'costs:overall']
        });
        if (this._entity) {
            this._entity.capOnDepenses = this.getCapOnDepenses();
        }
        if (this._binding) {
            this._binding.update(this._entity);
        }
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
        return isNaN(cod) ? null : parseFloat(cod);
    }

    /**
     * @param {Plan} entity
     * @param name
     * @param defaultValue
     * @return {*}
     */
    getPropertyByName(entity, name, defaultValue) {
        // TODO calculated fields cannot yet be shown as card badges because the value is actually not really stored on the entity
        switch (name) {
            case "field.a":
                return entity.measures || defaultValue;
            case "field.b":
                return entity.description || defaultValue;
            case "field.c":
                return entity.fee || defaultValue;
            case "field.d":
                return entity.projectFee || defaultValue;
            case "field.e":
                return entity.thirdPartyCharges || defaultValue;
            case "field.f":
                return entity.thirdPartyTotalCosts || defaultValue;
            case "field.g":
                let cod = this.getCapOnDepenses();
                if (!isBlank(cod)) {
                    return cod;
                } else {
                    return defaultValue;
                }
            case "field.h":
                return entity.totalCosts || defaultValue;
            case "visual":
                return entity.visual || defaultValue;
            case "form":
                return entity.form || defaultValue;
            case "online":
                return entity.online || defaultValue;
            case "season":
                return entity.season || defaultValue;
            case "region":
                return entity.region || defaultValue;
            case "place":
                return entity.place || defaultValue;
            default:
                if (entity.hasOwnProperty(name)) {
                    return entity[name];
                } else {
                    return entity[name];
                }
        }
    }

    persist(entity, cardId) {
        return this._trello.set(cardId || 'card', 'shared', ModulePlanController.SHARED_NAME, entity);
    }

    remove() {
        let that = this;
        return this._trello.remove('board', 'shared', ModulePlanController.SHARED_NAME)
            .then(function () {
                return that._trello.remove('board', 'shared', ModulePlanController.PROPERTY_BAG_NAME);
            });
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

    clear() {
        return super.clear();
    }

    create(json, configuration) {
        return Plan.create(json);
    }

}