
class ModuleEditableSelectItem extends AbstractItem {
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    constructor(value) {
        super();
        /**
         * @type {Array}
         * @private
         */
        this._options = [];

        this._value = value;
    }

    addOption(opt) {
        this._options.push(opt)
    }

    setOnTextChangeListener(handler) {
        this._onTextChangeListener = handler;
        return this;
    }

    render() {
        let that = this;
        let template = createByTemplate(template_settings_editable_select, template_settings_editable_select);
        // this.decorate(template);
        template.getElementsByClassName("module-editable-select-container").forEach(function (item) {
            if (item instanceof HTMLElement) {
                let select = item.getClosestChildByClassName("panta-js-select");
                select.setEventListener('change', function(e) {
                    that._value = that._onTextChangeListener(that.value, e.srcElement.value);
                });
                that._options.forEach(function(cur) {
                    select.appendChild(cur);
                });
                select.value = that.value;
            }
        });

        return template;
    }

}