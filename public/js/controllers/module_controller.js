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

    static get SHARED_META() {
        return "panta.Beteiligt.Meta";
    }

    /**
     * Get the singleton instance
     * @param trelloApi
     * @returns {ModuleController}
     */
    static getInstance(trelloApi) {
        ModuleController.prepare(trelloApi);
        return window.moduleController;
    }

    /**
     * Prepare the module controller by registering a controller in the window scope if there's none yet
     * @param trelloApi
     */
    static prepare(trelloApi) {
        if (!window.moduleController) {
            window.moduleController = new ModuleController(document, trelloApi);
        }
    }

    constructor(document, trelloApi) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
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

        this.setVersionInfo();
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
        config.setSection(args['valueHolder']['involved-in'], source.getBinding());
        // update the involved part of the entity
        this.persist.call(this, args['config']);
    }

    /**
     * Compute the total price over all "ad" sections over all modules
     * @returns {number}
     */
    getTotalPrice() {
        return Object.values(this._repository.all()).map(function (item, index) {
            return item.sections['ad'];
        }).filter(function (item, index) {
            return item instanceof AdBeteiligt && !isNaN(parseFloat(item.price));
        }).map(function (item, index) {
            return item.price;
        }).reduce(function (previousValue, currentValue) {
            return parseFloat(previousValue) + parseFloat(currentValue);
        }, 0.0);
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
        let controller = ModuleController.getInstance(this.trelloApi);
        return this.trelloApi.cards('id', 'closed')
            .filter(function(card) {
                return !card.closed;
            })
            .each(function(card) {
                return that.trelloApi.get(card.id, 'shared', ModuleController.SHARED_NAME)
                    .then(function(json) {
                        controller.insert(ModuleConfig.create(json), card);
                    });
            })
            .then(function() {
                console.log("Fetch complete: " + controller.size() + " module config(s)");
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
     * Clear all module configs from trello
     */
    clear() {
        Object.keys(this._repository.all()).forEach(function(key) {
            this.trelloApi.remove(key, 'shared', ModuleController.SHARED_NAME);
        }, this);
        this._repository.clearAll();
    }
}