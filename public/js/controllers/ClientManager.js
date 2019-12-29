/**
 * The client manager is the main instance that gives you access to the plugin. There's always only one instance
 * for a given windowManager (Window)
 */
class ClientManager {

    static VERSION() {
        return 1;
    }

    static assertClientManager(windowManager, trello, options) {
        ClientManager.getOrCreateClientManager(windowManager, trello, options).init();
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
                    windowManager._manager = e.target.defaultView.clientManager;
                    delete windowManager._manager;
                }
            });
            windowManager.addEventListener('keypress', function (e) {
                if (e.keyCode === 127) {
                    // delete
                    windowManager.clientManager.flushKeyBuffer.call(windowManager.clientManager);
                } else if (e.keyCode === 13 || e.keyCode === 10) {
                    let buffer = windowManager.clientManager.readKeyBuffer.call(windowManager.clientManager);
                    if (buffer === 'remove') {
                        windowManager.clientManager.removePluginData.call(windowManager.clientManager);
                        windowManager.clientManager.flushKeyBuffer.call(windowManager.clientManager);
                    }
                } else {
                    windowManager.clientManager.appendKeyBuffer.call(windowManager.clientManager, e.key);
                }
            })
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
             * @type {PluginController}
             * @private
             */
            this._pluginController = PluginController.getInstance(this._trello, this._window);

            /**
             * @type {ArtikelController}
             * @private
             */
            this._articleController = ArtikelController.getOrCreateInstance(this._trello, this._window, this._telephones[ArtikelController.SHARED_NAME].port2);
            /**
             * @type {ModuleController}
             * @private
             */
            this._moduleController = ModuleController.getInstance(this._trello, this._window, this._telephones[ModuleController.SHARED_NAME].port2);

            /**
             * @type {ModulePlanController}
             * @private
             */
            this._planController = ModulePlanController.getInstance(this._trello, this._window, this._telephones[ModulePlanController.SHARED_NAME].port2);

            this._excelService = new ExcelService();

            this._initialized = true;
        }
        return this;
    }

    _createMessageChannel() {
        let that = this;
        let mc = new MessageChannel();
        mc.port1.onmessage = function (ev) {
            console.debug("Received data from sub-module: " + JSON.stringify(ev.data));
            let req = ev.data;
            // handle GET requests
            Object.values(req.get || []).forEach(function (item) {
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
                    case 'costs:overall':
                        that._getOverallCosts();
                        break;
                }
            }, that);
            // handle GET responses
            Object.values(req.result || []).forEach(function (item) {
                Object.entries(item).forEach(function (item) {
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

    _getOverallCosts() {
        this._telephones[ModuleController.SHARED_NAME].port1.postMessage({
            'get': ['costs:overall']
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
        console.debug("Key Buffer: " + this._keyBuffer);
        if (this._keyBuffer.length > 256) {
            this._keyBuffer = "";
        }
    }

    /**
     * Check if the article module is enabled
     * @return {PromiseLike<T> | Promise<T>}
     */
    isArticleModuleEnabled() {
        return this._isModuleEnabled(ArtikelController.ID);
    }

    /**
     * Check if the "Beteiligt" module is enabled
     * @return {PromiseLike<T> | Promise<T>}
     */
    isBeteiligtModuleEnabled() {
        return this._isModuleEnabled(ModuleController.ID);
    }

    /**
     * Return true if the "Plan" module is enabled
     * @return {PromiseLike<T> | Promise<T>}
     */
    isPlanModuleEnabled() {
        return this._isModuleEnabled("module.plan");
    }

    /**
     * Get the module configuration by its id
     * @param id
     * @return {PromiseLike<PluginModuleConfig> | Promise<PluginModuleConfig>}
     */
    getModuleConfiguration(id) {
        return this.getPluginController().getPluginConfiguration()
            .then(function (configuration) {
                return configuration.getModule(id, false);
            });
    }

    /**
     * Get the controller by its id
     * @param id
     * @return {Controller}
     */
    getController(id) {
        switch (id) {
            case ArtikelController.ID:
                return this.getArticleController();
            case "module.beteiligt":
                return this.getModuleController();
            case "module.plan":
                return this.getPlanController();
            default:
                throw "Invalid ID: " + id;
        }
    }

    /**
     *
     * @param id
     * @return {PromiseLike<T> | Promise<T>}
     * @private
     */
    _isModuleEnabled(id) {
        return this._pluginController.getPluginConfiguration()
            .then(function (configuration) {
                return configuration.getActiveModules().find(function (module) {
                    return module.id === id;
                });
            });
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
     * @return {ExcelService}
     */
    getExcelService() {
        return this._excelService;
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

    /**
     * Get the article module sorter context
     *
     * @return {{name: string, configuration: configuration, sorters: sorters}}
     */
    getArticleModuleSorters() {
        let that = this;
        return {
            "name": "module.artikel.sorters",
            "configuration": function() {
                return that.getModuleConfiguration("module.artikel");
            },
            "sorters": function(configuration) {
                if (configuration.config.enabled) {
                    return configuration.config.editables
                        .filter(function(editable) {
                            return editable.sortable && editable.type === "select";
                        })
                        .map(function(sortable) {
                            return {
                                text: "Artikel: " + sortable.label + " (Position in Liste)",
                                callback: function(t,opts) {
                                    return that.sortOnSelect(that.getControllerWith(that.getArticleController(), opts), opts, "asc", function(article) {
                                        if (article instanceof Artikel) {
                                            // TODO either rename all tags to online (upgrade script needed) or extract it to a mapper
                                            let mapped = sortable.id;
                                            switch (sortable.id) {
                                                case "online":
                                                    mapped = "tags";
                                                    break;
                                                case "place":
                                                    mapped = "location";
                                                    break;
                                            }
                                            return sortable.values.indexOf(article[mapped]);
                                        } else {
                                            return Number.MAX_VALUE;
                                        }
                                    });
                                }
                            }
                        })
                        .reduce(function(prev, cur) {
                            prev.push(cur);
                            return prev;
                        }, [{
                            text: "Artikel: Pagina (1 -> 99)",
                            callback: function (t, opts) {
                                return that.sortOnNumber(that.getControllerWith(that.getArticleController(), opts), opts, "asc", function(article) {
                                    return article.pagina;
                                });
                            }
                        }]);

                } else {
                    return [];
                }
            }
        }
    }

    /**
     * Get the plan module sorters
     * @return {{name: string, configuration: configuration, sorters: sorters}}
     */
    getPlanModuleSorters() {
        let that = this;
        return {
            "name": "module.plan.sorters",
            "configuration": function() {
                return that.getModuleConfiguration("module.plan");
            },
            "sorters": function(configuration) {
                if (configuration.config.enabled) {
                    let sorters = configuration.config.editables
                        .filter(function(editable) {
                            return editable.sortable && editable.type === "select";
                        })
                        .map(function(sortable) {
                            return {
                                text: "Plan: " + sortable.label + " (Position in Liste)",
                                callback: function(t,opts) {
                                    return that.sortOnSelect(that.getControllerWith(that.getPlanController(), opts), opts, "asc", function(entity) {
                                        if (entity instanceof Plan) {
                                            return sortable.values.indexOf(entity[sortable.id]);
                                        } else {
                                            return Number.MAX_VALUE;
                                        }
                                    });
                                }
                            }
                        })
                        .reduce(function(prev, cur) {
                            prev.push(cur);
                            return prev;
                        }, []);
                    return sorters;

                } else {
                    console.log("sorters: the module is «Plan» is not enabled");
                    return [];
                }
            }
        }
    }

    /**
     * Get the plan module badges
     * @param card
     * @return {{condition: PromiseLike<T>|Promise<T>, on: on, card: card, configuration: PromiseLike<T>|Promise<T>}}
     */
    getPlanModuleContext(card) {
        let that = this;
        return {
            "id": "module.plan",
            "shared": ModulePlanController.SHARED_NAME,
            "card": card,
            "configuration": that.getModuleConfiguration("module.plan"),
            "condition": that.isPlanModuleEnabled(),
            "on": function () {
                let badges = [];
                let entity = that.getPlanController().getByCard(card);
                if (that.getPlanController().hasContent(entity)) {
                    badges.push({
                        text: "",
                        icon: './assets/ic_plan.png'
                    });
                }
                return that.getModuleConfiguration("module.plan")
                    .then(function(pmc) {
                        return pmc.config.editables;
                    })
                    .filter(function(editable) {
                        let val = that.getPlanController().getMapping(editable, entity, null);
                        return val !== null && editable.show === true;
                    })
                    .map(function(editable) {

                        return {
                            "text": editable.label + ": " + that.getPlanController().getMapping(editable, entity, "-"),
                            "color": editable.color
                        };
                    })
                    .reduce(function(prev, cur) {
                        prev.push(cur);
                        return prev;
                    }, badges);
            }

        };
    }

    /**
     * Get the beteiligt module badges
     * @param card
     * @return {{condition: PromiseLike<T>|Promise<T>, on: on, card: card}}
     */
    getBeteiligtModuleContext(card) {
        let that = this;
        return {
            "id": "module.beteiligt",
            "shared": ModuleController.SHARED_NAME,
            "card": card,
            "configuration": that.getModuleConfiguration("module.beteiligt"),
            "condition": that.isBeteiligtModuleEnabled(),
            "on": function () {
                let badges = [];
                let config = that.getModuleController().getByCard(card);
                if (config instanceof ModuleConfig) {
                    let sections = config.getContentCount();
                    if (sections > 0) {
                        badges.push({
                            text: sections,
                            icon: './assets/ic_beteiligt.png'
                        });
                    }
                }
                return badges;

            }
        };
    }

    /**
     * Create a module condition
     * @param card
     * @return {{condition: PromiseLike<T>|Promise<T>, on: on, card: card}}
     */
    getArticleModuleContext(card) {
        let that = this;
        return {
            "id": "module.artikel",
            "shared": ArtikelController.SHARED_NAME,
            "card": card,
            "configuration": that.getModuleConfiguration("module.artikel"),
            "condition": that.isArticleModuleEnabled(),
            "on": function () {
                let badges = [];
                let entity = that.getArticleController().getByCard(card);
                if (that.getArticleController().hasContent(entity)) {
                    badges.push({
                        text: "",
                        icon: './assets/ic_artikel.png'
                    });
                }

                return that.getModuleConfiguration("module.artikel")
                    .then(function(pmc) {
                        return pmc.config.editables;
                    })
                    .filter(function(editable) {
                        let val = that.getArticleController().getMapping(editable, entity, null);
                        return val && editable.show === true;
                    })
                    .map(function(editable) {

                        return {
                            "text": editable.label + ": " + that.getArticleController().getMapping(editable, entity, ""),
                            "color": editable.color
                        };
                    })
                    .reduce(function(prev, cur) {
                        prev.push(cur);
                        return prev;
                    }, badges);
            }
        };
    }

    /**
     * Get the controller initialized with all cards in opts
     *
     * @param {Controller} controller
     * @param {{cards: []}} opts
     * @return {*}
     */
    getControllerWith(controller, opts) {

        for (let index in opts.cards) {
            let card = opts.cards[index];
            let entity = controller.getByCard(card);
            if (entity && !card.closed) {
                controller.insert(entity, card);
            }
        }
        return controller;
    }

    /**
     * @param {Controller} controller
     * @param {{cards: []}} opts
     * @param sort
     * @param provider
     * @return {{sortedIds: any[]}}
     */
    sortOnNumber(controller, opts, sort, provider) {
        let sortedCards = opts.cards.sort(
            function (lhs_card, rhs_card) {
                let lhs = controller.getByCard(lhs_card);
                let rhs = controller.getByCard(rhs_card);
                let lhsp = lhs ? parseFloat(provider(lhs) || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
                let rhsp = rhs ? parseFloat(provider(rhs) || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
                if (lhsp > rhsp) {
                    return sort === "asc" ? 1 : -1;
                } else if (rhsp > lhsp) {
                    return sort === "asc" ? -1 : 1;
                }
                return 0;
            });

        return {
            sortedIds: sortedCards.map(function (c) {
                return c.id;
            })
        };
    }

    sortOnSelect(controller, opts, sort, provider) {
        let sortedCards = opts.cards.sort(
            function (lhs_card, rhs_card) {
                let lhs = controller.getByCard(lhs_card);
                let rhs = controller.getByCard(rhs_card);
                let lhsp = lhs ? provider(lhs) : Number.MAX_VALUE;
                let rhsp = rhs ? provider(rhs) : Number.MAX_VALUE;
                if (lhsp > rhsp) {
                    return sort === "asc" ? 1 : -1;
                } else if (rhsp > lhsp) {
                    return sort === "asc" ? -1 : 1;
                }
                return 0;
            });

        return {
            sortedIds: sortedCards.map(function (c) {
                return c.id;
            })
        };
    }

}