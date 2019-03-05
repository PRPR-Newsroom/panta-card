
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
        template.getClosestChildByClassName("panta-checkbox-container")
            .setEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                let checkbox = e.srcElement
                    .getClosestParentByClassName("panta-checkbox-container")
                    .getClosestChildByClassName("panta-js-checkbox");
                checkbox.checked = !checkbox.checked;
            });

        let btnColor = template
            .getClosestChildByClassName("module-editable-color")
            .getClosestChildByClassName("panta-js-button");
        btnColor.addClass("panta-bgcolor-" + that.editable.color);
        btnColor
            .setEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // open color picker
            });

        return template;
    }

}