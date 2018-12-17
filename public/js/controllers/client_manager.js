/**
 * The client manager is the main instance that gives you access to the plugin. There's always only one instance
 * for a given windowManager (Window)
 */
class ClientManager {

    static VERSION() {
        return 1;
    }

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
            windowManager.addEventListener('beforeunload', function (e) {
                if (e.target.defaultView instanceof Window && e.target.defaultView.clientManager) {
                    e.target.defaultView.clientManager.onUnload();
                    delete e.target.defaultView.clientManager;
                }
            });
            // windowManager.addEventListener('keypress', function (e) {
            //     if (e.keyCode === 127) {
            //         // delete
            //         windowManager.clientManager.flushKeyBuffer.call(windowManager.clientManager);
            //     } else if (e.keyCode === 13 || e.keyCode === 10) {
            //         let buffer = windowManager.clientManager.readKeyBuffer.call(windowManager.clientManager);
            //         if (buffer === 'remove') {
            //             windowManager.clientManager.removePluginData.call(windowManager.clientManager);
            //             windowManager.clientManager.flushKeyBuffer.call(windowManager.clientManager);
            //         }
            //     } else {
            //         windowManager.clientManager.appendKeyBuffer.call(windowManager.clientManager, e.key);
            //     }
            // })
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
        this._keyBuffer = "";
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
            this._telephones = {};

            this._telephones[ArtikelController.SHARED_NAME] = this._createMessageChannel();
            this._telephones[ModuleController.SHARED_NAME] = this._createMessageChannel();
            this._telephones[PluginController.SHARED_NAME] = this._createMessageChannel();
            this._telephones[ModulePlanController.SHARED_NAME] = this._createMessageChannel();

            /**
             * @type {ArtikelController}
             * @private
             */
            this._articleController = ArtikelController.getInstance(this._trello, this._window, this._telephones[ArtikelController.SHARED_NAME].port2);
            /**
             * @type {ModuleController}
             * @private
             */
            this._moduleController = ModuleController.getInstance(this._trello, this._window, this._telephones[ModuleController.SHARED_NAME].port2);
            /**
             * @type {PluginController}
             * @private
             */
            this._pluginController = PluginController.getInstance(this._trello, this._window);

            /**
             * @type {ModulePlanController}
             * @private
             */
            this._planController = ModulePlanController.getInstance(this._trello, this._window, this._telephones[ModulePlanController.SHARED_NAME].port2);

            this._initialized = true;
        }
        return this;
    }

    _createMessageChannel() {
        let that = this;
        let mc = new MessageChannel();
        mc.port1.onmessage = function(ev) {
            console.log("Received data from sub-module: " + JSON.stringify(ev.data));
            let req = ev.data;
            Object.values(req.get || []).forEach(function(item) {
                switch (item) {
                    case "fee:current":
                        that._getCurrentFee();
                        break;
                    case "fee:overall":
                        that._getOverallFee();
                        break;
                    case "charge:current":
                        that._getCurrentCharge();
                        break;
                    case "charge:overall":
                        that._getOverallCharge();
                        break;
                }
            }, that);
            Object.values(req.result||[]).forEach(function(item) {
                Object.entries(item).forEach(function(item) {
                    let property = item[0];
                    let value = item[1];
                    this._sendResponse(ModulePlanController.SHARED_NAME, property, value);
                }, this);
            }, that);

        };
        return mc;
    }

    _sendResponse(controller, property, value) {
        let dto = {};
        dto[property] = value;
        this._telephones[controller].port1.postMessage({
            'result': [dto]
        })
    }

    _getCurrentCharge() {
        this._telephones[ModuleController.SHARED_NAME].port1.postMessage({
            'get': ['charge:current']
        });
    }

    _getCurrentFee() {
        this._telephones[ModuleController.SHARED_NAME].port1.postMessage({
            'get': ['fee:current']
        });
    }

    _getOverallCharge() {
        this._telephones[ModuleController.SHARED_NAME].port1.postMessage({
            'get': ['charge:overall']
        });
    }

    _getOverallFee() {
        this._telephones[ModuleController.SHARED_NAME].port1.postMessage({
            'get': ['fee:overall']
        });
    }

    readKeyBuffer() {
        return this._keyBuffer;
    }

    flushKeyBuffer() {
        this._keyBuffer = "";
    }

    appendKeyBuffer(chr) {
        this._keyBuffer += chr;
        console.log("Key Buffer: " + this._keyBuffer);
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
     * Return true if the "Plan" module is enabled
     * @return {boolean}
     */
    isPlanModuleEnabled() {
        return this._options.hasOwnProperty('module.plan.enabled') && this._options['module.plan.enabled'] === true;
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
     * @return {PluginController}
     */
    getPluginController() {
        return this._pluginController;
    }

    /**
     * Get the Plan controller
     * @returns {ModulePlanController}
     */
    getPlanController() {
        return this._planController;
    }

    /**
     * Remove all plugin data on that board
     */
    removePluginData() {
        let that = this;
        this._pluginController.remove()
            .then(function () {
                return that._moduleController.removePropertyBag();
            })
            .then(function () {
                return that._planController.remove();
            })
            .then(function () {
                console.log("All board data cleared");
            });
    }
}