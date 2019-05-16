class PluginConfiguration {
    get card() {
        return this._card;
    }

    set card(value) {
        this._card = value;
    }

    get modules() {
        return this._modules;
    }

    set modules(value) {
        this._modules = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    static get VERSION() {
        return 1;
    }

    /**
     *
     * @param json
     * @returns {PluginConfiguration}
     */
    static create(json) {
        return this._create(json);
    }

    /**
     * @param json
     * @returns {PluginConfiguration}
     * @private
     */
    static _create(json) {
        if (json) {
            return new PluginConfiguration(
                JsonSerialization.getProperty(json, 'version') || '1.0.0',
                JsonSerialization.getProperty(json, 'description') || 'Dieses Panta.Card Power-Up umfasst das Modul:',
                JsonSerialization.getProperty(json, 'card'),
                this._readModules(json)
            )
        } else {
            return new PluginConfiguration("1.0.0", "Panta.Card Power-Up", null, []);
        }
    }

    static _readModules(json) {
        let modules = JsonSerialization.getProperty(json, 'modules') || {
            "1": JSON.stringify(new PluginModuleConfig("module.artikel", "Artikel", {}))
        };
        return Object.values(modules).map(function(module) {

            return PluginModuleConfig.create(module);
        })

    }

    /**
     *
     * @param version
     * @param description
     * @param card
     * @param modules
     */
    constructor(version, description, card, modules) {
        this._version = version;
        this._description = description;
        this._card = card;
        this._modules = modules || [];
    }

    /**
     * @returns {any[]}
     */
    getActiveModules() {
        return Object.values(this._modules).filter(function(value) {
            return value && value.config && value.config.enabled;
        });
    }

    /**
     * Get the module that matches the id. If onlyEnabled is `true` it will only search in active
     * modules
     * @param id
     * @param onlyEnabled
     * @return {any}
     */
    getModule(id, onlyEnabled) {
        return Object.values(this._modules).filter(function(value) {
            return value && value.config && (!onlyEnabled || value.config.enabled);
        }).find(function(module) {
            return module.id === id;
        });
    }

    /**
     * @returns {boolean}
     */
    hasActiveModules() {
        return this.getActiveModules().length > 0;
    }

}