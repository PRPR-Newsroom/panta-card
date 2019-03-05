class ModulePlanBinding extends Binding {

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
    constructor(document, entity, action, context) {
        super(document, entity, action, context);
    }

    /**
     * Update the form with that entity and set it as the new entity on this instance
     * @param entity
     * @returns {Binding}
     */
    update(entity) {

        this._measures.update(entity);
        this._description.update(entity);
        this._fee.update(entity);
        this._charges.update(entity);
        this._thirdPartyCharges.update(entity);
        this._thirdPartyTotalCosts.update(entity);
        this._capOnDepenses.update(entity);
        this._totalCosts.update(entity);
        this._visual.update(entity);
        this._form.update(entity);
        this._online.update(entity);
        this._region.update(entity);
        this._season.update(entity);
        this._place.update(entity);

        // update the entity as well otherwise on change callbacks will re-store old entity states
        this._entity = entity;
        return this;
    }

    /**
     * Bind the entity with the PModuleConfigs and set the _onsite tab as the currently active one
     *
     * @returns {Binding}
     */
    bind() {
        let valueHolder = {'data': this._entity};
        this.onLayout(valueHolder);
        return this;
    }

    /**
     * Called when a regular layout is request by clicking on a section tab (s. _involvements)
     * @param valueHolder
     */
    onLayout(valueHolder) {
        let templ = createByTemplate(template_plan, template_plan_mobile);
        this._switchContent(templ);

        let params = {'context': this._context, 'valueHolder': valueHolder, 'entity': this._entity};

        /**
         * @type {MultiLineInput}
         */
        this._measures = this.document.newMultiLineInput(valueHolder, '.pa.plan.measures', 'measures', 'Massnahme', params, this._action, 2, 'notieren…')
            .addClass("multiline");
        this._description = this.document.newMultiLineInput(valueHolder, '.pa.plan.description', 'description', 'Beschreibung', params, this._action, 3, 'notieren…')
            .addClass("rows-2");
        this._fee = this.document.newSingleLineInput(valueHolder, '.pa.plan.fee', 'fee', 'Total Honorar Beteiligte', params, this._action, '', 'money', true)
            .addClass('multiline', true);
        this._charges = this.document.newSingleLineInput(valueHolder, '.pa.plan.projectFee', 'projectFee', 'Total Honorar Projekt', params, this._action, '', 'money', true)
            .addClass('multiline', true)
            .addClass('bold');

        this._thirdPartyCharges = this.document.newSingleLineInput(valueHolder, '.pa.plan.thirdPartyCharges', 'thirdPartyCharges', 'Total Spesen Beteiligte', params, this._action, '', 'money', true)
            .addClass('multiline', true);
        this._thirdPartyTotalCosts = this.document.newSingleLineInput(valueHolder, '.pa.plan.thirdPartyTotalCosts', 'thirdPartyTotalCosts', 'Total Spesen Projekt', params, this._action, '', 'money', true)
            .addClass('bold')
            .addClass('multiline', true);

        this._capOnDepenses = this.document.newSingleLineInput(valueHolder, '.pa.plan.capOnDepenses', 'capOnDepenses', 'Kostendach Projekt…', params, this._action, 'Betrag…', 'money', false)
            .addClass('multiline', true);

        this._totalCosts = this.document.newSingleLineInput(valueHolder, '.pa.plan.totalCosts', 'totalCosts', 'Total Projekt', params, this._action, 'Betrag…', 'money', true)
            .addClass('bold')
            .addClass('multiline', true)
            .addConditionalFormatting(function (entity) {
                /** @type Plan entity */
                return {
                    'name': 'rule-costs-exceeded',
                    'active': entity.capOnDepenses < entity.totalCosts
                };
            }, false);

        this._visual = this._visual = this.document.newSingleSelect(valueHolder, 'pa.plan.visual', 'visual', 'Visual', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("picture", "Bild"),
            newOption("icon", "Icon"),
            newOption("graphics", "Grafik"),
            newOption("videos", "Video"),
            newOption("illustrations", "Illu"),
        ]);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._form = this.document.newSingleSelect(valueHolder, 'pa.plan.form', 'form', 'Form', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("news", "News"),
            newOption("article", "Artikel"),
            newOption("report", "Report"),
        ]);

        this._online = this.document.newSingleSelect(valueHolder, 'pa.plan.online', 'online', 'Online', params, this._action, 'Liste-Tag', newOption('', '…'), [
            newOption("monday", ArtikelBinding.getTagMapping("monday")),
            newOption("tuesday", ArtikelBinding.getTagMapping("tuesday")),
            newOption("wednesday", ArtikelBinding.getTagMapping("wednesday")),
            newOption("thursday", ArtikelBinding.getTagMapping("thursday")),
            newOption("friday", ArtikelBinding.getTagMapping("friday")),
            newOption("saturday", ArtikelBinding.getTagMapping("saturday")),
            newOption("sunday", ArtikelBinding.getTagMapping("sunday")),
        ]);

        this._region = this.document.newSingleSelect(valueHolder, 'pa.plan.region', 'region', 'Region', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("north", ArtikelBinding.getRegionMapping("north")),
            newOption("south", ArtikelBinding.getRegionMapping("south")),
        ]);
        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._season = this.document.newSingleSelect(valueHolder, 'pa.plan.season', 'season', 'Saison', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("summer", "Sommer"),
            newOption("fall", "Herbst"),
        ]);


        this._place = this.document.newSingleSelect(valueHolder, 'pa.plan.place', 'place', 'Ort', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("cds", "CDS"),
            newOption("sto", "STO"),
            newOption("tam", "TAM"),
            newOption("wid", "WID"),
            newOption("buech", "Buech"),
            newOption("rustico", "Rustico"),
            newOption("schlatt", "Schlatt"),
        ]);

    }

    /**
     * Switch content by removing any previous content first, resetting UI states and then set the new tab content
     * @param forms
     * @param templ
     * @private
     */
    _switchContent(templ) {
        let content = this.document.getElementById("pa.plan.content");
        content.removeChildren();
        content.appendChild(templ);
    }

}