/**
 * This class represents the configuration of a module
 */
class PluginConfiguration {

    get card() {
        return this._card;
    }

    set card(value) {
        this._card = value;
    }

    /**
     * @return {PluginModuleConfig[]}
     */
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
                VERSION,
                JsonSerialization.getProperty(json, 'description') || 'Dieses Panta.Card Power-Up umfasst das Modul:',
                JsonSerialization.getProperty(json, 'card'),
                this._readModules(json)
            )
        } else {
            return new PluginConfiguration(VERSION, "Panta.Card Power-Up", null, []);
        }
    }

    static _readModules(json) {
        const modules = JsonSerialization.getProperty(json, 'modules') || {
            "1": JSON.stringify(new PluginModuleConfig("module.artikel", "Artikel", {}))
        };
        return Object.values(modules).map(function(module) {
            let moduleConfig = PluginModuleConfig.create(module);
            let pmc = PluginRepository.INSTANCE.find(function(config) {
                return config.id === moduleConfig.id;
            });
            if (isSet(pmc) && pmc instanceof PluginModuleConfig) {
                let newconfig = JSON.parse(JSON.stringify(pmc.config));
                let currentconfig = JSON.parse(JSON.stringify(moduleConfig.config));
                // console.log("Merging newconfig and currentconfig", newconfig, currentconfig);
                const merged = extend(newconfig, currentconfig);
                moduleConfig.config = merged;
            }
            return moduleConfig;
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
        /**
         * @type {PluginModuleConfig[]}
         * @private
         */
        this._modules = modules || [];
    }

    /**
     * @returns {PluginModuleConfig[]}
     */
    getActiveModules() {
        return Object.values(this._modules).filter(function(value) {
            return value && value.config && value.config.enabled;
        }).sort(function(lhs, rhs) {
            return lhs.config.sort - rhs.config.sort;
        });
    }

    /**
     * Get the module that matches the id. If onlyEnabled is `true` it will only search in active
     * modules
     * @param id
     * @param onlyEnabled
     * @return {PluginModuleConfig}
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