// TODO duplicate code in artikelbinding => base class for plan and article?

class ModulePlanBinding extends Binding {

    /**
     * Create the BeteiligtBinding that binds to the passed root document. The config is the entity that is managed
     * by this binding. The action is called when data has been changed in the managed entity. The context is useful in
     * your change handler because it gets passed there too.
     *
     * @param document the underlying root document
     * @param entity the entity
     * @param action the onChange handler
     * @param context the context that is passed in your change handler
     * @param configuration
     */
    constructor(document, entity, action, context, configuration) {
        super(document, entity, action, context, configuration);
    }

    /**
     * Update the form with that entity and set it as the new entity on this instance
     * @param entity
     * @param configuration
     * @returns {Binding}
     */
    update(entity, configuration) {
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

        if (configuration) {
            this.updateConfiguration(configuration);
        }

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

        let aconfig = this.getConfigurationFor("field.a");
        /**
         * @type {MultiLineInput}
         */
        this._measures = this.document.newMultiLineInput(valueHolder, '.pa.plan.measures', 'measures', aconfig.label, params, this._action, 2, aconfig.editable.placeholder, aconfig.editable.visible)
            .addClass("multiline");

        let bconfig = this.getConfigurationFor("field.b");
        this._description = this.document.newMultiLineInput(valueHolder, '.pa.plan.description', 'description', bconfig.label, params, this._action, 3, bconfig.editable.placeholder, bconfig.editable.visible)
            .addClass("rows-2");
        let cconfig = this.getConfigurationFor("field.c");
        this._fee = this.document.newSingleLineInput(valueHolder, '.pa.plan.fee', 'fee', cconfig.label, params, this._action, cconfig.editable.placeholder, 'money', true, cconfig.editable.visible)
            .addClass('multiline', true);

        let dconfig = this.getConfigurationFor("field.d");
        this._charges = this.document.newSingleLineInput(valueHolder, '.pa.plan.projectFee', 'projectFee', dconfig.label, params, this._action, dconfig.editable.placeholder, 'money', true, dconfig.editable.visible)
            .addClass('multiline', true)
            .addClass('bold');

        let econfig = this.getConfigurationFor("field.e");
        this._thirdPartyCharges = this.document.newSingleLineInput(valueHolder, '.pa.plan.thirdPartyCharges', 'thirdPartyCharges', econfig.label, params, this._action, econfig.editable.placeholder, 'money', true, econfig.editable.visible)
            .addClass('multiline', true);

        let fconfig = this.getConfigurationFor("field.f");
        this._thirdPartyTotalCosts = this.document.newSingleLineInput(valueHolder, '.pa.plan.thirdPartyTotalCosts', 'thirdPartyTotalCosts', fconfig.label, params, this._action, fconfig.editable.placeholder, 'money', true, fconfig.editable.visible)
            .addClass('bold')
            .addClass('multiline', true);

        let gconfig = this.getConfigurationFor("field.g");
        this._capOnDepenses = this.document.newSingleLineInput(valueHolder, '.pa.plan.capOnDepenses', 'capOnDepenses', gconfig.label, params, this._action, gconfig.editable.placeholder, 'money', false, gconfig.editable.visible)
            .addClass('multiline', true);

        let hconfig = this.getConfigurationFor("field.h");
        this._totalCosts = this.document.newSingleLineInput(valueHolder, '.pa.plan.totalCosts', 'totalCosts', hconfig.label, params, this._action, hconfig.editable.placeholder, 'money', true, hconfig.editable.visible)
            .addClass('bold')
            .addClass('multiline', true)
            .addConditionalFormatting(function (entity) {
                return {
                    'name': 'rule-costs-exceeded',
                    'active': entity.capOnDepenses < entity.totalCosts
                };
            }, false);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._visual = this.doLayout("pa.plan.visual", "visual", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._form = this.doLayout("pa.plan.form", "form", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._online = this.doLayout("pa.plan.online", "online", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._region = this.doLayout("pa.plan.region", "region", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._season = this.doLayout("pa.plan.season", "season", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._place = this.doLayout("pa.plan.place", "place", valueHolder, params);
    }

    detach() {
        let container = this.document.getElementById("pa.plan.content");
        if (container) {
            container.removeChildren();
            container.removeSelf();
        }
    }

    /**
     * TODO duplicate code (s. ArtikelBinding)
     * @param target the target HTML element id
     * @param id the property id
     * @param valueHolder
     * @param params
     * @param configurationId if the property id differs from the configuration id you can pass the configuration id separately
     * @return {SingleSelectInput|PInput}
     */
    doLayout(target, id, valueHolder, params, configurationId) {
        let configuration = this.getConfigurationFor(configurationId || id);
        return this.document.newSingleSelect(valueHolder, target, id, configuration.label, params, this._action, 'Liste-Tag',
            newOption('-1', '…'), configuration.options, configuration.editable.visible);
    }

    updateConfiguration(configuration) {
        this._configuration = configuration;

        this.updateField(this._measures, "field.a");
        this.updateField(this._description, "field.b");
        this.updateField(this._fee, "field.c");
        this.updateField(this._charges, "field.d");
        this.updateField(this._thirdPartyCharges, "field.e");
        this.updateField(this._thirdPartyTotalCosts, "field.f");
        this.updateField(this._capOnDepenses, "field.g");
        this.updateField(this._totalCosts, "field.h");

        this.updateField(this._online, "online");
        this.updateField(this._visual, "visual");
        this.updateField(this._region, "region");
        this.updateField(this._season, "season");
        this.updateField(this._form, "form");
        this.updateField(this._place, "place");
    }

    /**
     * Switch content by removing any previous content first, resetting UI states and then set the new tab content
     * @param forms
     * @param templ
     * @private
     */
    _switchContent(templ) {
        let content = this._initContent();
        content.removeChildren();
        content.appendChild(templ);
    }

    _initContent() {
        let container = this.document.getElementById("pa.plan.content") || this.document.createElement("span");
        if (!container.getAttribute("id")) {
            let form = this.document.createElement("form");
            form.setAttribute("autocomplete", "off");
            form.setAttribute("id", "panta.form.plan");
            container.setAttribute("id", "pa.plan.content");
            form.appendChild(container);
            this.document.getElementById("panta.content").appendChild(form);
        }
        return container;
    }
}