/**
 * The plugin module config provides all necessary information about a plugin which is a unique ID, a name and plugin specific
 * config
 */
class PluginModuleConfig {

    get config() {
        return this._config;
    }

    set config(value) {
        this._config = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    constructor(id, name, config) {
        this._id = id;
        this._name = name;
        this._config = config;
    }

}