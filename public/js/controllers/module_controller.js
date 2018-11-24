/**
 * The Beteiligt Controller
 */
class ModuleController {
    /**
     * The app version
     * @returns {number}
     */
    static get VERSION() {
        return 1;
    }

    /**
     * The name that is used to store the beteiligt in trello
     * @returns {string}
     */
    static get SHARED_NAME() {
        return "panta.Beteiligt";
    }

    /**
     * The name of the meta info in trello
     * @returns {string}
     * @constructor
     */
    static get SHARED_META() {
        return "panta.Beteiligt.Meta";
    }

    /**
     * The name of the property bag in trello
     * @returns {string}
     * @constructor
     */
    static get PROPERTY_BAG_NAME() {
        return "panta.Beteiligt.PropertyBag";
    }

    /**
     * Get the singleton instance
     * @param trelloApi
     * @param windowManager
     * @returns {ModuleController}
     */
    static getInstance(trelloApi, windowManager) {
        if (!windowManager.hasOwnProperty('moduleController')) {
            windowManager.moduleController = new ModuleController(windowManager, trelloApi);
        }
        return windowManager.moduleController;
    }

    /**
     * The module controller for this document.
     *
     * @param windowManager the window manager that gives access to the underlying document
     * @param trelloApi the trello API to persist/read the module config entities
     */
    constructor(windowManager, trelloApi) {
        /**
         * @type {HTMLDocument}
         */
        this.document = windowManager.document;

        this._window = windowManager;

        this.trelloApi = trelloApi;

        /**
         * @type {BeteiligtBinding}
         * @private
         */
        this._beteiligtBinding = null;

        /**
         * @type {BeteiligtRepository}
         * @private
         */
        this._repository = new BeteiligtRepository();

        /**
         * @type {ModuleConfig}
         * @private
         */
        this._entity = null;

        /**
         * A property bag that can be used to store just plain old values
         * @type {{}}
         * @private
         */
        this._propertyBag = {};

        this.setVersionInfo();
        this.readPropertyBag();
    }

    /**
     * Set the version info on trello
     */
    setVersionInfo() {
        this.trelloApi.set('card', 'shared', ModuleController.SHARED_META, this.getVersionInfo());
    }

    /**
     * Get the version info object
     *
     * @returns {{version: number}}
     */
    getVersionInfo() {
        return {
            'version': ModuleController.VERSION
        }
    }

    /**
     * Initialize the module with this module config
     * @param entity
     */
    render(entity) {
        this._entity = entity;
        this._beteiligtBinding = this._beteiligtBinding ? this._beteiligtBinding.update(entity) : new BeteiligtBinding(this.document, entity, this.onEvent, this).bind();
    }

    /**
     * Insert the passed artikel into the repository and associates it with the given card
     * @param {ModuleConfig} entity
     * @param {Trello.Card} card
     */
    insert(entity, card) {
        if (entity && this._repository.isNew(entity)) {
            this._repository.add(entity);
        } else if (entity) {
            this._repository.replace(entity, card);
        }
    }

    /**
     * Update the form with this module config
     */
    update() {
        // update the total price in the "ad" section
        this._entity.sections['ad'].total = this.getTotalPrice();
        let tpf = this.getTotalProjectFee();
        let cod = this.getCapOnExpenses();
        // set all dynamic properties in all OtherBeteiligt sections
        Object.values(this._entity.sections).filter(function (section) {
            return section instanceof OtherBeteiligt;
        }).forEach(function (section) {
            section.project = tpf;
            section.capOnExpenses = cod;
        });
        this._beteiligtBinding.update(this._entity);
    }

    /**
     * Called when an event on the source element happened
     * @param source the source input element
     * @param args a dictionary object with 'context', 'valueHolder', the entity 'config' and the 'event'
     */
    onEvent(source, args) {
        let event = args.hasOwnProperty('event') ? args['event'] : 'change';
        switch (event) {
            case 'focus':
                args['context']._onFocus.call(args['context'], source, args);
                break;
            case 'blur':
                args['context']._onLooseFocus.call(args['context']);
                break;
            default:
                args['context']._onChange.call(args['context'], source, args);
                break;
        }
    }

