class BeteiligtBinding {

    constructor(document, config, action, context) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        /**
         * @type {ModuleConfig}
         */
        this._config = config;

        this._action = action;

        this._context = context;

        this._involvements = {
            'onsite': this._buildValueHolder('onsite', 'pa.involved.onsite', this.onRegularLayout),
            'text': this._buildValueHolder('text', 'pa.involved.text', this.onRegularLayout),
            'photo': this._buildValueHolder('photo', 'pa.involved.photo', this.onRegularLayout),
            'video': this._buildValueHolder('video', 'pa.involved.video', this.onRegularLayout),
            'illu': this._buildValueHolder('illu', 'pa.involved.illu', this.onRegularLayout),
            'ad': this._buildValueHolder('ad', 'pa.involved.ad', this.onAdLayout)
        };

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._onsite = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._text = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._photo = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._video = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._illu = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._ad = null;

        /**
         * @type {PModuleConfig}
         * @private
         */
        this._activated = null;
    }

    /**
     * Creates a new value-holder element
     * @param tabId
     * @returns {{data: null, renderer: renderer, tab: HTMLElement | null}}
     */
    _buildValueHolder(involvedIn, tabId, renderer) {
        let that = this;
        return {
            'involved-in': involvedIn,
            'data': null,
            'renderer': function (valueHolder) {
                renderer.call(that, this, valueHolder);
            },
            'tab': that.document.getElementById(tabId),
            'binding': that
        };
    }

    update(config) {
        this._activated.activate();
        this._activated.update(config);
        this._ad.update(config);
        // update the entity as well otherwise on change callbacks will re-store old entity states
        this._config = config;
        return this;
    }

    bind() {
        this._onsite = this._onsite !== null ? this._onsite.update(this._config) : (this._onsite = new PModuleConfig(this.document, 'vor.Ort', this._involvements.onsite)
            .bind(this._config, 'onsite')
            .render());

        this._text = this._text !== null ? this._text.update(this._config) : (this._text = new PModuleConfig(this.document, 'Text', this._involvements.text)
            .bind(this._config, 'text')
            .render());

        this._photo = this._photo !== null ? this._photo.update(this._config) : (this._photo = new PModuleConfig(this.document, 'Foto', this._involvements.photo)
            .bind(this._config, 'photo')
            .render());

        this._video = this._video !== null ? this._video.update(this._config) : (this._video = new PModuleConfig(this.document, 'Video', this._involvements.video)
            .bind(this._config, 'video')
            .render());

        this._illu = this._illu !== null ? this._illu.update(this._config) : (this._illu = new PModuleConfig(this.document, 'Illu.Grafik', this._involvements.illu)
            .bind(this._config, 'illu')
            .render());

        this._ad = this._ad !== null ? this._ad.update(this._config) : (this._ad = new PModuleConfig(this.document, 'Inserat', this._involvements.ad)
            .bind(this._config, 'ad')
            .render());
        this._activated = this._onsite;
        this._activated.activate();
        return this;
    }

    onRegularLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_regular;
        let templ = virtual.cloneNode(true);
        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._config};
        this.document.newSingleLineInput(valueHolder, ".pa.name", "name", "Name", params, this._action, "eintippen…", "text", false);
        this.document.newSingleLineInput(valueHolder, ".pa.social", "social", "Telefon.Mail.Webseite", params, this._action, "notieren…");
        this.document.newMultiLineInput(valueHolder, ".pa.address", "address", "Adresse", params, this._action, 2, "festhalten…");
        this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz", params, this._action, 6, "formulieren…")
            .addClass("padding-fix");
        this.document.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", "Deadline", params, this._action, "bestimmen…", "text", false);
    }

    onAdLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_ad;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'artikel': this._config};
        this.document.newSingleLineInput(valueHolder, ".pa.name", 'name', "Kontakt", params, this._action, "eintippen…", "text", false);
        this.document.newSingleLineInput(valueHolder, ".pa.social", 'social', "Telefon.Mail.Webseite", params, this._action, "notieren…");
        this.document.newMultiLineInput(valueHolder, ".pa.address", 'address', "Adresse", params, this._action, 2, "eingeben…");
        this.document.newSingleLineInput(valueHolder, ".pa.format", 'format', 'Format', params, this._action, "festhalten…", "text", false);
        this.document.newSingleLineInput(valueHolder, ".pa.placement", "placement", "Platzierung", params, this._action, "vormerken…", "text", false);
        this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Kunde.Sujet", params, this._action, 2, "Name.Stichwort…");
        this.document.newSingleLineInput(valueHolder, ".pa.price", "price", "Preis CHF", params, this._action, "bestimmen…", "money", false);
        this.document.newSingleLineInput(valueHolder, ".pa.total", "total", "Total CHF", params, this._action, "", "money", true)
            .addClass("bold");
    }

    /**
     * Switch content by removing any previous content first, resetting UI states and then set the new tab content
     * @param forms
     * @param templ
     * @private
     */
    _switchContent(forms, templ) {
        let content = this.document.getElementById("pa.tab.content");
        content.removeChildren();
        this._onsite.valueHolder.tab.removeClass("selected");
        this._text.valueHolder.tab.removeClass("selected");
        this._photo.valueHolder.tab.removeClass("selected");
        this._video.valueHolder.tab.removeClass("selected");
        this._illu.valueHolder.tab.removeClass("selected");
        this._ad.valueHolder.tab.removeClass("selected");

        content.appendChild(templ);
        this._activated = forms;
    }

}