/*
Some helper functions that make life easier ;-)
 */

HTMLElement.prototype.addClass = function (name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) === -1) {
        this.className += " " + name;
        this.className = this.className.trim();
    }
};

HTMLElement.prototype.removeClass = function (name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) !== -1) {
        let new_names = "";
        names.forEach(function (value, index) {
            if (value !== name) {
                new_names += " " + value;
            }
        });
        this.className = new_names.trim();
    }
};

HTMLElement.prototype.removeChildren = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

HTMLElement.prototype.setEventListener = function(event, callback) {
    this.removeEventListener(event, callback);
    this.addEventListener(event, callback);
};

HTMLCollection.prototype.forEach = function(item, callback) {
    for (let i=0; i<this.length; i++) {
        callback(this[i]);
    }
};

function uuid() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

HTMLDocument.prototype.newMultiLineInput = function (valueHolder, targetId, property, label, actionParameters, actionCallback, rows = 2, placeholder = "") {
    return new MultiLineInput(this, label, null, targetId, placeholder, rows, false)
        .bind(valueHolder.data, property)
        .onChange(actionCallback, actionParameters)
        .render();
};

HTMLDocument.prototype.newSingleLineInput = function (valueHolder, targetId, property, label, actionParameters, actionCallback, placeholder = "", propertyType = "text", readonly = false) {
    let sli = new SingleLineInput(this, label, null, targetId, placeholder, readonly);
    sli.propertyType = propertyType || "text";

    if (property !== null) {
        sli.bind(valueHolder.data, property);
    }
    sli.onChange(actionCallback, actionParameters)
        .render();
    return sli;
};

HTMLDocument.prototype.newSingleSelect = function(valueHolder, targetId, property, label, actionParameters, actionCallback, placeholder = "", empty, options) {
    let ssi = new SingleSelectInput(this, label, null, targetId, placeholder)
        .bind(valueHolder.data, property)
        .onChange(actionCallback, actionParameters);
    options.forEach(function(item, index) {
        ssi.addOption(item.value, item.text);
    });
    ssi.setEmpty(empty.value, empty.text);
    return ssi.render();
};

function isBlank(totest) {
    return (!totest || 0 === (totest + "").trim().length);
}