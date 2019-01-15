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

    static create(json) {
        return this._create(json);
    }

    static _create(json) {
        if (json) {
            return new PluginConfiguration(
                JsonSerialization.getProperty(json, 'version') || '1.0.0',
                JsonSerialization.getProperty(json, 'description') || 'Dieses Panta.Card Power-Up umfasst das Modul:',
                JsonSerialization.getProperty(json, 'card'),
                JsonSerialization.getProperty(json, 'modules') || [{"id": 'module.artikel', "name": "Artikel"}]
            )
        } else {
            return null;
        }
    }

    constructor(version, description, card, modules) {
        this._version = version;
        this._description = description;
        this._card = card;
        this._modules = modules || [];
    }

}