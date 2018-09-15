class PInput {

    constructor(document, label, value, targetId, placeholder, type, readonly) {
        this._document = document;
        this._label = (label.length === 0 ? "" : label);
        this._value = value;
        this._name = "name_" + targetId;
        if (targetId.startsWith(".", 0)) {
            this._target = this._document.getElementsByClassName(targetId.substr(1)).item(0);
        } else {
            this._target = this._document.getElementById(targetId);
        }
        this._type = type;
        this._placeholder = placeholder;
        this._readonly = readonly;
        this._input = this._document.createElement(this._type);
        this._property = null;
        this._propertyType = "text";
    }

    get propertyType() {
        return this._propertyType;
    }

    set propertyType(value) {
        this._propertyType = value;
    }

    setPropertyType(propertyType) {
        this.propertyType = propertyType;
        return this;
    }

    bind(entity, property) {
        this._artikel = entity;
        this._property = property;
        this._value = entity[property];
        this._updateProperty();
        return this;
    }

    _updateProperty() {
        let propertyValue = this._artikel[this.getBoundProperty()];
        if (!propertyValue) {
            this._input.value = null;
        }
        switch (this.propertyType) {
            case "number":
                this._input.value = this._formatNumber(propertyValue);
                break;
            case "money":
                this._input.value = this._formatNumber(propertyValue, {minimumFractionDigits: 2});
                break;
            case 'text':
            default:
                this._input.value = propertyValue || "";
                break;
        }
    }

    update(artikel) {
        this._artikel = artikel;
        this._updateProperty();
        return this;
    }

    render() {
        let container = this._document.createElement("div");

        this._input.setAttribute("name", this._name);
        this._input.placeholder = this._placeholder;
        this._input.setAttribute("title", this._label);
        if (this._value) {
            this._updateProperty();
            if (this._type === 'textarea') {
                this._input.appendChild(this._document.createTextNode(this._value));
            }
        }
        if (this._type === 'input') {
            if (!this._readonly) {
                switch (this.propertyType) {
                    case "money":
                        // this._input.setAttribute("type", "number");
                        this._input.setAttribute("type", "text");
                        this._input.setAttribute("min", "0.00");
                        this._input.setAttribute("max", "1000000000.00");
                        this._input.setAttribute("step", "0.01");
                        break;
                    case "number":
                        // this._input.setAttribute("type", "number");
                        this._input.setAttribute("type", "text");
                        break;
                    default:
                        this._input.setAttribute("type", "text");
                        break;
                }
            } else {
                this._input.setAttribute("type", "text");
            }
        }
        if (this._readonly) {
            this._input.setAttribute("readonly", "readonly");
        }
        this._input.addClass(this.propertyType);

        this.setupEvents();

        this._input.addClass("u-border");

        let label = this._document.createElement("label");
        label.appendChild(this._document.createTextNode(this._label));
        label.setAttribute("for", this._input.getAttribute("name"));
        label.addClass("prop-" + this._type);
        container.appendChild(label);
        container.appendChild(this._input);

        if (this._label.length === 0) {
            container.setAttribute("class", "field hidden");
        } else {
            container.setAttribute("class", "field");
        }

        if (this._target instanceof HTMLCollection) {
            /**
             * @var HTMLCollection collection
             */
            let collection = this._target;
            for (let i=0;i<collection.length; i++) {
                collection.item(i).appendChild(container.cloneNode(true));
            }
        } else if (this._target !== null) {
            this._target.appendChild(container);
        }

        this.doCustomization(this._input, label);

        return this;
    }

    setupEvents() {
        this._setClassWhenEvent(this._input, 'focus', 'blur', 'focused');
        this._setClassWhenEvent(this._input, 'mouseenter', 'mouseleave', 'hovered');
    }

    _setClassWhenEvent(element, eventOn, eventOff, className) {
        element.setEventListener(eventOn, function (e) {
            let target = e.currentTarget;
            target.previousElementSibling.addClass(className);
        });
        this._input.setEventListener(eventOff, function (e) {
            let target = e.currentTarget;
            target.previousElementSibling.removeClass(className);
        });
    }



    onChange(func, ctx) {
        let that = this;
        this._input.onchange = function() {
            func(that, ctx);
        };
        return this;
    }

    doCustomization(element, label) {

    }

    getValue() {
        return this._input.value;
    }

    getBoundProperty() {
        return this._property;
    }

    getBinding() {
        return this._artikel;
    }

    setProperty() {
        switch (this.propertyType) {
            case "money":
            case "number":
                // either the input is formatted or just a plain number
                let parsed = this._parseNumber(this.getValue());
                this._artikel[this.getBoundProperty()] = parsed;
                break;
            default:
                this._artikel[this.getBoundProperty()] = this.getValue();
        }

    }

    _formatNumber(number, options) {
        let parsed = parseFloat(number);
        if (!isNaN(parsed)) {
            return parsed.toLocaleString(undefined, options);
        } else {
            return null;
        }
    }

    _parseNumber(number) {
        if (!number) {
            return null;
        }
        let decimal = 1.23.toLocaleString();
        let sep = decimal.substr(1,1);
        let re = new RegExp("[^\\d" + sep + "]");
        let parsed = parseFloat(number.replace(re, '').replace(sep, '.'));
        return isNaN(parsed) ? null : parsed;
    }

}

class MultiLineInput extends PInput {

    constructor(document, label, value, targetId, placeholder, rows, readonly) {
        super(document, label, value, targetId, placeholder, "textarea", !!readonly);
        this._rows = rows;
    }


    doCustomization(element, label) {
        element.setAttribute("rows", this._rows);
        return super.doCustomization(element);
    }
}

class SingleLineInput extends PInput {
    constructor(document, label, value, targetId, placeholder, readonly) {
        super(document, label, value, targetId, placeholder, "input", !!readonly);
    }
}

class SingleSelectInput extends PInput {
    constructor(document, label, value, targetId, placeholder, readonly) {
        super(document, label, value, targetId, placeholder, "select", !!readonly);
        this._options = [];
    }

    addOption(value, text) {
        this._options.push({
            "value": value,
            "text": text
        });
        return this;
    }

    doCustomization(element, label) {
        let that = this;
        this._options.forEach(function(item, _) {
            let opt = document.createElement("option");
            opt.value = item.value;
            opt.text = item.text;
            if (item.value === that._value) {
                opt.setAttribute("selected", "selected");
            }
            element.appendChild(opt);
        });
        label.addClass('focused-fix');
        return super.doCustomization(element);
    }
}
