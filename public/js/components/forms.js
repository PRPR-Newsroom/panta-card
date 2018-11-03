
class PForms {

    constructor(document, label, valueHolder) {
        this.document = document;
        this.label = label;
        /**
         * @type {{data: null, renderer: renderer, tab: HTMLElement | null}}
         */
        this.valueHolder = valueHolder;
    }

    bind(entity, property) {
        this._artikel = entity;
        this._property = property;
        this.valueHolder.data = entity.getInvolvedFor(property);
        return this;
    }

    render() {
        this.update(this._artikel);
        this.valueHolder.tab.innerHTML = "<span>" + this.label + "</span>";
        let that = this;
        this.valueHolder.tab.addEventListener('click', function(e) {
            that.activate();
        });
        return this;
    }

    update(artikel) {
        if (artikel !== null) {
            this.valueHolder.data = artikel.getInvolvedFor(this._property);
        }
        // set the new artikel entity on this form for current reference
        this._artikel = artikel;

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