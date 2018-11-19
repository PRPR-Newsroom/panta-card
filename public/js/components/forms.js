
class PModuleConfig {

    constructor(document, label, valueHolder) {
        this.document = document;
        this.label = label;
        /**
         * @type {{data: null, renderer: renderer, tab: HTMLElement | null}}
         */
        this.valueHolder = valueHolder;
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

    render() {
        this.update(this._entity);
        this.valueHolder.tab.innerHTML = "<span>" + this.label + "</span>";
        let that = this;
        this.valueHolder.tab.addEventListener('click', function(e) {
            that.activate();
        });
        return this;
    }

    /**
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

    activate() {
        this.valueHolder['renderer'].call(this, this.valueHolder);
        this.valueHolder.tab.addClass("selected");
    }
}