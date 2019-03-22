/**
 * Represents a switch item
 */
class SwitchItem extends AbstractItem {

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

    constructor(document, label, enabled) {
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
    }

    setOnActivationListener(handler) {
        this._onActivationHandler = handler;
        return this;
    }

    render() {
        let that = this;
        let templ = createByTemplate(template_settings_switch, template_settings_switch);

        templ.getElementsByClassName("switch-title").forEach(function (element) {
            element.innerText = that.label;
            // element.setAttribute("id", that.label);
        });

        that.decorate(templ);

        let container = templ.getClosestChildByClassName("panta-checkbox-container");
        let checkmark = container.getClosestChildByClassName("panta-js-checkbox");
        checkmark.checked = that.enabled;
        container.setEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let checkbox = e.srcElement
                .getClosestParentByClassName("panta-checkbox-container")
                .getClosestChildByClassName("panta-js-checkbox");
            checkbox.checked = !checkbox.checked;
            that._onActivationHandler(that.enabled, checkbox.checked)
                .then(function(checked) {
                    that.enabled = checked;
                });
        });

        return templ;
    }

}