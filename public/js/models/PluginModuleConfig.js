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

    /**
     * Get the index of this option value. If the option is not found by text it will return the value as the index
     * if the value is a number otherwise -1 is returned
     * @param id
     * @param value if null it will return -1 immediatly
     * @return {number}
     */
    getEditableOptionValue(id, value) {
        if (value == null) {
            return -1;
        }
        const editable = this.getEditable(id);
        if (editable != null && editable.values) {
            // because users are making mistakes it makes sense to ignore case
            const idx = editable.values.map(it => it.toLowerCase().trim()).indexOf(`${value}`.toLowerCase().trim());
            if (idx !== -1) {
                return idx;
            }
        }
        return isNumber(value) ? value : -1;
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