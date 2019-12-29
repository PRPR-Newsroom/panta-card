/**
 * Represents a switch item
 */
class SwitchItem extends AbstractItem {
    get additionalStyles() {
        return this._additionalStyles;
    }

    set additionalStyles(value) {
        this._additionalStyles = value;
    }
    get readonly() {
        return this._readonly;
    }

    set readonly(value) {
        this._readonly = value;
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

    constructor(document, label, enabled, readonly = false) {
        super();
        this._document = document;
        /**
         * @type String
         */
        this._label = label;
        /**
         * @type Boolean
         */
        this._enabled = enabled;

        /**
         * @type {boolean}
         * @private
         */
        this._readonly = readonly;

        this._additionalStyles = "";
    }

    setOnActivationListener(handler) {
        this._onActivationHandler = handler;
        return this;
    }

    render() {
        const that = this;
        const templ = createByTemplate(template_settings_switch, template_settings_switch);

        if (!isBlank(that.label)) {
            templ.getElementsByClassName("switch-title").forEach(function (element) {
                element.innerText = that.label;
            });
        }

        that.decorate(templ);

        const container = templ.getClosestChildByClassName("panta-checkbox-container");
        if (!isBlank(this.additionalStyles)) {
            container.addClass(this.additionalStyles);
        }
        const checkmark = container.getClosestChildByClassName("panta-js-checkbox");
        if (that.enabled) {
            checkmark.setAttribute('checked', 'checked');
        } else {
            checkmark.removeAttribute('checked');
        }
        checkmark.disabled = this.readonly;
        if (!this.readonly) {
            container.setEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const checkbox = e.srcElement
                    .getClosestParentByClassName("panta-checkbox-container")
                    .getClosestChildByClassName("panta-js-checkbox");
                checkbox.checked = !checkbox.checked;
                that._onActivationHandler(that.enabled, checkbox.checked)
                    .then(function(checked) {
                        that.enabled = checked;
                    });
            });
        }

        return templ;
    }

}