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
    }

    bind(entity, property) {
        this._artikel = entity;
        this._property = property;
        this._value = entity[property] || 0.0;
        return this;
    }

    update(artikel) {
        this._artikel = artikel;
        this._input.value = this._artikel[this.getBoundProperty()];
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
        return this._artikel;
    }

    setProperty() {
        this._artikel[this.getBoundProperty()] = this.getValue();
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

    doCustomization(element) {
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
        return super.doCustomization(element);
    }
}
