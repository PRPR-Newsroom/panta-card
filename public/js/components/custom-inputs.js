class PInput {

    constructor(document, label, value, targetId, placeholder, type, readonly) {
        this._document = document;
        this._label = (label.length === 0 ? "" : label);
        this._value = value;
        this._name = "name_" + targetId;
        this._target = this._document.getElementById(targetId);
        this._type = type;
        this._placeholder = placeholder;
        this._readonly = readonly;
        this._onchange = function() {};
        this._input = this._document.createElement(this._type);
        this._property = null;
    }

    bind(entity, property) {
        this._entity = entity;
        this._property = property;
        this._value = entity[property];
        return this;
    }

    update() {
        this._input.value = this.getValue();
        return this;
    }

    render() {
        let container = this._document.createElement("div");

        this._input.setAttribute("name", this._name);
        this._input.placeholder = this._placeholder;
        this._input.setAttribute("title", this._label);
        if (this._value) {
            this._input.value = this._value;
            if (this._type === 'textarea') {
                this._input.appendChild(this._document.createTextNode(this._value));
            }
        }
        if (this._type === 'input') {
            this._input.setAttribute("type", "text");
        }
        if (this._readonly) {
            this._input.setAttribute("readonly", "readonly");
        }

        this.doCustomization(this._input);

        let label = this._document.createElement("label");
        label.appendChild(this._document.createTextNode(this._label));
        label.setAttribute("for", this._input.getAttribute("name"));
        container.appendChild(this._input);
        container.appendChild(label);

        if (this._label.length === 0) {
            container.setAttribute("class", "field hidden");
        } else {
            container.setAttribute("class", "field");
        }

        this._target.appendChild(container);
        return this;
    }

    onChange(func, ctx) {
        let that = this;
        this._input.onchange = function() {
            func(that, ctx);
        };
        return this;
    }

    doCustomization(element) {

    }

    getValue() {
        return this._input.value;
    }

    getBoundProperty() {
        return this._property;
    }

    getBinding() {
        return this._entity;
    }

    setProperty() {
        this._entity[this.getBoundProperty()] = this.getValue();
    }
}

class MultiLineInput extends PInput {

    constructor(document, label, value, targetId, placeholder, rows, readonly) {
        super(document, label, value, targetId, placeholder, "textarea", !!readonly);
        this._rows = rows;
    }


    doCustomization(element) {
        element.setAttribute("rows", this._rows);
        return super.doCustomization(element);
    }
}

class SingleLineInput extends PInput {
    constructor(document, label, value, targetId, placeholder, readonly) {
        super(document, label, value, targetId, placeholder, "input", !!readonly);
    }
}