    /**
     * Handle focus events
     *
     * @param {PInput} source the source input element
     * @param args a dictionary object with 'context', 'valueHolder', the entity 'config' and the 'event'
     * @private
     */
    _onFocus(source, args) {
        this._beteiligtBinding.enterEditing();
    }

    /**
     * Handle loose focus on elements. This will call leaveEditing on the BeteiligtBinding
     * @private
     */
    _onLooseFocus() {
        this._beteiligtBinding.leaveEditing();
    }

    /**
     * Handle change events for the source element. This will persist the entity and sync the
     * entity references
     *
     * @param source the source input element
     * @param args a dictionary object with 'context', 'valueHolder', the entity 'config' and the 'event'
     * @private
     */
    _onChange(source, args) {
        source.setProperty();
        /**
         * @var ModuleConfig
         */
        let config = args['config'];
        // update the config entity with this section
        config.sections[args['valueHolder']['involved-in']] = source.getBinding();
        // update the involved part of the entity
        // todo do this differently
        switch (source.getBoundProperty()) {
            case "capOnExpenses":
                this.setProperty('cap_on_expenses', source.getValue());
                break;
            default:
                this.persist.call(this, args['config']);
                console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
                break;
        }
    }

    /**
     * Compute the total price over all "ad" sections over all modules
     * @returns {number}
     */
    getTotalPrice() {
        return Object.values(this._repository.all()).map(function (item) {
            return item.sections['ad'];
        }).filter(function (item) {
            return item instanceof AdBeteiligt && !isNaN(parseFloat(item.price));
        }).map(function (item) {
            return item.price;
        }).reduce(function (previousValue, currentValue) {
            return parseFloat(previousValue) + parseFloat(currentValue);
        }, 0.0);
    }

    /**
     * Get the total project fee over all module configs on that board
     * @returns {number}
     */
    getTotalProjectFee() {
        return Object.values(this._repository.all()).map(function (item) {
            // we only need the sections without the keys
            return Object.values(item.sections);
        }).flat() // flatten the entries
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return [isNaN(item.fee) ? 0 : item.fee, isNaN(item.charges) ? 0 : item.charges];
            })
            .flat().reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the cap on expenses (Kostendach) which is a global property on the board
     * @returns {*}
     */
    getCapOnExpenses() {
        let coe = this.getProperty('cap_on_expenses');
        return isNaN(coe) ? 0.0 : parseFloat(coe);
    }

    /**
     * Get the configuration by its card id
     * @param card the trello card id which is used in {@code insert}
     * @return {{}}
     */
    getByCard(card) {
        return this._repository.get(card);
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
    fetchAll(onComplete) {
        let that = this;
        return this.trelloApi.cards('id', 'closed')
            .filter(function (card) {
                return !card.closed;
            })
            .each(function (card) {
                return that.trelloApi.get(card.id, 'shared', ModuleController.SHARED_NAME)
                    .then(function (json) {
                        that.insert(ModuleConfig.create(json), card);
                    });
            })
            .then(function () {
                console.log("Fetch complete: " + that.size() + " module config(s)");
                onComplete.call(that);
            })
    }

    /**
     * Persist the entity to Trello
     * @param trelloApi
     * @param entity
     * @param cardId optionally a card id if it should not be the current one
     */
    persist(entity, cardId) {
        // https://trello.com/1/cards/eFYBmEia/pluginData
        return this.trelloApi.set(cardId || 'card', 'shared', ModuleController.SHARED_NAME, entity);
    }

    /**
     * Set a property in trello
     * @param propertyName
     * @param propertyValue
     */
    setProperty(propertyName, propertyValue) {
        this._propertyBag[propertyName] = propertyValue;
        this.trelloApi.set('board', 'shared', ModuleController.PROPERTY_BAG_NAME, this._propertyBag);
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
     * Read the properties from trello and store the result internally so future calls to {@code getProperty} will return
     * this remote property value
     */
    readPropertyBag() {
        let that = this;
        this.trelloApi.get('board', 'shared', ModuleController.PROPERTY_BAG_NAME, {})
            .then(function (bag) {
                that._propertyBag = bag;
            });
    }

    /**
     * Clear all module configs from trello
     */
    clear() {
        Object.keys(this._repository.all()).forEach(function (key) {
            this.trelloApi.remove(key, 'shared', ModuleController.SHARED_NAME);
        }, this);
        this._repository.clearAll();
    }
}