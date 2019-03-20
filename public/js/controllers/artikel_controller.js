/**
 * Controller of artikels that let you manage multiple artikels
 *
 */
class ArtikelController extends Controller {

    /**
     * The app version
     * @returns {number}
     */
    static get VERSION() {
        return 1;
    }

    /**
     * The name that is used to store the artikels in trello
     * @returns {string}
     */
    static get SHARED_NAME() {
        return "panta.Artikel";
    }

    /**
     * The name that is used to store the meta info on trello
     * @returns {string}
     */
    static get SHARED_META() {
        return "panta.Meta";
    }

    /**
     * Get the singleton controller
     *
     * @param trelloApi the Trello API
     * @param windowManager
     * @returns {ArtikelController}
     */
    static getInstance(trelloApi, windowManager, telephone) {
        if (!windowManager.hasOwnProperty('articleController')) {
            windowManager.articleController = new ArtikelController(
                windowManager,
                trelloApi,
                DI.getInstance().getArticleRepository(),
                telephone
            );
        }
        return windowManager.articleController;
    }

    /**
     * @param windowManager
     * @param trelloApi
     * @param {Repository} repository
     * @param telephone
     */
    constructor(windowManager, trelloApi, repository, telephone) {
        super(windowManager, repository);
        /**
         * @type {HTMLDocument}
         */
        this.document = windowManager.document;

        this.trelloApi = trelloApi;
        /**
         * @type {Artikel}
         * @private
         */
        this._entity = null;

        /**
         * The telephone to the client manager
         * @type {MessagePort}
         */
        this._telephone = telephone;

        this.setVersionInfo();
    }

    /**
     * Set the version info on trello
     */
    setVersionInfo() {
        this.trelloApi.set('card', 'shared', ArtikelController.SHARED_META, this.getVersionInfo());
    }

    /**
     * Get the version info object
     *
     * @returns {{version: number}}
     */
    getVersionInfo() {
        return {
            'version': ArtikelController.VERSION
        }
    }

    create(json) {
        return Artikel.create(json);
    }

// /**
    //  * Insert the passed artikel into the repository and associates it with the given card
    //  * @param {Artikel} artikel
    //  * @param {{id: number}} card
    //  */
    // insert(artikel, card) {
    //     if (artikel && this._repository.isNew(artikel)) {
    //         this._repository.add(artikel, card);
    //     } else if (artikel) {
    //         this._repository.replace(artikel, card);
    //     }
    // }

    /**
     * Get the artikel for the passed trello card
     * @param {id: number} card
     * @returns {*}
     */
    getByCard(card) {
        return this._repository.get(card);
    }

    /**
     * Check if the artikel is empty or not. It will return true if the artikel (without the involvement part) has some content otherwise false
     *
     * @param {Artikel} artikel
     */
    hasArtikelContent(artikel) {
        return !artikel.isEmpty()
    }

    /**
     * Get the region mapping in german
     * @param region
     * @returns {string|*}
     */
    getRegionMapping(region) {
        return ArtikelBinding.getRegionMapping(region);
    }

    /**
     *
     * @param {} editable
     * @param {Artikel} entity
     * @param defaultValue
     * @return {*}
     */
    getMapping(editable, entity, defaultValue) {
        switch (editable.type) {
            case "select":
                let index = this._getPropertyByName(entity, editable.id, -1);
                return index !== -1 ? editable.values[index] : defaultValue;
            default:
                return this._getPropertyByName(entity, editable.id, defaultValue);
        }
    }

    /**
     * Get a property value by its name
     * @param {Artikel} entity
     * @param name
     * @param defaultValue
     * @return {*}
     * @private
     */
    _getPropertyByName(entity, name, defaultValue) {
        switch (name) {
            case "visual":
                return entity.visual || defaultValue;
            case "form":
                return entity.form || defaultValue;
            case "online":
                return entity.tags || defaultValue;
            case "season":
                return entity.season || defaultValue;
            case "region":
                return entity.region || defaultValue;
            case "place":
                return entity.location || defaultValue;
            case "field.a":
                return entity.from || defaultValue;
            case "field.b":
                return entity.author || defaultValue;
            case "field.c":
                return entity.text || defaultValue;
            default:
                if (entity.hasOwnProperty(name)) {
                    return entity[name];
                } else {
                    return entity[name];
                }
        }
    }

