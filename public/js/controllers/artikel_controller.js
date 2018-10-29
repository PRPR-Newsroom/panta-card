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

    constructor(document, trelloApi) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        this.trelloApi = trelloApi;
        /**
         * @type {Artikel}
         * @private
         */
        this._artikel = null;

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
        this._repository = new ArtikelRepository();

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
     * @param {Trello.Card} card
     */
    insert(artikel, card) {
        if (artikel && this._repository.isNew(artikel)) {
            this._repository.add(artikel);
        } else if (artikel) {
            this._repository.replace(artikel, card);
        }
    }

    /**
     * Get the artikel for the passed trello card
     * @param card
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
     * Get all artikels currently known
     * @returns {Array}
     */
    list() {
        return this._repository.all();
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
        this._artikel.total = this.getTotalPageCount();

        // calc price in involved
        this._artikel.getInvolvedFor('ad').total = this.getTotalPrice();

        this._artikelBinding.update(this._artikel);
        this._beteiligtBinding.update(this._artikel);
    }

    /**
     * Compute the total price over all artikels in the "ad"-involved section
     * @returns {number}
     */
    getTotalPrice() {
        return Object.values(this._repository.all()).map(function (item, index) {
            return item.getInvolvedFor('ad');
        }).filter(function (item, index) {
            return item instanceof AdBeteiligt && !isNaN(parseFloat(item.price));
        }).map(function (item, index) {
            return item.price;
        }).reduce(function (previousValue, currentValue) {
            return parseFloat(previousValue) + parseFloat(currentValue);
        }, 0.0);
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
        this._artikel = artikel ? artikel : Artikel.create();
        this._artikelBinding = this._artikelBinding ? this._artikelBinding.update(this._artikel) : new ArtikelBinding(this.document, this._artikel, this.onArtikelChanged, this).bind();
        this._beteiligtBinding = this._beteiligtBinding ? this._beteiligtBinding.update(this._artikel) : new BeteiligtBinding(this.document, this._artikel, this.onDataInvolvedChanged, this).bind();
    }

    /**
     * Called when the data in panta.Beteiligt has changed
     * @param source the source input element
     * @param args a dictionary object with 'context', 'valueHolder' and 'artikel'
     */
    onDataInvolvedChanged(source, args) {
        source.setProperty();

        let ctx = args['context'];
        let valueHolder = args['valueHolder'];
        let artikel = args['artikel'];
        let involved = source.getBinding();

        // update the involved part of the artikel
        artikel.putInvolved(valueHolder['involved-in'], involved);
        ctx._persistArtikel(ctx.trelloApi, artikel);
        console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
    }

    /**
     * Called when the panta.Artikel part has changed. This will persist the artikel and set inform the source element to apply the change definitively so after this the
     * PInput's value is set and cannot be rolled back. This would also be a good place to make some input validation
     *
     * @param source the source input element (s. PInputs)
     * @param ctx dictionary object with 'context' and 'artikel'
     */
    onArtikelChanged(source, ctx) {
        source.setProperty();
        ctx['context']._persistArtikel(ctx['context'].trelloApi, source.getBinding());
    }

    /**
     * Persist the artikel with the trelloApi
     * @param trelloApi the API
     * @param artikel the artikel to persist
     * @private
     */
    _persistArtikel(trelloApi, artikel) {
        trelloApi.set('card', 'shared', ArtikelController.SHARED_NAME, artikel);
    }

}