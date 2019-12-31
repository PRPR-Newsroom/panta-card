/**
 * The plugin module config provides all necessary information about a plugin which is a unique ID, a name and plugin specific
 * config
 */
class PluginModuleConfig {

    /**
     * @return {{sort: number, enabled: boolean, layouts: {}, editables: {id: string, desc: string, visible: boolean, type: string, values: string[]?}[]}}
     */
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

    /**
     * @param id
     * @return {{id: string, desc: string, visible: boolean, layout: string?, type: string, values: string[]?}}
     */
    getEditable(id) {
        return this.config.editables.find(it => it.id  === id);
    }

    getEditableOptionValue(id, value) {
        const editable = this.getEditable(id);
        return editable && editable.values ? editable.values.indexOf(value) : -1;
    }

    /**
     * Get the layout configuration for the given editable
     * @param id the id of the editable
     * @return {{desc: string, label: string, fields: {id: string, label: string, type: string}[]}}
     */
    getEditableLayout(id) {
        const editable = this.getEditable(id);
        if (editable.type === 'layout') {
            return this.config.layouts[editable.layout];
        }
    }

    constructor(id, name, config) {
        this._id = id;
        this._name = name;
        this._config = config;
    }

    static create(json) {
        return new PluginModuleConfig(
            JsonSerialization.getProperty(json, "id"),
            JsonSerialization.getProperty(json, "name"),
            JsonSerialization.getProperty(json, "config")
        )
    }
}