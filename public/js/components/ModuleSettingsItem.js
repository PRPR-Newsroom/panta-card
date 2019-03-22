/**
 * Represents a settings item that accepts a module
 */
class ModuleSettingsItem extends AbstractItem{

    /**
     * @returns {PluginModuleConfig}
     */
    get module() {
        return this._module;
    }

    /**
     * @param {PluginModuleConfig} value
     */
    set module(value) {
        this._module = value;
    }
    get icon() {
        return this._icon;
    }

    set icon(value) {
        this._icon = value;
    }
    get enabled() {
        return this._enabled;
    }

    set enabled(value) {
        this._enabled = value;
    }
    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }
    get document() {
        return this._document;
    }

    constructor(document, module) {
        super();
        this._document = document;
        /**
         * @type PluginModuleConfig
         */
        this._module = module;
    }

    setOnEnterListener(handler) {
        this._onEnterHandler = handler;
        return this;
    }

    setOnActivationListener(handler) {
        this._onActivationHandler = handler;
        return this;
    }

    render() {
        let that = this;
        let templ = createByTemplate(template_settings_module, template_settings_module);
        templ.setEventListener('click', function (e) {
            // when the user clicks on a module we want to navigate to another page.
            that._onEnterHandler(that.module);
        });
        templ.getElementsByClassName("module-title").forEach(function (element) {
            element.innerText = that.module.name;
            element.setAttribute("id", that.module.id);
        });

        this.decorate(templ);

        templ.getClosestChildByClassName("panta-js-icon")
            .setAttribute("src", "./assets/" + that.module.config.icon);
        let container = templ.getClosestChildByClassName("panta-checkbox-container");
        let checkmark = container.getClosestChildByClassName("panta-js-checkbox");
        checkmark.checked = that.module.config.enabled;
        container.setEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                let checkbox = e.srcElement
                    .getClosestParentByClassName("panta-checkbox-container")
                    .getClosestChildByClassName("panta-js-checkbox");
                checkbox.checked = !checkbox.checked;
                that._onActivationHandler(that.module, checkbox.checked);
            });
        return templ;
    }

}