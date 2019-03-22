/**
 * The Beteiligt Controller
 */
class ModuleController extends Controller {
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
     * @param telephone
     * @returns {ModuleController}
     */
    static getInstance(trelloApi, windowManager, telephone) {
        if (!windowManager.hasOwnProperty('moduleController')) {
            windowManager.moduleController = new ModuleController(windowManager, trelloApi, telephone);
        }
        return windowManager.moduleController;
    }

    /**
     * The module controller for this document.
     *
     * @param windowManager the window manager that gives access to the underlying document
     * @param trelloApi the trello API to persist/read the module config entities
     * @param telephone
     */
    constructor(windowManager, trelloApi, telephone) {
        super(windowManager, new BeteiligtRepository());
        /**
         * @type {HTMLDocument}
         */
        this.document = windowManager.document;

        this.trelloApi = trelloApi;

        /**
         * @type {BeteiligtBinding}
         * @private
         */
        this._beteiligtBinding = null;

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

        /**
         * The wire to the client manager
         * @type {MessagePort}
         */
        this._telephone = telephone;

        this._telephone.onmessage = this._onMessage();

        this.setVersionInfo();
        this.readPropertyBag();
    }

    /**
     * Get a function that handles client manager communication
     *
     * @returns {Function}
     * @private
     */
    _onMessage() {
        let that = this;
        return function (ev) {
            let data = ev.data;
            Object.values(data.get).forEach(function (item) {
                switch (item) {
                    case "fee:current":
                        this._sendResponse(item, this.getTotalFee());
                        break;
                    case "fee:overall":
                        this._sendResponse(item, this.getOverallTotalFee());
                        break;
                    case "charge:current":
                        this._sendResponse(item, this.getTotalCharges());
                        break;
                    case "charge:overall":
                        this._sendResponse(item, this.getOverallTotalCharges());
                        break;
                    case 'costs:overall':
                        this._sendResponse(item, this.getOverallCosts());
                        break;
                }
            }, that);
        };
    }

