class BeteiligtBinding {

    constructor(document, artikel, action, context) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        /**
         * @type {Artikel}
         */
        this._artikel = artikel;

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
         * @type {PForms}
         * @private
         */
        this._onsite = null;

        /**
         * @type {PForms}
         * @private
         */
        this._text = null;

        /**
         * @type {PForms}
         * @private
         */
        this._photo = null;

        /**
         * @type {PForms}
         * @private
         */
        this._video = null;

        /**
         * @type {PForms}
         * @private
         */
        this._illu = null;

        /**
         * @type {PForms}
         * @private
         */
        this._ad = null;

        /**
         * @type {PForms}
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

    update(artikel) {
        this._activated.activate();
        this._activated.update(artikel);
        this._ad.update(artikel);
        return this;
    }

    bind() {
        this._onsite = this._onsite !== null ? this._onsite.update(this._artikel) : (this._onsite = new PForms(this.document, 'vor.Ort', this._involvements.onsite)
            .bind(this._artikel, 'onsite')
            .render());

        this._text = this._text !== null ? this._text.update(this._artikel) : (this._text = new PForms(this.document, 'Text', this._involvements.text)
            .bind(this._artikel, 'text')
            .render());

        this._photo = this._photo !== null ? this._photo.update(this._artikel) : (this._photo = new PForms(this.document, 'Foto', this._involvements.photo)
            .bind(this._artikel, 'photo')
            .render());

        this._video = this._video !== null ? this._video.update(this._artikel) : (this._video = new PForms(this.document, 'Video', this._involvements.video)
            .bind(this._artikel, 'video')
            .render());

        this._illu = this._illu !== null ? this._illu.update(this._artikel) : (this._illu = new PForms(this.document, 'Illu.Grafik', this._involvements.illu)
            .bind(this._artikel, 'illu')
            .render());

        this._ad = this._ad !== null ? this._ad.update(this._artikel) : (this._ad = new PForms(this.document, 'Inserat', this._involvements.ad)
            .bind(this._artikel, 'ad')
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

        let params = {'context': this._context, 'valueHolder': valueHolder, 'artikel': this._artikel};
        this.document.newSingleLineInput(valueHolder, ".pa.name", "name", "Name", params, this._action, "eintippen…", "text", false);
        this.document.newMultiLineInput(valueHolder, ".pa.social", "social", "Telefon.Mail.Webseite", params, this._action, 2, "notieren…");
        this.document.newMultiLineInput(valueHolder, ".pa.address", "address", "Adresse", params, this._action, 2, "festhalten…");
        this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz", params, this._action, 4, "formulieren…");
        this.document.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", "Deadline", params, this._action, "bestimmen…", "text", false);
    }

    onAdLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_ad;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'artikel': this._artikel};
        this.document.newSingleLineInput(valueHolder, ".pa.name", 'name', "Kontakt", params, this._action, "eintippen…", "text", false);
        this.document.newMultiLineInput(valueHolder, ".pa.social", 'social', "Telefon.Mail.Webseite", params, this._action, 2, "notieren…");
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