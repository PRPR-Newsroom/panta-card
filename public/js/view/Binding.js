/**
 *
 * @abstract
 */
class Binding {

    constructor(document, entity, action, context, configuration) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        /**
         * @type {}
         */
        this._entity = entity;

        /**
         * The action to be called when data has changed
         */
        this._action = action;

        /**
         * The context that is passed to the data change action handler
         */
        this._context = context;

        this._autoUpdater = null;

        /**
         * @type {PluginModuleConfig}
         */
        this._configuration = configuration;
    }

    /**
     *
     * @param entity
     * @param configuration
     *
     * @returns {Binding}
     * @abstract
     */
    update(entity, configuration) {

    }

    /**
     *
     * @returns {Binding}
     * @abstract
     */
    bind() {

    }

    /**
     * Detach the UI
     * @abstract
     */
    detach() {

    }

    /**
     * Blocks the UI by
     * @returns {Promise<T>|PromiseLike<T>}
     */
    blockUi() {
        if (this.document.getElementsByClassName('overlay').length > 0) {
            return Promise.resolve(true);
        }
        let that = this;
        let overlay = this.document.createElement("div");
        overlay.addClass("overlay");

        overlay.appendChild(this.document.createTextNode("Plugin Daten werden aktualisiert..."));

        this.document.getElementsByTagName("body").item(0).appendChild(overlay);
        this._autoUpdater = this._autoUpdater || setInterval(function() {
            that._context.canUnblock();
        }, 500);
        return Promise.resolve(true);
    }

    /**
     * Unblock the UI
     */
    unblock() {
        this.document.getElementsByClassName("overlay").forEach(function(item) {
            item.parentNode.removeChild(item);
        });
        if (this._autoUpdater) {
            clearInterval(this._autoUpdater);
        }
    }

    /**
     *
     * @param configuration
     * @abstract
     */
    updateConfiguration(configuration) {}

    /**
     * @param {PInput} field
     * @param id
     */
    updateField(field, id) {
        let config = this.getConfigurationFor(id);
        if (config.editable.visible === false) {
            field.hide();
        } else {
            field.show();
        }

        if (field instanceof SingleLineInput) {
            this._updateText(field, id);
        } else if (field instanceof MultiLineInput) {
            this._updateText(field, id);
        } else if (field instanceof SingleSelectInput) {
            this._updateSelect(field, id);
        }
    }

    /**
     * @param {SingleLineInput|MultiLineInput} text
     * @param id
     * @private
     */
    _updateText(text, id) {
        let config = this.getConfigurationFor(id);
        text.setLabel(config.editable.label);
        text.setPlaceholder(config.editable.placeholder);
    }

    /**
     * @param {SingleSelectInput} select
     * @param id
     * @private
     */
    _updateSelect(select, id) {
        let oc = this.getConfigurationFor(id);
        select.clear();
        select.setLabel(oc.label);
        select.addOption("-1", "…");
        select.addOptions(oc.options);
        select.invalidate();
    }

    getConfigurationFor(id) {
        let editable = this._configuration.config.editables
            .filter(function (editable) {
                return editable.id === id;
            });

        let label = editable[0].label;

        let options = editable
            .map(function (editable) {
                return editable.values;
            })
            .flat()
            .map(function (value, index) {
                return newOption(index, value);
            })
            .reduce(function (prev, cur) {
                prev.push(cur);
                return prev;
            }, []);

        return {
            "label": label,
            "options": options,
            "editable": editable[0]
        };
    }
}
