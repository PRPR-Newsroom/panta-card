/**
 * The client manager is the main instance that gives you access to the plugin. There's always only one instance
 * for a given windowManager (Window)
 */
class ClientManager {

    /**
     * Create the ClientManager instance bound to this windowManager
     * @param {Window} windowManager the window manager to be bound to
     * @param trello the trello API
     * @param options configuration
     * @return {ClientManager}
     */
    static getOrCreateClientManager(windowManager, trello, options) {
        if (!windowManager.hasOwnProperty('clientManager')) {
            windowManager.clientManager = new ClientManager(windowManager, trello, options);
            windowManager.addEventListener('beforeunload', function(e) {
                console.log("Window is unloading");
                if (e.target.defaultView instanceof Window && e.target.defaultView.clientManager) {
                    e.target.defaultView.clientManager.onUnload();
                    delete e.target.defaultView.clientManager;
                }
            });
        }
        return windowManager.clientManager;
    }

    /**
     * Get the client manager for this window manager if any
     * @param windowManager
     * @return {ClientManager}
     */
    static getInstance(windowManager) {
        return windowManager.clientManager;
    }

    constructor(windowManager, trello, options) {
        this._window = windowManager;
        this._trello = trello;
        this._initialized = false;
        this._options = options || {};
    }

    /**
     * Called when this window shuts down
     */
    onUnload() {
        // we could also check if there are some pending changes and then ask the user if he really wants to close this window ;-)
        delete this._articleController;
        delete this._moduleController;
        delete this._pluginController;
    }

    /**
     * Initialize this client. If this client has already been initialized it will do nothing
     */
    init() {
        if (!this._initialized) {
            this._articleController = ArtikelController.getInstance(this._trello, this._window);
            this._moduleController = ModuleController.getInstance(this._trello, this._window);
            this._pluginController = PluginController.getInstance(this._trello, this._window);
            this._initialized = true;
        }
        return this;
    }

    /**
     * Check if the article module is enabled
     * @return {boolean}
     */
    isArticleModuleEnabled() {
        return this._options.hasOwnProperty('module.artikel.enabled') && this._options['module.artikel.enabled'] === true;
    }

    /**
     * Check if the "Beteiligt" module is enabled
     * @return {boolean}
     */
    isBeteiligtModuleEnabled() {
        return this._options.hasOwnProperty('module.beteiligt.enabled') && this._options['module.beteiligt.enabled'] === true;
    }

    /**
     * Get the article controller for this client
     * @return {ArtikelController}
     */
    getArticleController() {
        return this._articleController;
    }

    /**
     * Get the module controller for this client
     * @return {ModuleController}
     */
    getModuleController() {
        return this._moduleController;
    }

    /**
     * Get the plugin controller for this client
     * @return {PluginController|*}
     */
    getPluginController() {
        return this._pluginController;
    }

}