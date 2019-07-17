class ModuleEditableTextItem extends AbstractItem {
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    constructor(value, deletable, visibleSwitch) {
        super();
        this._value = value;
        this._deletable = deletable;
        this._visibleSwitch = visibleSwitch;
    }

    setOnTextChangeListener(handler) {
        this._onTextChangeListener = handler;
        return this;
    }

    setOnDeleteListener(handler) {
        this._onDeleteListener = handler;
        return this;
    }

    setOnVisibleToggleListener(handler) {
        this._onVisibleToggleListener = handler;
        return this;
    }

    setOnReadyListener(handler) {
        this._onReadyListener = handler;
        return this;
    }

    render() {
        let that = this;
        let template = createByTemplate(template_settings_editable_option, template_settings_editable_option);
        // this.decorate(template);
        template.getElementsByClassName("module-editable-option-name").forEach(function (item) {
            if (item instanceof HTMLElement) {
                let name = item.getClosestChildByClassName("panta-js-name");
                name.setEventListener('change', function (e) {
                    that._value = that._onTextChangeListener(that.value, e.srcElement.value);
                });
                name.value = that.value;
            }
        });
        template.getElementsByClassName("panta-js-delete").forEach(function (item) {
            if (item instanceof HTMLElement) {
                if (that._deletable) {
                    item.removeClass("hidden");
                    item.setEventListener('click', function (e) {
                        that._onDeleteListener(that.value);
                    })
                } else {
                    item.addClass("hidden");
                }
            }
        });
        template.getElementsByClassName("panta-js-visible").forEach(function (item) {
            if (item instanceof HTMLElement) {
                if (that._visibleSwitch) {
                    item.removeClass("hidden");
                    item.setEventListener('click', function (e) {
                        that._onVisibleToggleListener();
                    });
                } else {
                    item.addClass("hidden");
                }
            }
            let ico = item.getClosestChildByTagName("img");
            ico.setAttribute("src", "assets/ic_invisible.png");
        });
        if (that._onReadyListener) {
            that._onReadyListener(template);
        }

        return template;
    }

}