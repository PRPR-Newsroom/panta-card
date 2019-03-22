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
        super(document, entity, action, context);

        /**
         * @type {PluginModuleConfig}
         */
        this._configuration = configuration;
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
            console.log("Update configuration", configuration);
            this._updateConfiguration(configuration);
        } else {
            console.log("No new configuration");
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
        this._measures = this.document.newMultiLineInput(valueHolder, '.pa.plan.measures', 'measures', aconfig.label, params, this._action, 2, aconfig.editable.placeholder)
            .addClass("multiline");

        let bconfig = this.getConfigurationFor("field.b");
        this._description = this.document.newMultiLineInput(valueHolder, '.pa.plan.description', 'description', bconfig.label, params, this._action, 3, bconfig.editable.placeholder)
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
        /**
         * @type {SingleSelectInput|PInput}
         * @private
         */
        return this.document.newSingleSelect(valueHolder, target, id, configuration.label, params, this._action, 'Liste-Tag',
            newOption('-1', '…'), configuration.options);
    }

    // TODO duplicate code here
    /**
     * @param {PInput} text
     * @param id
     */
    updateText(text, id) {
        let config = this.getConfigurationFor(id);
        text.setLabel(config.editable.label);
        text.setPlaceholder(config.editable.placeholder);
    }

    updateSelect(select, id) {
        let oc = this.getConfigurationFor(id);
        select.clear();
        select.setLabel(oc.label);
        select.addOption("-1", "…");
        select.addOptions(oc.options);
        select.invalidate();
    }

    _updateConfiguration(configuration) {
        this._configuration = configuration;

        this.updateText(this._measures, "field.a");
        this.updateText(this._description, "field.b");

        this.updateSelect(this._online, "online");
        this.updateSelect(this._visual, "visual");
        this.updateSelect(this._region, "region");
        this.updateSelect(this._season, "season");
        this.updateSelect(this._form, "form");
        this.updateSelect(this._place, "place");
    }

    /**
     * TODO dup code
     * @param id
     * @return {{label, options: number | Array | T, editable: *}}
     */
    getConfigurationFor(id) {
        let editable = this._configuration.config.editables
            .filter(function (editable) {
                return editable.id === id;
            });

        let label = editable[0].label;

        let options = editable
            .map(function (editable) {
                return editable.values;
            })
            .flat()
            .map(function (value, index) {
                return newOption(index, value);
            })
            .reduce(function (prev, cur) {
                prev.push(cur);
                return prev;
            }, []);

        return {
            "label": label,
            "options": options,
            "editable": editable[0]
        };
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