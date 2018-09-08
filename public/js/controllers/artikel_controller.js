class ArtikelController {

    static get SHARED_NAME() {
        return "panta.Artikel";
    }

    constructor(document, trelloApi) {
        this.document = document;
        this.trelloApi = trelloApi;
        /**
         * @type {Artikel}
         * @private
         */
        this._entity = null;

        /**
         * @type {MultiLineInput}
         * @private
         */
        this._topic = null;

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

        this._involvements = {
            'onsite': this._buildValueHolder('onsite', 'pa.involved.onsite', this.onRegularLayout),
            'text': this._buildValueHolder('text', 'pa.involved.text', this.onRegularLayout),
            'photo': this._buildValueHolder('photo', 'pa.involved.photo', this.onRegularLayout),
            'video': this._buildValueHolder('video', 'pa.involved.video', this.onRegularLayout),
            'illu': this._buildValueHolder('illu', 'pa.involved.illu', this.onRegularLayout),
            'ad': this._buildValueHolder('ad', 'pa.involved.ad', this.onAdLayout)
        };
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
            'renderer': function(valueHolder) {
                renderer.call(that, this, valueHolder);
            },
            'tab': that.document.getElementById(tabId)
        };
    }

    onAdLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_ad;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        new SingleLineInput(this.document, "Name", null, ".pa.name", "")
            .bind(valueHolder.data, 'name')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, ".pa.social", "", 2, false)
            .bind(valueHolder.data, 'social')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Adresse", null, ".pa.address", "", 2, false)
            .bind(valueHolder.data, 'address')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new SingleLineInput(this.document, "Format", null, ".pa.format", "")
            .bind(valueHolder.data, 'format')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new SingleLineInput(this.document, "Platzierung", null, ".pa.placement", "")
            .bind(valueHolder.data, 'placement')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Notiz", null, ".pa.notes", "", 2, false)
            .bind(valueHolder.data, 'notes')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new SingleLineInput(this.document, "Preis CHF", null, ".pa.price", "")
            .bind(valueHolder.data, 'price')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new SingleLineInput(this.document, "Total CHF", null, ".pa.total", "", true)
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();
    }

    onRegularLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_regular;
        let templ = virtual.cloneNode(true);
        this._switchContent(forms, templ);

        new SingleLineInput(this.document, "Name", null, ".pa.name", "")
            .bind(valueHolder.data, 'name')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, ".pa.social", "", 2, false)
            .bind(valueHolder.data, 'social')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Adresse", null, ".pa.address", "", 2, false)
            .bind(valueHolder.data, 'address')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new MultiLineInput(this.document, "Notiz", null, ".pa.notes", "", 5, false)
            .bind(valueHolder.data, 'notes')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();

        new SingleLineInput(this.document, "Deadline", null, ".pa.duedate", "")
            .bind(valueHolder.data, 'duedate')
            .onChange(this.putDataInvolved, { 'trelloApi': this.trelloApi, 'valueHolder': valueHolder, 'artikel': this._entity })
            .render();
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

    /**
     * @param (Artikel) artikel
     */
    render(artikel) {
        this._entity = artikel ? artikel : new Artikel();
        if (this._topic == null) {
            this._doArtikel();
        } else {
            this._topic.update(this._entity);
        }
        this._doInvolvements();
        if (!this._activated) {
            this._activated = this._onsite;
        }
        this._activated.activate();
    }
    
    _doInvolvements() {
        this._onsite = this._onsite !== null ? this._onsite.update() : (this._onsite = new PForms(this.document, 'vor Ort', this._involvements.onsite)
            .bind(this._entity, 'onsite')
            .render());

        this._text = this._text !== null ? this._text.update() : (this._text = new PForms(this.document, 'Text', this._involvements.text)
            .bind(this._entity, 'text')
            .render());

        this._photo = this._photo !== null ? this._photo.update() : (this._photo = new PForms(this.document, 'Foto', this._involvements.photo)
            .bind(this._entity, 'photo')
            .render());

        this._video = this._video !== null ? this._video.update() : (this._video = new PForms(this.document, 'Video', this._involvements.video)
            .bind(this._entity, 'video')
            .render());

        this._illu = this._illu !== null ? this._illu.update() : (this._illu = new PForms(this.document, 'Illu.Grafik', this._involvements.illu)
            .bind(this._entity, 'illu')
            .render());

        this._ad  = this._ad !== null ? this._ad.update() : (this._ad = new PForms(this.document, 'Inserat', this._involvements.ad)
            .bind(this._entity, 'ad')
            .render());
    }

    _doArtikel() {
        this._topic = new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)
            .bind(this._entity, 'topic')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")
            .bind(this._entity, 'from')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")
            .bind(this._entity, 'author')
            .onChange(this.putData, this)
            .render();
        new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 2)
            .bind(this._entity, 'text')
            .onChange(this.putData, this)
            .render();

        new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")
            .bind(this._entity, 'pagina')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")
            .bind(this._entity, 'layout')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe")
            .bind(this._entity, 'total')
            .onChange(this.putData, this)
            .render();
        new SingleSelectInput(this.document, "Online", null, "pa.tags", "Liste-Tag")
            .addOption("monday", "Mo.")
            .addOption("tuesday", "Di.")
            .addOption("wednesday", "Mi.")
            .addOption("thursday", "Do.")
            .addOption("friday", "Fr.")
            .addOption("saturday", "Sa.")
            .addOption("sunday", "So.")
            .bind(this._entity, 'tags')
            .onChange(this.putData, this)
            .render();
        new SingleSelectInput(this.document, "Visual", null, "pa.visual", "x-Liste")
            .addOption("picture", "Bild")
            .addOption("icon", "Icon")
            .addOption("graphics", "Grafik")
            .addOption("videos", "Video")
            .addOption("illustrations", "Illu")
            .bind(this._entity, 'visual')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "Region", null, "pa.region", "x-Liste")
            .bind(this._entity, 'region')
            .onChange(this.putData, this)
            .render();
        new SingleSelectInput(this.document, "Saison", null, "pa.season", "x-Liste")
            .addOption("summer", "Sommer")
            .addOption("fall", "Herbst")
            .bind(this._entity, 'season')
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "", null, "pa.additional.1", "", true)
            .onChange(this.putData, this)
            .render();
        new SingleLineInput(this.document, "", null, "pa.additional.2", "", true)
            .onChange(this.putData, this)
            .render();
    }

    putDataInvolved(source, args) {
        source.setProperty();

        let trelloApi = args['trelloApi'];
        let valueHolder = args['valueHolder'];
        let artikel = args['artikel'];
        let involved = source.getBinding();

        // update the involved
        artikel.putInvolved(valueHolder['involved-in'], involved);
        trelloApi.set('card', 'shared', ArtikelController.SHARED_NAME, artikel);
        console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
    }

    putData(source, ctx) {
        source.setProperty();
        ctx.trelloApi.set('card', 'shared', ArtikelController.SHARED_NAME, source.getBinding());
        console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
    }

    getData(artikel, what) {
        if (this.document.getElementsByName(what + "_data").length === 1) {
            return this.document.getElementsByName(what + "_data")[0].value;
        } else if (artikel && artikel.options && artikel.options[what + "_data"]) {
            return artikel.options[what + "_data"];
        } else {
            return "";
        }
    }

}