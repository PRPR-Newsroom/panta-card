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
    }

    render() {
        let container = this._document.createElement("div");

        let input = this._document.createElement(this._type);
        input.setAttribute("name", this._name);
        input.placeholder = this._placeholder;
        input.setAttribute("title", this._label);
        if (this._value) {
            input.value = this._value;
            if (this._type === 'textarea') {
                input.appendChild(this._document.createTextNode(this._value));
            }
        }
        if (this._type === 'input') {
            input.setAttribute("type", "text");
        }
        if (this._readonly) {
            input.setAttribute("readonly", "readonly");
        }

        this.custom(input);

        let label = this._document.createElement("label");
        label.appendChild(this._document.createTextNode(this._label));
        label.setAttribute("for", input.getAttribute("name"));
        container.appendChild(input);
        container.appendChild(label);

        if (this._label.length === 0) {
            container.setAttribute("class", "field hidden");
        } else {
            container.setAttribute("class", "field");
        }

        this._target.appendChild(container);
    }

    custom(element) {

    }
}

class MultiLineInput extends PInput {

    constructor(document, label, value, targetId, placeholder, rows, readonly) {
        super(document, label, value, targetId, placeholder, "textarea", !!readonly);
        this._rows = rows;
    }


    custom(element) {
        element.setAttribute("rows", this._rows);
        return super.custom(element);
    }
}

class SingleLineInput extends PInput {
    constructor(document, label, value, targetId, placeholder, readonly) {
        super(document, label, value, targetId, placeholder, "input", !!readonly);
    }
}

