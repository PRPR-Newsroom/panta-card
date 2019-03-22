
class ModuleEditableItem extends AbstractItem {
    get module() {
        return this._module;
    }

    set module(value) {
        this._module = value;
    }
    get editable() {
        return this._editable;
    }

    set editable(value) {
        this._editable = value;
    }

    constructor(module, editable) {
        super();
        this._module = module;
        this._editable = editable;
    }

    /**
     * @param handler
     * @returns {ModuleEditableItem}
     */
    setOnEnterListener(handler) {
        this._onEnterHandler = handler;
        return this;
    }

    /**
     * Set the activation handler for this editable
     * @param handler
     * @return {ModuleEditableItem}
     */
    setOnActivationListener(handler) {
        this._onActivationHandler = handler;
        return this;
    }

    setOnColorPickerClick(handler) {
        this._onColorPickerHandler = handler;
        return this;
    }

    render() {
        let that = this;
        let template = createByTemplate(template_settings_editable, template_settings_editable);
        this.decorate(template);

        template.getElementsByClassName("module-editable-name").forEach(function (item) {
            if (item instanceof HTMLElement) {
                item.innerText = that.editable.label;
            }
        });

        template.setEventListener('click', function() {
            that._onEnterHandler(that.module, that.editable);
        });
        let container = template.getClosestChildByClassName("panta-checkbox-container");
        let checkmark = container.getClosestChildByClassName("panta-js-checkbox");
        checkmark.checked = that.editable.show === true;
        container.setEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                let checkbox = e.srcElement
                    .getClosestParentByClassName("panta-checkbox-container")
                    .getClosestChildByClassName("panta-js-checkbox");
                checkbox.checked = !checkbox.checked;
                that._onActivationHandler(that.module, that.editable, checkbox.checked);
            });

        let btnColor = template
            .getClosestChildByClassName("module-editable-color")
            .getClosestChildByClassName("panta-js-button");

        switch (that.editable.type) {
            case "label":
            case "layout":
                btnColor.addClass("hidden");
                break;
            default:
                btnColor
                    .addClass("panta-bgcolor-" + that.editable.color)
                    .removeClass("hidden")
                    .setEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        // open color picker
                        that._onColorPickerHandler(that.module, that.editable);
                    });
                break;
        }



        return template;
    }

}