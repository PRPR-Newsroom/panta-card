
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

    render() {
        let that = this;
        let template = createByTemplate(template_settings_editable_option, template_settings_editable_option);
        // this.decorate(template);

        template.getElementsByClassName("module-editable-option-name").forEach(function (item) {
            if (item instanceof HTMLElement) {
                item.getClosestChildByClassName("panta-js-name").value = that.value;
            }
        });

        return template;
    }

}