
class ModuleEditableTextItem extends AbstractItem {
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    constructor(value) {
        super();
        this._value = value;
    }

    setOnTextChangeListener(handler) {
        this._onTextChangeListener = handler;
        return this;
    }

    setOnDeleteListener(handler) {
        this._onDeleteListener = handler;
        return this;
    }

    render() {
        let that = this;
        let template = createByTemplate(template_settings_editable_option, template_settings_editable_option);
        // this.decorate(template);
        template.getElementsByClassName("module-editable-option-name").forEach(function (item) {
            if (item instanceof HTMLElement) {
                let name = item.getClosestChildByClassName("panta-js-name");
                name.setEventListener('change', function(e) {
                    that._value = that._onTextChangeListener(that.value, e.srcElement.value);
                });
                name.value = that.value;
            }
        });
        template.getElementsByClassName("panta-js-delete").forEach(function(item) {
            if (item instanceof HTMLElement) {
                item.setEventListener('click', function(e) {
                    that._onDeleteListener(that.value);
                })
            }
        });

        return template;
    }

}