    /**
     * Fetch all articles from Trello
     */
    fetchAll() {
        let that = this;
        return this.trelloApi.cards('id', 'closed')
            .filter(function (card) {
                return !card.closed;
            })
            .each(function (card) {
                return that.trelloApi.get(card.id, 'shared', ArtikelController.SHARED_NAME)
                    .then(function (json) {
                        that.insert(Artikel.create(json), card);
                    });
            })
            .then(function () {
                console.log("Fetch complete: " + that.size() + " article(s) to process");
            })
    }

    /**
     * Get all artikels currently known
     * @returns {Array}
     */
    list() {
        return this._repository.all();
    }

    /**
     * Get the number of articles
     * @returns {number}
     */
    size() {
        return Object.keys(this.list()).length;
    }

    /**
     * Check if the passed artikel is already managed or not
     * @param artikel
     * @returns {boolean}
     */
    isManaged(artikel) {
        return artikel.id !== null;
    }

    /**
     * Make the artikel managed by setting the ID of the artikel
     * @param artikel
     * @returns {Artikel}
     */
    manage(artikel) {
        artikel.id = uuid();
        return artikel;
    }

    /**
     * Called when the artikel has changed and the controller should re-compute dynamic properties (totals)
     */
    update() {
        let that = this;
        this._window.clientManager.isArticleModuleEnabled()
            .then(function (enabled) {
                if (!enabled) {
                    throw "Module is not enabled";
                }
                // calc total
                that._entity.total = that.getTotalPageCount();
                that._binding.update(that._entity);
                return true;
            });
    }

    /**
     * Compute the total page count over all artikels
     * @returns {int}
     */
    getTotalPageCount() {
        return Object.values(this._repository.all()).map(function (item, index) {
            let number = parseInt(item.layout);
            if (isNaN(number)) {
                return 0;
            }
            return number;
        }).reduce(function (previousValue, currentValue) {
            return parseInt(previousValue) + parseInt(currentValue);
        }, 0);
    }

    /**
     * Render the passed artikel onto the document
     * @param {Artikel} artikel
     * @param configuration optional
     */
    render(artikel, configuration) {
        this._entity = artikel ? artikel : Artikel.create();
        this._binding = this._binding ? this._binding.update(this._entity, configuration) : new ArtikelBinding(this.document, this._entity, this.onEvent, this, configuration).bind();
    }

    /**
     * Called when there's an event happening on the target input element
     *
     * @param {PInput} source the source input element (s. PInputs)
     * @param ctx dictionary object with 'context', 'event' (change, focus)
     */
    onEvent(source, ctx) {
        let event = ctx.hasOwnProperty('event') ? ctx['event'] : 'change';
        switch (event) {
            case 'focus':
                ctx['context']._onFocus.call(ctx['context'], source, ctx);
                break;
            default:
                ctx['context']._onChange.call(ctx['context'], source, ctx);
                break;
        }
    }

    /**
     * Handle focus events
     *
     * @param {PInput} source the source input element (s. PInputs)
     * @param ctx dictionary object with 'context', 'event' (change, focus)
     * @private
     */
    _onFocus(source, ctx) {
        // nothing to do
    }

    /**
     * Called when the panta.Artikel part has changed. This will persist the entity and set inform the source element to apply the change definitively so after this the
     * PInput's value is set and cannot be rolled back. This would also be a good place to make some input validation
     *
     * @param {PInput} source the source input element (s. PInputs)
     * @param ctx dictionary object with 'context', 'event' (change, focus)
     * @private
     */
    _onChange(source, ctx) {
        source.setProperty();
        this.persist.call(this, source.getBinding());
    }

    /**
     * Persist the artikel with the trelloApi
     * @param artikel the artikel to persist
     * @param cardId optionally the card id. if no id is specified it will use the currently opened card (scoped)
     */
    persist(artikel, cardId) {
        return this.trelloApi.set(cardId || 'card', 'shared', ArtikelController.SHARED_NAME, artikel);
    }

}