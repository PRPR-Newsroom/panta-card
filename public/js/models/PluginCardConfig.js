/**
 * The plugin card configuration that is used to build the card-back-section
 */
class PluginCardConfig {
    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get icon() {
        return this._icon;
    }

    set icon(value) {
        this._icon = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }

    /**
     *
     * @param title
     * @param icon
     * @param {{file: string}} content
     */
    constructor(title, icon, content) {
        this._title = title;
        this._icon = icon;
        this._content = content;
    }
}