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
        this._editable = config;

        /**
         * The action to be called when data has changed
         */
        this._action = action;

        /**
         * The context that is passed to the data change action handler
         */
        this._context = context;

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

        this._currentTabIndex = -1;
    }

    initLayouts(configuration) {
        let that = this;
        this._involvements = Object.values(configuration).reduce(function (prev, curr) {
            prev[curr.name] = that._buildValueHolder(
                curr.name,
                curr.container,
                curr,
                that.onLayout);
            return prev;
        }, {});
    }

    /**
     * Creates a new value-holder element
     * @param involvedIn
     * @param tabId
     * @param renderer
     * @returns {{layout: string, renderer: renderer, data: null, tab: HTMLElement, "involved-in": *, binding: BeteiligtBinding, label: string}}
     * @private
     */
    _buildValueHolder(involvedIn, tabId, config, renderer) {
        let that = this;
        let tab = that.document.getElementById(tabId);
        return {
            'involved-in': involvedIn,
            'data': null,
            'renderer': function (valueHolder) {
                renderer.call(that, this, valueHolder);
            },
            'tab': tab,
            // TODO data-layout is obsolete when switched to module configuration
            'layout': config.layout || tab.getAttribute("data-layout"),
            // TODO data-label is obsolete when switched to module configuration
            'label': config.label || tab.getAttribute("data-label"),
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
        Object.values(this).filter(function (property) {
            return (property instanceof PModuleConfig)
        }).forEach(function (module) {
            module.update(config);
        });
        // update the entity as well otherwise on change callbacks will re-store old entity states
        this._editable = config;
        return this;
    }

    /**
     * Bind the entity with the PModuleConfigs and set the _onsite tab as the currently active one
     *
     * @returns {BeteiligtBinding}
     */
    bind(configuration) {
        this.initLayouts(configuration);
        this._onsite = this._onsite !== null ? this._onsite.update(this._editable) : (this._onsite = new PModuleConfig(this.document, 'vor.Ort', this._involvements.onsite)
            .bind(this._editable, 'onsite')
            .render());

        this._text = this._text !== null ? this._text.update(this._editable) : (this._text = new PModuleConfig(this.document, 'Text', this._involvements.text)
            .bind(this._editable, 'text')
            .render());

        this._photo = this._photo !== null ? this._photo.update(this._editable) : (this._photo = new PModuleConfig(this.document, 'Foto', this._involvements.photo)
            .bind(this._editable, 'photo')
            .render());

        this._video = this._video !== null ? this._video.update(this._editable) : (this._video = new PModuleConfig(this.document, 'Video', this._involvements.video)
            .bind(this._editable, 'video')
            .render());

        this._illu = this._illu !== null ? this._illu.update(this._editable) : (this._illu = new PModuleConfig(this.document, 'Illu.Grafik', this._involvements.illu)
            .bind(this._editable, 'illu')
            .render());

        this._ad = this._ad !== null ? this._ad.update(this._editable) : (this._ad = new PModuleConfig(this.document, 'Inserat', this._involvements.ad)
            .bind(this._editable, 'ad')
            .render());
        // activate the first tab when rendering this layout. when the layout was already rendered then it will not call bind() but update
        this._onsite.activate();
        // we set the activated manually here but is actually also set when rendering the layout which is triggered by activate() on the PModuleConfig but this is not obvious
        // and therefore we set it here manually
        this._activated = this._onsite;
        return this;
    }

    /**
     * Update the input fields in that form instead of re-rendering the whole form
     *
     * @param forms
     * @param valueHolder
     */
    onLayoutUpdate(forms, valueHolder) {
        forms.setFieldValue("name", valueHolder.data, "name");
        forms.setFieldValue("social", valueHolder.data, "social");
        forms.setFieldValue("address", valueHolder.data, "address");
        forms.setFieldValue("notes", valueHolder.data, "notes");
        forms.setFieldValue("duedate", valueHolder.data, "duedate");

        forms.setFieldValue("fee", valueHolder.data, "fee");
        forms.setFieldValue("charges", valueHolder.data, "charges");
        forms.setFieldValue("project", valueHolder.data, "project");
        forms.setFieldValue("capOnDepenses", valueHolder.data, "capOnDepenses");
    }

    /**
     * Called when it should render the layout. This will check if the layout is already rendered on the document. If
     * it is then it will only do a data update instead of a full re-rendering. To check if the content was already
     * rendered it uses an internal state. The
     * @param forms
     * @param valueHolder
     */
    onLayout(forms, valueHolder) {
        // check if we need to switch the layout or if it's already the right one
        if (forms === this._activated) {
            console.log("onLayout: only update the layout with new values");
            this.onLayoutUpdate(forms, valueHolder);
        } else {
            console.log("onLayout: do a full layout");
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
    }

    /**
     * Called when a regular layout is request by clicking on a section tab (s. _involvements)
     * @param forms
     * @param valueHolder
     */
    onRegularLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = isMobileBrowser() ? template_regular_mobile : template_regular;
        let templ = virtual.cloneNode(true);
        this._switchContent(forms, templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._editable};
        forms.setField("name", this.document.newSingleLineInput(valueHolder, ".pa.name", "name", "Name", params, this._action, "eintippen…", "text", false));
        forms.setField("social", this.document.newSingleLineInput(valueHolder, ".pa.social", "social", "Telefon.Mail.Webseite", params, this._action, "notieren…"));
        forms.setField("address", this.document.newMultiLineInput(valueHolder, ".pa.address", "address", "Adresse", params, this._action, 2, "festhalten…"));
        forms.setField("notes", this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", "Notiz", params, this._action, 6, "formulieren…"));
        forms.setField("duedate", this.document.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", "Deadline", params, this._action, "bestimmen…", "text", false));

        forms.setField("fee", this.document.newSingleLineInput(valueHolder, ".pa.fee", "fee", "Honorar Massnahme", params, this._action, "Betrag…", "money", false));
        forms.setField("charges", this.document.newSingleLineInput(valueHolder, ".pa.charges", "charges", "Spesen Massnahme", params, this._action, "Betrag…", "money", false));
        forms.setField("project", this.document.newSingleLineInput(valueHolder, ".pa.project", "project", "Total Beteiligte", params, this._action, "Betrag…", "money", true)
            .addClass("bold"));
        forms.setField("capOnDepenses", this.document.newSingleLineInput(valueHolder, ".pa.cap_on_depenses", "capOnDepenses", "Kostendach Total Projekt", params, this._action, "Betrag…", "money", false));
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

        let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._editable};
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

    /**
     * @param {PInput} element
     */
    rememberFocus(element) {
        this._currentTabIndex = element.getTabIndex();
    }
}