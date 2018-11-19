class PluginController {

    /**
     * The app version
     * @returns {number}
     */
    static get VERSION() {
        return 2;
    }

    /**
     * The name that is used to store the artikels in trello
     * @returns {string}
     */
    static get SHARED_NAME() {
        return "panta.App";
    }

    constructor(trelloApi) {
        this._trelloApi = trelloApi;
        this._upgrading = false;
        this._upgrades = {
            1: this._upgrade_1
        }
    }

    /**
     * Initialize this plugin
     *
     * Check the version and set the upgrading flag
     */
    init() {
        let that = this;
        that._trelloApi.set('board', 'shared', PluginController.SHARED_NAME, 1).then(function() {
            that._trelloApi.get('board', 'shared', PluginController.SHARED_NAME, 1)
                .then(function (data) {
                    if (PluginController.VERSION > data) {
                        that._upgrading = true;
                        that.update.call(that, data, PluginController.VERSION);
                    }
                }); 
        });
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
                that._trelloApi.set('board', 'shared', PluginController.SHARED_NAME, oldVersion+1);
                that._update(oldVersion + 1, targetVersion);
            });
        } else {
            console.log("No upgrades pending");
        }
    }

    /**
     * Perform upgrade from version 1. This upgrade separates article from involvements in order to use them individually
     * @private
     */
    _upgrade_1() {
        let that = this;
        let ac = ArtikelController.getInstance(this._trelloApi);
        let mc = ModuleController.getInstance(this._trelloApi);
        // clear all module configs first
        let result = Promise.all([mc.fetchAll.call(mc, function () {
            mc.clear.call(mc);
        }), ac.fetchAll.call(ac, function () {
            that._upgradeArticleToModuleConfig.call(that, ac, mc);
        })]);

        return result.then(function () {
            return true;
        });
    }

    /**
     * Upgrade the articles involvements to module configs
     * @param {ArtikelController} ac the article controller
     * @param {ModuleController} mc the moduleconfig controller
     * @private
     */
    _upgradeArticleToModuleConfig(ac, mc) {
        Object.entries(ac.list()).forEach(function (entry) {
            let cardId = entry[0];
            /**
             * @type {Artikel}
             */
            let article = entry[1];
            if (article.version === 1) {
                // only update if the article is still on version 1 because articles with newer versions are already using module configs
                let mconfig = Object.entries(article.involved).reduce(function (previous, entry) {
                    let section = entry[0];
                    let involved = entry[1];
                    previous.sections[section] = involved;
                    return previous;
                }, ModuleConfig.create());

                mc.persist.call(mc, mconfig, cardId);
                article.version = Artikel.VERSION;
                article.clearInvolved();
                ac.persist.call(ac, article, cardId);
            }

        });
    }

    get upgrading() {
        return this._upgrading;
    }
}