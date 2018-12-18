/*
Some helper functions that make life easier ;-)
 */

/**
 * Add a CSS class to the element if it does not yet exist
 * @param name
 * @returns {HTMLElement} itself
 */
HTMLElement.prototype.addClass = function (name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) === -1) {
        this.className += " " + name;
        this.className = this.className.trim();
    }
    return this;
};

/**
 * Add a conditional formatting rule
 * @param closure
 */
HTMLElement.prototype.addConditionalFormatting = function(closure) {
    if (!this.conditionalFormatting) {
        this.conditionalFormatting = [];
    }
    this.conditionalFormatting.push(closure);
};

HTMLElement.prototype.applyConditionalFormatting = function (entity) {
    (this.conditionalFormatting||[]).forEach(function(closure) {
        let rule = closure.call(this, entity);
        this.removeClass(rule.name + "-not");
        this.removeClass(rule.name);
        if (rule.active) {
            this.addClass(rule.name);
        } else {
            this.addClass(rule.name + "-not");
        }
    }, this);
};

/**
 * Remove all CSS classes on this HTML element
 * @param names
 */
HTMLElement.prototype.removeClasses = function(names) {
    let that = this;
    names.forEach(function(name, index) {
        that.removeClass(name);
    });
};

/**
 * Removes a CSS class on an HTML element if it exists
 * @param name
 * @returns {HTMLElement} itself
 */
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
    return this;
};

/**
 * Remove all children of an HTML element
 */
HTMLElement.prototype.removeChildren = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

/**
 * (Re-)Set an event listener on this HTML element
 * @param event
 * @param callback
 */
HTMLElement.prototype.setEventListener = function(event, callback) {
    this.removeEventListener(event, callback);
    this.addEventListener(event, callback);
};

/**
 * Calls the callback for each HTML element
 * @param callback the callback function that accepts this HTML element as its argument
 */
HTMLCollection.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i]);
    }
};

/**
 * Generate a pseudo random UUID
 * @return {string}
 */
function uuid() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/**
 * Create a new MultiLineInput
 * @param valueHolder
 * @param targetId
 * @param property
 * @param label
 * @param actionParameters
 * @param actionCallback
 * @param rows
 * @param placeholder
 * @returns {PInput}
 */
// TODO extract similar parts for all Input creations (such as event handlers)

HTMLDocument.prototype.newMultiLineInput = function (valueHolder, targetId, property, label, actionParameters, actionCallback, rows = 2, placeholder = "") {
    return new MultiLineInput(this, label, null, targetId, placeholder, rows, false)
        .bind(valueHolder.data, property)
        .onFocus(actionCallback, actionParameters)
        .onEnterEditing(actionCallback, actionParameters)
        .onChange(actionCallback, actionParameters)
        .render();
};

HTMLDocument.prototype.newSingleLineInput = function (valueHolder,
                                                      targetId,
                                                      property,
                                                      label,
                                                      actionParameters,
                                                      actionCallback,
                                                      placeholder = "",
                                                      propertyType = "text",
                                                      readonly = false) {
    let sli = new SingleLineInput(this, label, null, targetId, placeholder, readonly);
    sli.propertyType = propertyType || "text";

    if (property !== null) {
        sli.bind(valueHolder.data, property);
    }
    let noop = function() {};
    sli.onFocus(actionCallback, actionParameters)
        .onEnterEditing(actionCallback, actionParameters)
        .onChange(readonly ? noop : actionCallback, actionParameters)
        .render();
    return sli;
};

/**
 * Create a single select element and bind the valueHolder with the target id for the given
 * property. The label describes that select element
 * @param valueHolder
 * @param targetId
 * @param property
 * @param label
 * @param actionParameters passed to the actionCallback when the value changes
 * @param actionCallback the callback function that is called when a change is detected
 * @param placeholder
 * @param empty an object with 'value' and 'text' that is used when the user did not select anything
 * @param options an array of {value/text} options
 * @returns {SingleSelectInput}
 */
HTMLDocument.prototype.newSingleSelect = function (valueHolder, targetId, property, label, actionParameters, actionCallback, placeholder = "", empty, options) {
    let ssi = new SingleSelectInput(this, label, null, targetId, placeholder)
        .bind(valueHolder.data, property)
        .onFocus(actionCallback, actionParameters)
        .onEnterEditing(actionCallback, actionParameters)
        .onChange(actionCallback, actionParameters);
    options.forEach(function (item, index) {
        ssi.addOption(item.value, item.text);
    });
    ssi.setEmpty(empty.value, empty.text);
    return ssi.render();
};

/**
 * Check if a string is considered
 * @param totest
 * @returns {boolean}
 */
Window.prototype.isBlank = function(totest) {
    return (!totest || 0 === (totest + "").trim().length);
};

/**
 * A helper function to create new options
 * @param value
 * @param text
 * @returns {{value: *, text: *}}
 */
function newOption(value, text) {
    return {
        'value': value,
        'text': text
    };
}