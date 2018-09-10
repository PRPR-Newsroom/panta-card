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
        this._onsite = this._onsite !== null ? this._onsite.update(this._artikel) : (this._onsite = new PForms(this.document, 'vor Ort', this._involvements.onsite)
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

        this.newSingleLineInput(valueHolder, ".pa.name", "name", "Name");
        this.newMultiLineInput(valueHolder, ".pa.social", "social", "Telefon.Mail.Webseite");
        this.newMultiLineInput(valueHolder, ".pa.address", "address", "Adresse");
        this.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz");
        this.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", "Deadline");
    }

    onAdLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_ad;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        this.newSingleLineInput(valueHolder, ".pa.name", 'name', "Name");
        this.newMultiLineInput(valueHolder, ".pa.social", 'social', "Telefon.Mail.Webseite");
        this.newMultiLineInput(valueHolder, ".pa.address", 'address', "Adresse");
        this.newSingleLineInput(valueHolder, ".pa.format", 'format', 'Format');
        this.newSingleLineInput(valueHolder, ".pa.placement", "placement", "Platzierung");
        this.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz");
        this.newSingleLineInput(valueHolder, ".pa.price", "price", "Preis CHF");
        this.newSingleLineInput(valueHolder, ".pa.total", "total", "Total CHF", true);
    }

    newMultiLineInput(valueHolder, targetId = ".pa.social", property = 'social', label = "Telefon.Mail.Webseite") {
        return new MultiLineInput(this.document, label, null, targetId, "", 2, false)
            .bind(valueHolder.data, property)
            .onChange(this._action, {'context': this._context, 'valueHolder': valueHolder, 'artikel': this._artikel})
            .render();
    }

    newSingleLineInput(valueHolder, targetId = ".pa.name", property = null, label = "Name", readonly = false) {
        let sli = new SingleLineInput(this.document, label, null, targetId, "", readonly);
        if (property !== null) {
            sli.bind(valueHolder.data, property);
        }
        sli.onChange(this._action, {'context': this._context, 'valueHolder': valueHolder, 'artikel': this._artikel})
            .render();
        return sli;
    }

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