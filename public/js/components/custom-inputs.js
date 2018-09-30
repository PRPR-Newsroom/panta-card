/**
 * Custom input element that will render a panta input with a label and input field
 *
 * @see MultiLineInput
 * @see SingleSelectInput
 * @see SingleLineInput
 */
class PInput {

    /**
     * @param document the DOM document
     * @param label a text for the label
     * @param value the initial value of the element
     * @param targetId the target HTML element to render this input to
     * @param placeholder a placeholder
     * @param type the type of input which can be one of 'input', 'textarea' or 'select'. this is used to create the input element
     * @param readonly flag to tell if this is a read-only element or not
     */
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

    /**
     * Bind the passed entity with the input field
     * @param entity the entity to bind to
     * @param property the bound property of the entity
     * @returns {PInput} itself (for fluent-programming)
     */
    bind(entity, property) {
        this._artikel = entity;
        this._property = property;
        this._value = entity[property];
        this._updateProperty();
        return this;
    }

    /**
     * Update the bound property of the input field
     * @private
     */
    _updateProperty() {
        // this should maybe use this._value instead of accessing the property directly. otherwise the _value property does not make much sense anymore
        let propertyValue = this._artikel[this.getBoundProperty()];
        if (!propertyValue) {
            this._input.value = null;
        }
        switch (this.propertyType) {
            case "number":
                this._updateValue(this._formatNumber(propertyValue));
                break;
            case "money":
                this._updateValue(this._formatNumber(propertyValue, {minimumFractionDigits: 2}));
                break;
            case 'text':
            default:
                this._updateValue(propertyValue || "");
                break;
        }
    }

    /**
     * Update the value of the input field if it is different. Otherwise it will do nothing
     * @param newValue the new value to set
     * @private
     */
    _updateValue(newValue) {
        if (this._input !== null && this._input.value !== newValue) {
            console.log("Setting value " + newValue + " (" + this._input.value + ")");
            this._input.value = newValue;
        }
    }

    /**
     * Set the given entity and update the underlying HTML element with the new property value
     * @param artikel
     * @returns {PInput}
     */
    update(artikel) {
        this._artikel = artikel;
        if (this._type !== 'select') {
            this._updateProperty();
        }
        return this;
    }

    /**
     * This will render this input field to the target element. If you need to do custom stuff you can override doCustomization as this
     * method will call it
     * @returns {PInput}
     */
    render() {
        let container = this._document.createElement("div");

        this._input.setAttribute("name", this._name);
        this._input.placeholder = this._placeholder;
        this._input.setAttribute("title", this._label);
        this._input.setAttribute("autocomplete", "new-password");
        if (this._value) {
            this._updateProperty();
        }
        this._renderType();
        if (this._readonly) {
            this._input.setAttribute("readonly", "readonly");
        }

        this._input.addClass(this.propertyType);
        this._input.addClass("u-border");

        this.setupEvents();

        let label = this._document.createElement("label");
        label.appendChild(this._document.createTextNode(this._label));
        label.setAttribute("for", this._input.getAttribute("name"));
        label.addClass("prop-" + this._type);
        if (this._label.length === 0) {
            container.setAttribute("class", "field hidden");
        } else {
            container.setAttribute("class", "field");
        }

        container.appendChild(label);
        container.appendChild(this._input);

        if (this._target) {
            this._target.appendChild(container);
        }
        this.doCustomization(this._input, label);

        return this;
    }

    /**
     * Set specific input attributes depending on its propertyType
     * @private
     */
    _renderType() {
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

    addClass(className) {
        this._input.addClass(className);
        return this;
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
            let formatted = parsed.toLocaleString(undefined, options);
            console.log("Formatting: " + number + " => " + formatted);
            return formatted;
        } else {
            return "";
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
        super(document, label, value, targetId, placeholder, "textarea", !!readonly);
    }

    doCustomization(element, label) {
        element.setAttribute("rows", 1);
        element.addClass('no-resize');
        return super.doCustomization(element, label);
    }
}

class SingleSelectInput extends PInput {
    constructor(document, label, value, targetId, placeholder, readonly) {
        super(document, label, value, targetId, placeholder, "select", !!readonly);
        this._options = [];
    }

    setEmpty(value, text) {
        this._options.splice(0, 0, {
            'value': value,
            'text': text,
            'empty': true
        });
        return this;
    }

    addOption(value, text) {
        this._options.push({
            "value": value,
            "text": text,
            "empty": false
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
