class PModuleConfig {

    /**
     *
     * @param document
     * @param label will be removed soon and replaced by the "data-label" attribute in the HTML document
     * @param valueHolder
     */
    constructor(document, label, valueHolder) {
        this.document = document;
        this.label = label;
        /**
         * @type {{layout: string, renderer: renderer, data: null, tab: HTMLElement, "involved-in": *, binding: BeteiligtBinding, label: string}}
         */
        this.valueHolder = valueHolder;
        /**
         * Store the input fields as an associative array
         * @type {{}}
         */
        this.inputFields = {};
    }

    /**
     *
     * @param {ModuleConfig} entity
     * @param property
     * @returns {PModuleConfig}
     */
    bind(entity, property) {
        this._entity = entity;
        this._property = property;
        this.valueHolder.data = entity.sections[property];
        return this;
    }

    /**
     * This will render tab label and set the entity on the value holder
     *
     * @returns {PModuleConfig}
     */
    render() {
        this.update(this._entity);
        this.valueHolder.tab.innerHTML = "<span>" + (this.valueHolder.label || this.label) + "</span>";
        let that = this;
        this.valueHolder.tab.addEventListener('click', function (e) {
            that.activate();
        });
        return this;
    }

    /**
     * This updates the module config but not the input fields
     * @param {ModuleConfig} entity
     * @returns {PModuleConfig}
     */
    update(entity) {
        if (entity !== null) {
            this.valueHolder.data = entity.sections[this._property];
        }
        // set the new artikel entity on this form for current reference
        this._entity = entity;

        if (!this.valueHolder.data.isEmpty()) {
            this.valueHolder.tab.addClass("content");
        } else {
            this.valueHolder.tab.removeClass("content");
        }

        return this;
    }

    /**
     * This will call the renderer on this valueHolder (which typically will re-create the layout) and mark this tab
     * as 'selected' (css class)
     */
    activate() {
        this.valueHolder['renderer'].call(this, this.valueHolder);
        this.valueHolder.tab.addClass("selected");
    }

    /**
     *
     * @param name
     * @param {PInput} inputField
     */
    setField(name, inputField) {
        this.inputFields[name] = inputField;
    }

    /**
     * Set the field value
     *
     * @param key the key that was used to associate the field value in #setField
     * @param entity the entity that holds the data
     * @param property the property inside the entity
     */
    setFieldValue(key, entity, property) {
        let field = this.inputFields[key];
        if (field && field instanceof PInput) {
            field.bind(entity, property);
        }
    }

    /**
     * Enter editing mode by setting the editing marker class on the tab
     */
    beginEditing() {
        this.valueHolder.tab.addClass('editing');
    }

    /**
     * End editing mode by removing the marker class on the tab
     */
    endEditing() {
        this.valueHolder.tab.removeClass('editing');
    }

}