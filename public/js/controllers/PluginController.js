class PluginController {

    /**
     * The app version
     * @returns {number}
     */
    static get VERSION() {
        return 6;
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
            2: this._upgrade_2,
            3: this._upgrade_3_to_4,
            4: this._upgrade_4_to_5,
            5: this._upgrade_5_to_6,
        };
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
        const that = this;
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
        const that = this;
        return this._trelloApi.get(
            'board',
            'shared',
            PluginController.CONFIGURATION_NAME,
            null
        ).then(function (data) {
            if (data) {
                return PluginConfiguration.create(JSON.parse(LZString.decompress(data)));
            } else {
                return new PluginConfiguration(
                    VERSION,
                    "Panta.Card Power-Up",
                    null,
                    that.getAvailableModules()
                );
            }
        });
    }

    /**
     * @return {Promise<{configuration: DataConfiguration}>}
     */
    getAdminConfiguration() {
        const that = this;
        return that._trelloApi.get('board', 'private', AdminController.PROPERTY_BAG_NAME, null).then(data => {
            return that._parseAdminConfiguration(data);
        });
    }

    /**
     *
     * @return {Promise<string>} the base64 encoded and compressed configuration
     */
    setAdminConfiguration(config) {
        const that = this;
        if (config) {
            return this.getAdminConfiguration()
                .then(it => {
                    // merge the configs
                    if (config.hasOwnProperty('export_configuration')) {
                        it['export_configuration'] = config.export_configuration;
                    }
                    if (config.hasOwnProperty('configuration')) {
                        it['configuration'] = config.configuration;
                    }
                    return it;
                })
                .then(it => {
                    const compress = LZString.compress(JSON.stringify(it));
                    return this._trelloApi.set('board', 'private', AdminController.PROPERTY_BAG_NAME, compress)
                        .then(() => Base64.encode(compress));
                });
        } else {
            return that.getAdminConfiguration()
                .then(it => {
                    return Base64.encode(LZString.compress(JSON.stringify(it)));
                });
        }
    }

    /**
     * @return {Promise<{configuration: DataConfiguration}>}
     */
    resetAdminConfiguration() {
        const that = this;
        return this._trelloApi.remove('board', 'private', AdminController.PROPERTY_BAG_NAME)
            .then(() => that.getAdminConfiguration());
    }

    /**
     * @return {Promise<{configuration: DataConfiguration}>}
     */
    parseAdminConfiguration(str) {
        return Promise.resolve(this._createAdminConfiguration(JSON.parse(str)));
    }

    /**
     * @return {{configuration: DataConfiguration}}
     */
    _parseAdminConfiguration(data) {
        try {
            if (isString(data) && !isBlank(data)) {
                const raw = JSON.parse(LZString.decompress(data) || '{ "configuration": null, "export_configuration": null }');
                return this._createAdminConfiguration(raw);
            } else {
                return this._createAdminConfiguration();
            }
        } catch (ex) {
            throw new Error(`Could not read configuration: ${Base64.encode(data)}`);
        }
    }

    _createAdminConfiguration(raw) {
        const config = {};
        if (raw && raw.hasOwnProperty('configuration')) {
            config.configuration = DataConfiguration.create(raw.configuration);
        } else {
            config.configuration = DataConfiguration.create();
        }

        if (raw && raw.hasOwnProperty('export_configuration')) {
            config.export_configuration = DataConfiguration.create(raw.export_configuration);
        } else {
            config.export_configuration = DataConfiguration.create();
        }

        return config;
    }

    /**
     * @param {PluginModuleConfig} pmc
     * @param card (optional) if set it will also store the new card configuration on the plugin configuration
     * @return {PromiseLike<T> | Promise<T>}
     */
    setPluginModuleConfig(pmc, card) {
        const that = this;
        return this.getPluginConfiguration()
            .then(function (pc) {
                if (pc instanceof PluginConfiguration) {
                    pc.card = card || pc.card;
                    const item = pc.modules.find(function (item) {
                        return item.id === pmc.id;
                    });
                    item.config = pmc.config;

                    console.debug("Set new plugin configuration", pc);
                    that._trelloApi.set('board', 'shared', PluginController.CONFIGURATION_NAME, LZString.compress(JSON.stringify(pc)));
                    return pc;
                } else {
                    throw "Invalid plugin configuration";
                }
            })
    }

    /**
     * @param id
     * @return {PromiseLike<PluginModuleConfig>}
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

    /**
     * @return {PromiseLike<PluginModuleConfig[] | never> | Promise<PluginModuleConfig[] | never>}
     */
    getEnabledModules() {
        return this.getPluginConfiguration()
            .then(it => {
                return it.modules.filter(it => it.config.enabled);
            });
    }

    /**
     * Get all available modules (also modules that are disabled)
     * @return {PluginModuleConfig[]}
     */
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
        // do the update for each missed version...
        this._update(oldVersion, newVersion);
    }

    /**
     * Apply the updates recursively until the targetVersion has been reached
     * @param oldVersion
     * @param targetVersion
     * @private
     */
    _update(oldVersion, targetVersion) {
        const that = this;
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
        const that = this;

        const ac = this._window.clientManager.getArticleController();
        const mc = this._window.clientManager.getModuleController();

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
     * Perform upgrade from 3 -> 4
     * @return {*}
     * @private
     */
    _upgrade_3_to_4() {
        return this._trelloApi.getRestApi().clearToken();
    }

    /**
     * Upgrade the editable field «field.e» in Artikel to be sortable
     * @return {PromiseLike<PluginModuleConfig | never>}
     * @private
     * @since 1.5.15
     */
    _upgrade_4_to_5() {
        const that = this;
        return this.findPluginModuleConfigByModuleId(ArtikelController.ID)
            .then(it => {
                const pagina = it.getEditable('field.e');
                if (pagina) {
                    pagina.sortable = true;
                    return that.setPluginModuleConfig(it)
                        .then(it => {
                            return that.getPluginConfiguration();
                        })
                } else {
                    return that.getPluginConfiguration();
                }
            });
    }

    /**
     * Upgrade the blog layout by removing two fields (folllower and date)
     * @return {PromiseLike<boolean | never>}
     * @private
     */
    _upgrade_5_to_6() {
        const that = this;
        return this.findPluginModuleConfigByModuleId(ModuleController.ID)
            .then(it => {
                if (it.config.layouts.hasOwnProperty('blog')) {
                    console.debug(`Upgrading layout «blog» by removing fields «field.follower» and «field.date»`);
                    it.config.layouts['blog'].fields = it.config.layouts['blog'].fields
                        .filter(it => it.id !== "field.follower" && it.id !== "field.date");
                    return that.setPluginModuleConfig(it)
                        .then(it => that.getPluginConfiguration());
                }
                return that.getPluginConfiguration();
            });
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
            const that = this;
            const entry = articles[index];
            const cardId = entry[0];
            const article = entry[1];
            if (article.version === 1) {
                // only update if the article is still on version 1 because articles with newer versions are already using module configs
                if (article.involved) {
                    const mconfig = Object.entries(article.involved).reduce(function (previous, entry) {
                        const section = entry[0];
                        const involved = entry[1];
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
                    // if there's no involved data then just update the version and proceed to the next item
                    console.log("The article does not have any involved data. Just update the version of the article and proceed to the next item.");
                    article.version = Artikel.VERSION;
                    return ac.persist.call(ac, article, cardId)
                    // and then proceed with the next article
                        .then(function () {
                            that._upgradeArticleToModuleConfig.call(that, ac, mc, articles, index + 1, cardId)
                        });
                }

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