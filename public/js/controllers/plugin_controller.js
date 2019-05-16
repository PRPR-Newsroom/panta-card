class PluginController {

    /**
     * The app version
     * @returns {number}
     */
    static get VERSION() {
        return 3;
    }

    /**
     * The name that is used to store the plugin version in trello
     * @returns {string}
     */
    static get SHARED_NAME() {
        return "panta.App";
    }

    /**
     * The name that is used to store the plugin configuration in trello
     * @returns {string}
     */
    static get CONFIGURATION_NAME() {
        return "panta.App.Configuration";
    }

    static getInstance(trelloApi, windowManager) {
        if (!windowManager.hasOwnProperty('pluginController')) {
            windowManager.pluginController = new PluginController(trelloApi, windowManager);
        }
        return windowManager.pluginController;
    }

    constructor(trelloApi, windowManager) {
        this._window = windowManager;
        this._trelloApi = trelloApi;
        this._upgrading = false;
        this._upgrades = {
            1: this._upgrade_1,
            2: this._upgrade_2
        }
        /**
         * @type {PluginRepository}
         * @private
         */
        this._repository = PluginRepository.INSTANCE;
    }

    /**
     * Initialize this plugin
     *
     * Check the version and set the upgrading flag
     */
    init() {
        let that = this;
        // because for switching between version 1 and 2 this helps to downgrade
        // that._trelloApi.set('board', 'shared', PluginController.SHARED_NAME, 1)
        //     .then(function() {
        //         that._trelloApi.get('board', 'shared', PluginController.SHARED_NAME, 1)
        //             .then(function (data) {
        //                 if (PluginController.VERSION > data) {
        //                     that._upgrading = true;
        //                     that.update.call(that, data, PluginController.VERSION);
        //                 }
        //             });
        //     })
        this._trelloApi.get('board', 'shared', PluginController.SHARED_NAME, 1)
            .then(function (data) {
                if (PluginController.VERSION > data) {
                    that._upgrading = true;
                    that.update.call(that, data, PluginController.VERSION);
                }
            });
    }

    /**
     * Get the plugin configuration of this board
     *
     * @returns {PromiseLike<PluginConfiguration>|Promise<PluginConfiguration>}
     */
    getPluginConfiguration() {
        // Endpoint: https://trello.com/1/boards/<ID>/pluginData
        let that = this;
        return this._trelloApi.get(
            'board',
            'shared',
            PluginController.CONFIGURATION_NAME,
            null
        ).then(function (data) {
            if (data) {
                let json = JSON.parse(LZString.decompress(data));
                return PluginConfiguration.create(json);
            } else {
                return new PluginConfiguration(
                    "1.0.0",
                    "Panta.Card Power-Up",
                    null,
                    that.getAvailableModules()
                );
            }
        });
    }

    /**
     * @param {PluginModuleConfig} pmc
     * @param card (optional) if set it will also store the new card configuration on the plugin configuration
     * @return {PromiseLike<T> | Promise<T>}
     */
    setPluginModuleConfig(pmc, card) {
        let that = this;
        return this.getPluginConfiguration()
            .then(function (pc) {
                if (pc instanceof PluginConfiguration) {
                    pc.card = card || pc.card;
                    let item = pc.modules.find(function (item) {
                        return item.id === pmc.id;
                    });
                    item.config = pmc.config;

                    that._trelloApi.set('board', 'shared', PluginController.CONFIGURATION_NAME, LZString.compress(JSON.stringify(pc)));
                    return pc;
                } else {
                    throw "Invalid plugin configuration";
                }
            })
    }

    /**
     * @param id
     * @return {PluginModuleConfig}
     */
    findPluginModuleConfigByModuleId(id) {
        return this.getPluginConfiguration()
            .then(function (pc) {
                return pc.modules;
            })
            .filter(function (module) {
                return module.id === id;
            })
            .reduce(function (prev, cur) {
                prev = cur;
                return prev;
            }, null);
    }

    getAvailableModules() {
        return Object.values(PluginRepository.INSTANCE.all()).sort(function (lhs, rhs) {
            return lhs.config.sort - rhs.config.sort;
        });
    }

    /**
     * Remove the plugin data for this board
     *
     * @returns {Promise} the promise of that delete request
     */
    remove() {
        return this._trelloApi.remove('board', 'shared', PluginController.SHARED_NAME);
    }

    /**
     * Update routine
     * @param oldVersion the old version
     * @param newVersion the new version
     */
    update(oldVersion, newVersion) {
        // https://trello.com/1/boards/JqfSsy3y/pluginData
        let that = this;
        // do the update for each missed version...
        that._update(oldVersion, newVersion);
    }

    /**
     * Apply the updates recursively until the targetVersion has been reached
     * @param oldVersion
     * @param targetVersion
     * @private
     */
    _update(oldVersion, targetVersion) {
        let that = this;
        if (oldVersion < targetVersion) {
            console.log("Applying upgrade %d ...", oldVersion);
            that._upgrades[oldVersion].call(this).then(function () {
                console.log("... upgrade %d is successfully applied", oldVersion);
                that._trelloApi.set('board', 'shared', PluginController.SHARED_NAME, oldVersion + 1).then(function () {
                    that._update(oldVersion + 1, targetVersion);
                });
            });
        } else {
            console.log("No upgrades pending");
            setTimeout(function () {
                that._upgrading = false;
            }, 2000);

        }
    }

    /**
     * Perform upgrade from version 1. This upgrade separates article from involvements in order to use them individually
     * @private
     */
    _upgrade_1() {
        let that = this;

        let ac = this._window.clientManager.getArticleController();
        let mc = this._window.clientManager.getModuleController();

        return ac.fetchAll.call(ac).then(function () {
            that._upgradeAllArticleToModuleConfig.call(that, ac, mc)
        }).then(function () {
            return true;
        });
    }

    /**
     * Perform upgrade from 2 -> 3
     * @private
     */
    _upgrade_2() {
        return Promise.resolve(true);
    }

    /**
     * Upgrade the articles involvements to module configs
     * @param {ArtikelController} ac the article controller
     * @param {ModuleController} mc the moduleconfig controller
     * @private
     */
    _upgradeAllArticleToModuleConfig(ac, mc) {
        this._upgradeArticleToModuleConfig.call(this, ac, mc, Object.entries(ac.list()), 0);
    }

    /**
     *
     * @param {ArtikelController} ac
     * @param {ModuleController} mc
     * @param {Array} articles
     * @param {Number} index
     * @private
     */
    _upgradeArticleToModuleConfig(ac, mc, articles, index) {
        if (index < articles.length) {
            let that = this;
            let entry = articles[index];
            let cardId = entry[0];
            let article = entry[1];
            if (article.version === 1) {
                // only update if the article is still on version 1 because articles with newer versions are already using module configs
                let mconfig = Object.entries(article.involved).reduce(function (previous, entry) {
                    let section = entry[0];
                    let involved = entry[1];
                    previous.sections[section] = involved;
                    return previous;
                }, ModuleConfig.create());

                // persist the module config
                mc.persist.call(mc, mconfig, cardId)
                    .then(function () {
                            article.version = Artikel.VERSION;
                            if (typeof article.clearInvolved === "function") {
                                article.clearInvolved();
                            }
                            return ac.persist.call(ac, article, cardId);
                        }
                    )
                    // and then proceed with the next article
                    .then(function () {
                        that._upgradeArticleToModuleConfig.call(that, ac, mc, articles, index + 1, cardId)
                    });

            } else {
                console.log("Skipping article because its at version %d", article.version);
                this._upgradeArticleToModuleConfig.call(this, ac, mc, articles, index + 1, cardId);
            }
        } else {
            console.log("All articles updated");
        }

    }

    get upgrading() {
        return this._upgrading;
    }
}