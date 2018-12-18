class BeteiligtBinding {

    /**
     * Create the BeteiligtBinding that binds to the passed root document. The config is the entity that is managed
     * by this binding. The action is called when data has been changed in the managed entity. The context is useful in
     * your change handler because it gets passed there too.
     *
     * @param document the underlying root document
     * @param config the entity
     * @param action the onChange handler
     * @param context the context that is passed in your change handler
     */
    constructor(document, config, action, context) {
        /**
         * @type {HTMLDocument}
         */
        this.document = document;
        /**
         * @type {ModuleConfig}
         */
        this._config = config;

        /**
         * The action to be called when data has changed
         */
        this._action = action;

        /**
         * The context that is passed to the data change action handler
         */
        this._context = context;

        this._involvements = {
            'onsite': this._buildValueHolder('onsite', 'pa.involved.onsite', this.onLayout),
            'text': this._buildValueHolder('text', 'pa.involved.text', this.onLayout),
            'photo': this._buildValueHolder('photo', 'pa.involved.photo', this.onLayout),
            'video': this._buildValueHolder('video', 'pa.involved.video', this.onLayout),
            'illu': this._buildValueHolder('illu', 'pa.involved.illu', this.onLayout),
            'ad': this._buildValueHolder('ad', 'pa.involved.ad', this.onLayout)
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
     * @param involvedIn
     * @param tabId
     * @param renderer
     * @returns {{layout: string, renderer: renderer, data: null, tab: HTMLElement, "involved-in": *, binding: BeteiligtBinding, label: string}}
     * @private
     */
    _buildValueHolder(involvedIn, tabId, renderer) {
        let that = this;
        let tab = that.document.getElementById(tabId);
        return {
            'involved-in': involvedIn,
            'data': null,
            'renderer': function (valueHolder) {
                renderer.call(that, this, valueHolder);
            },
            'tab': tab,
            'layout': tab.getAttribute("data-layout"),
            'label': tab.getAttribute("data-label"),
            'binding': that
        };
    }

    /**
     * Activate the currently active section and update all other sections with the passed config because they may depend
     * on this new config
     * @param config
     * @returns {BeteiligtBinding}
     */
    update(config) {
        this._activated.activate();
        // update all PModuleConfigs with the new config entity
        Object.values(this).filter(function(property) {
            return (property instanceof PModuleConfig)
        }).forEach(function(module) {
            module.update(config);
        });
        // update the entity as well otherwise on change callbacks will re-store old entity states
        this._config = config;
        return this;
    }

    /**
     * Bind the entity with the PModuleConfigs and set the _onsite tab as the currently active one
     *
     * @returns {BeteiligtBinding}
     */
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

    /**
     * Called when a regular layout is request by clicking on a section tab (s. _involvements)
     * @param forms
     * @param valueHolder
     */
    onRegularLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_regular;
        let templ = virtual.cloneNode(true);
        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._config};
        this.document.newSingleLineInput(valueHolder, ".pa.name", "name", "Name", params, this._action, "eintippen…", "text", false);
        this.document.newSingleLineInput(valueHolder, ".pa.social", "social", "Telefon.Mail.Webseite", params, this._action, "notieren…");
        this.document.newMultiLineInput(valueHolder, ".pa.address", "address", "Adresse", params, this._action, 2, "festhalten…");
        this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz", params, this._action, 6, "formulieren…");
        this.document.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", "Deadline", params, this._action, "bestimmen…", "text", false);

        this.document.newSingleLineInput(valueHolder, ".pa.fee", "fee", "Honorar Massnahme", params, this._action, "Betrag…", "money", false)
            .addClass('multiline', true);
        this.document.newSingleLineInput(valueHolder, ".pa.projectFee", "projectFee", "Spesen Massnahme", params, this._action, "Betrag…", "money", false)
            .addClass('multiline', true);
        this.document.newSingleLineInput(valueHolder, ".pa.project", "project", "Total Beteiligte", params, this._action, "Betrag…", "money", true)
            .addClass("bold")
            .addClass('multiline', true);
        this.document.newSingleLineInput(valueHolder, ".pa.cap_on_expenses", "capOnExpenses", "Kostendach Total Projekt", params, this._action, "Betrag…", "money", false)
            .addClass('multiline', true);
    }

    onLayout(forms, valueHolder) {
        switch (valueHolder.layout) {
            case "ad":
                this.onAdLayout(forms, valueHolder);
                break;
            case "regular":
            default:
                this.onRegularLayout(forms, valueHolder);
                break;
        }
    }

    /**
     * Called when a ad layout is request by clicking on a section tab (s. _involvements). Currently this only the case for the 'Inserat' tab
     * @param forms
     * @param valueHolder
     */
    onAdLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_ad;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._config};
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
        this._onsite.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._text.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._photo.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._video.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._illu.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._ad.valueHolder.tab.removeClasses(["selected", 'editing']);

        content.appendChild(templ);
        this._activated = forms;
    }

    /**
     * Enter editing mode. This will begin the editing mode on the activated section
     */
    enterEditing() {
        this._activated.beginEditing();
    }

    /**
     * Leave editing mode. This will end the editing mode on the activated section
     */
    leaveEditing() {
        this._activated.endEditing();
    }

}