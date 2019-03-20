/**
 * This artikel binding class binds an artikel with the view/layout
 */
class ArtikelBinding extends Binding {

    /**
     * Get the german name for that region
     * @param region
     * @returns {*}
     */
    static getRegionMapping(region) {
        switch (region) {
            case "nord":
            case "north":
                return "Nord";
            case "south":
                return "Süd";
            default:
                return region;
        }
    }

    /**
     * Get the german name for that 'tag' (day)
     * @param tag
     * @returns {*}
     */
    static getTagMapping(tag) {
        return tag;
    }

    constructor(document, entity, action, context, configuration) {
        super(document, entity, action, context);
        /**
         * @type {PluginModuleConfig}
         */
        this._configuration = configuration;
    }


    /**
     * This is called when a property has changed and thus the form needs an update. All fields of the panta.Artikel are updated
     * @param artikel
     * @param configuration
     * @returns {ArtikelBinding}
     */
    update(artikel, configuration) {
        if (configuration) {
            console.log("Update configuration", configuration);
            this._updateConfiguration(configuration);
        } else {
            console.log("No new configuration");
        }

        this._topic.update(artikel);
        this._from.update(artikel);
        this._author.update(artikel);
        this._text.update(artikel);
        this._pagina.update(artikel);
        this._layout.update(artikel);
        this._total.update(artikel);
        this._tags.update(artikel);
        this._visual.update(artikel);
        this._region.update(artikel);
        this._season.update(artikel);
        this._form.update(artikel);
        this._location.update(artikel);
        return this;
    }

    /**
     * Do the binding resp. render the panta.Artikel
     * @returns {ArtikelBinding}
     */
    bind() {
        let params = {'context': this._context, 'artikel': this._entity};
        let valueHolder = {'data': this._entity};
        this.onLayout(valueHolder, params);
        return this;
    }

    onLayout(valueHolder, params) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_artikel;
        let templ = virtual.cloneNode(true);
        this._switchContent(templ);

        this._topic = this.document.newMultiLineInput(valueHolder, "pa.topic", 'topic', 'Thema', params, this._action, 2, "Lauftext");
        // this is a beschiss because the order of the elements matter to correctly compute height
        this._layout = this.document.newSingleLineInput(valueHolder, 'pa.layout', 'layout', 'Seiten Layout', params, this._action, 'Zahl', 'number', false);
        this._from = this.document.newSingleLineInput(valueHolder, 'pa.input-from', 'from', 'Input von', params, this._action, "Name");
        this._author = this.document.newSingleLineInput(valueHolder, 'pa.author', 'author', 'Textautor*in', params, this._action, 'Name');
        this._total = this.document.newSingleLineInput(valueHolder, 'pa.total', 'total', 'Seiten Total', params, this._action, 'Summe', 'number', true)
            .addClass('bold');
        this._text = this.document.newMultiLineInput(valueHolder, 'pa.text', 'text', 'Textbox', params, this._action, 2, 'Lauftext');

        /**
         * @type {HTMLElement|PInput}
         * @private
         */
        this._pagina = this.document.newSingleLineInput(valueHolder, 'pa.pagina', 'pagina', 'Pagina', params, this._action, 'Zahl', 'number', false)
            .addClass('pagina')
            .addClass('bold');

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._tags = this.doLayout("pa.tags", "tags", valueHolder, params, "online");

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._visual = this.doLayout("pa.visual", "visual", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._region = this.doLayout("pa.region", "region", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._season = this.doLayout("pa.season", "season", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._form = this.doLayout("pa.form", "form", valueHolder, params);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._location = this.doLayout("pa.location", "location", valueHolder, params, "place");
    }

    detach() {
        let container = this.document.getElementById("pa.artikel.content");
        if (container) {
            container.removeChildren();
            container.removeSelf();
        }
    }

    /**
     * Switch content by removing any previous content first, resetting UI states and then set the new tab content
     * @param forms
     * @param templ
     * @private
     */
    _switchContent(templ) {
        let content = this._initLayout();
        content.removeChildren();
        content.appendChild(templ);
    }

    _initLayout() {
        let container = this.document.getElementById("pa.artikel.content") || this.document.createElement("span");
        if (!container.getAttribute("id")) {
            let form = this.document.createElement("form");
            form.setAttribute("autocomplete", "off");
            form.setAttribute("id", "panta.form");
            container.setAttribute("id", "pa.artikel.content");
            form.appendChild(container);
            this.document.getElementById("panta.content").appendChild(form);
        }
        return container;
    }

    /**
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

    updateLayout(select, id) {
        let oc = this.getConfigurationFor(id);
        select.clear();
        select.setLabel(oc.label);
        select.addOptions(oc.options);
    }

    _updateConfiguration(configuration) {
        this._configuration = configuration;

        this.updateLayout(this._tags, "online");
        this.updateLayout(this._visual, "visual");
        this.updateLayout(this._region, "region");
        this.updateLayout(this._season, "season");
        this.updateLayout(this._form, "form");
        this.updateLayout(this._location, "location");
    }

    getConfigurationFor(id) {
        let editable = this._configuration.config.editables
            .filter(function (editable) {
                return editable.id === id;
            });

        let label = editable
            .map(function(editable) {
                return editable.label;
            })
            .reduce(function(prev, cur) {
                prev = cur;
                return prev;
            }, null);

        let onlines = editable
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
            "options": onlines
        };
    }

}