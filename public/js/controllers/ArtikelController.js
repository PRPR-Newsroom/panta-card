/**
 * Controller of artikels that let you manage multiple artikels
 *
 */
class ArtikelController extends Controller {

    static get ID() {
        return "module.artikel";
    }
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
    static getOrCreateInstance(trelloApi, windowManager, telephone) {
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
        super(windowManager, repository, trelloApi);
        /**
         * @type {HTMLDocument}
         */
        this.document = windowManager.document;

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

    create(json, configuration) {
        return Artikel.create(json);
    }

    /**
     * Get a property value by its name
     * @param {Artikel|Plan|ModuleConfig} entity
     * @param context
     * @param name
     * @param defaultValue
     * @return {*}
     */
    getPropertyByName(entity, context, name, defaultValue) {
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
                return entity.topic || defaultValue;
            case "field.b":
                return entity.from || defaultValue;
            case "field.c":
                return entity.author || defaultValue;
            case "field.d":
                return entity.text || defaultValue;
            case "field.e":
                return entity.pagina || defaultValue;
            case "field.f":
                return entity.layout || defaultValue;
            case "field.g":
                return entity.total || defaultValue;
            default:
                if (entity.hasOwnProperty(name)) {
                    return entity[name];
                } else {
                    return entity[name];
                }
        }
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

    getSharedName() {
        return ArtikelController.SHARED_NAME;
    }
}