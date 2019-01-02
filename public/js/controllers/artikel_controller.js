/**
 * Controller of artikels that let you manage multiple artikels
 *
 */
class ArtikelController {

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
        /**
         * @type {HTMLDocument}
         */
        this.document = windowManager.document;

        this._window = windowManager;

        this.trelloApi = trelloApi;
        /**
         * @type {Artikel}
         * @private
         */
        this._entity = null;

        /**
         * @type {ArtikelBinding}
         * @private
         */
        this._artikelBinding = null;

        /**
         * @type {BeteiligtBinding}
         * @private
         */
        this._beteiligtBinding = null;

        /**
         * @type {ArtikelRepository}
         * @private
         */
        this._repository = repository;

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

    /**
     * Insert the passed artikel into the repository and associates it with the given card
     * @param {Artikel} artikel
     * @param {{id: number}} card
     */
    insert(artikel, card) {
        if (artikel && this._repository.isNew(artikel)) {
            this._repository.add(artikel, card);
        } else if (artikel) {
            this._repository.replace(artikel, card);
        }
    }

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
     * Get the human readable name of that 'tag' (german)
     * @param tag
     * @returns {string|*}
     */
    getTagMapping(tag) {
        return ArtikelBinding.getTagMapping(tag);
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
        // calc total
        this._entity.total = this.getTotalPageCount();
        this._artikelBinding.update(this._entity);
    }

    /**
     * Block the UI because there's for example an upgrade going on
     */
    blockUi() {
        this._artikelBinding.blockUi();
    }

    canUnblock() {
        if (!this._window.clientManager.getPluginController().upgrading) {
            this._artikelBinding.unblock();
        }
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
     * @param (Artikel) artikel
     */
    render(artikel) {
        this._entity = artikel ? artikel : Artikel.create();
        this._artikelBinding = this._artikelBinding ? this._artikelBinding.update(this._entity) : new ArtikelBinding(this.document, this._entity, this.onEvent, this).bind();
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