    /**
     * Send the response back to the client manager
     * @param property
     * @param value
     * @private
     */
    _sendResponse(property, value) {
        let dto = {};
        dto[property] = value;
        this._telephone.postMessage({
            'result': [dto],
        });
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
     * @param configuration
     */
    render(entity, configuration) {
        this._entity = entity;
        this._beteiligtBinding = this._beteiligtBinding
            ? this._beteiligtBinding.update(entity, configuration)
            : this._createBinding(entity, configuration);
    }

    _createBinding(entity, configuration) {
        return new BeteiligtBinding(this.document, entity, this.onEvent, this, configuration).bind()
    }

    /**
     * Hide the whole module
     *
     * @obsolete this is probably not used anymore because the modules are loaded by configuration anyways
     */
    hide() {
        this.document.getElementById("panta.module").addClass("hidden");
    }

    /**
     * Update the form with this module config
     */
    update() {
        if (!this._window.clientManager.isBeteiligtModuleEnabled()) {
            throw "Module is not enabled";
        }
        // update the total price in the "ad" section
        // TODO no hardcoded access!
        this._entity.sections['ad'].total = this.getTotalPrice();
        let totalProject = this.getTotalProject();
        let cod = this.getCapOnDepenses();
        // set all dynamic properties in all OtherBeteiligt sections
        Object.values(this._entity.sections).filter(function (section) {
            return section instanceof OtherBeteiligt;
        }).forEach(function (section) {
            section.project = totalProject;
            section.capOnDepenses = cod;
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
         * @type {ModuleConfig}
         */
        let config = args['config'];
        // update the config entity with this section
        config.sections[args['valueHolder']['involved-in']] = source.getBinding();
        this._beteiligtBinding.rememberFocus(source);
        // update the involved part of the entity
        this.persist.call(this, args['config']).then(function () {
            console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
        });
    }

    /**
     * Compute the total price over all "ad" sections over all modules
     * @returns {number}
     */
    getTotalPrice() {
        return Object.values(this._repository.all()).map(function (item) {
            let sections = item && item.sections ? item.sections : {};
            return sections['ad'];
        }).filter(function (item) {
            return item instanceof AdBeteiligt && !isNaN(parseFloat(item.price));
        }).map(function (item) {
            return item.price;
        }).reduce(function (previousValue, currentValue) {
            return parseFloat(previousValue) + parseFloat(currentValue);
        }, 0.0);
    }

    /**
     * Get the total project costs (fee plus charges) over all module configs on
     * that board
     * @returns {number}
     */
    getTotalProjectCosts() {
        return Object.values(this._repository.all()).map(function (item) {
            // we only need the sections without the keys
            let sections = item && item.sections ? item.sections : {};
            return Object.values(sections);
        }).flat() // flatten the entries
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return [!isNumber(item.fee) ? 0 : item.fee, !isNumber(item.charges) ? 0 : item.charges];
            })
            .flat().reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the overall fee total of this BOARD
     */
    getOverallTotalFee() {
        return Object.values(this._repository.all()).map(function (item) {
            // we only need the sections without the keys
            let sections = item && item.sections ? item.sections : {};
            return Object.values(sections);
        }).flat() // flatten the entries
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return !isNumber(item.fee) ? 0.0 : item.fee;
            })
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the fee total in all sections
     */
    getTotalFee() {
        let sections = this._entity && this._entity.sections ? this._entity.sections : {};
        return Object.values(sections)
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return !isNumber(item.fee) ? 0.0 : item.fee;
            })
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the total of charges in all sections
     */
    getTotalCharges() {
        let sections = this._entity && this._entity.sections ? this._entity.sections : {};
        return Object.values(sections)
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return !isNumber(item.charges) ? 0.0 : item.charges;
            })
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the total of charges in all sections
     */
    getTotalProject() {
        let sections = this._entity && this._entity.sections ? this._entity.sections : {};
        return Object.values(sections)
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return [!isNumber(item.fee) ? 0 : item.fee, !isNumber(item.charges) ? 0 : item.charges]
            })
            .flat()
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the overall charges total of this BOARD
     */
    getOverallTotalCharges() {
        return Object.values(this._repository.all()).map(function (item) {
            // we only need the sections without the keys
            let sections = item && item.sections ? item.sections : {};
            return Object.values(sections);
        }).flat() // flatten the entries
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return !isNumber(item.charges) ? 0.0 : item.charges;
            })
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the overall costs of this BOARD
     * @returns {number}
     */
    getOverallCosts() {
        return Object.values(this._repository.all()).map(function (item) {
            // we only need the sections without the keys
            let sections = item && item.sections ? item.sections : {};
            return Object.values(sections);
        }).flat() // flatten the entries
            .filter(function (item) {
                return item instanceof OtherBeteiligt;
            })
            .map(function (item) {
                return [!isNumber(item.charges) ? 0.0 : item.charges, !isNumber(item.fee) ? 0.0 : item.fee];
            })
            .flat()
            .reduce(function (previousValue, currentValue) {
                return parseFloat(previousValue) + parseFloat(currentValue);
            }, 0.0);
    }

    /**
     * Get the cap on depenses (Kostendach) which is a global property on the board
     * @returns {*}
     */
    getCapOnDepenses() {
        let coe = this.getProperty('cap_on_depenses');
        return isNaN(coe) ? 0.0 : parseFloat(coe);
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
                        that.insert(that.create(json), card);
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
     * @returns {Promise} the set promise request
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
     * Remove the property bag
     *
     * @returns {Promise} the promise of that delete
     */
    removePropertyBag() {
        return this.trelloApi.remove('board', 'shared', ModuleController.PROPERTY_BAG_NAME)
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

    create(json) {
        return ModuleConfig.create(json);
    }
}