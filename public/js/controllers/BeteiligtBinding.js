class BeteiligtBinding extends Binding {

    /**
     * Create the BeteiligtBinding that binds to the passed root document. The config is the entity that is managed
     * by this binding. The action is called when data has been changed in the managed entity. The context is useful in
     * your change handler because it gets passed there too.
     *
     * @param document the underlying root document
     * @param config the entity
     * @param action the onChange handler
     * @param context the context that is passed in your change handler
     * @param {PluginModuleConfig} configuration
     */
    constructor(document, config, action, context, configuration) {
        super(document, config, action, context, configuration);

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

    /**
     * Get the configuration of this binding
     *
     * @returns {PluginModuleConfig}
     */
    get configuration() {
        return this._configuration;
    }

    initLayouts() {
        let that = this;
        let layouts = (this._configuration && this._configuration.config && this._configuration.config.editables ? this._configuration.config.editables : []).filter(function (item) {
            return item.type === "layout";
        });

        this._involvements = Object.values(layouts).reduce(function (prev, curr) {
            prev[curr.id] = that._buildValueHolder(
                curr,
                that.onLayout);
            return prev;
        }, {});
    }

    /**
     * Creates a new value-holder element
     * @param config
     * @param renderer
     * @returns {{layout: string, renderer: renderer, data: null, tab: HTMLElement, "involved-in": *, binding: BeteiligtBinding, label: string}}
     * @private
     */
    _buildValueHolder(config, renderer) {
        let that = this;
        let tab = this._initTab(config);
        return {
            'involved-in': config.id,
            'data': null,
            'renderer': function (valueHolder) {
                renderer.call(that, this, valueHolder);
            },
            'tab': tab,
            // TODO data-layout is obsolete when switched to module configuration
            'layout': config.layout || tab.getAttribute("data-layout"),
            // TODO data-label is obsolete when switched to module configuration
            'label': config.label || tab.getAttribute("data-label"),
            'binding': that,
            'show': config.show
        };
    }

    detach() {
        let form = this.document.getElementById("panta.module");
        if (form) {
            form.removeChildren();
            form.removeSelf();
        }
    }

    /**
     * Initialize the tab for this config
     *
     * @param config
     * @return {HTMLElement}
     * @private
     */
    _initTab(config) {
        let form = this.document.getElementById("panta.module");
        if (!form) {
            form = createByTemplate(template_beteiligt, template_beteiligt);
            this.document.getElementById("panta.content").appendChild(form);
        }
        let tab = this.document.getElementById(config.container);
        if (config.show) {
            tab.removeClass("hidden");
        } else {
            tab.addClass("hidden");
        }
        return tab;
    }

    /**
     * Activate the currently active section and update all other sections with the passed entity because they may depend
     * on this new entity
     * @param entity
     * @param configuration
     * @returns {BeteiligtBinding}
     */
    update(entity, configuration) {
        this._activated.activate();
        // update all PModuleConfigs with the new entity entity
        Object.values(this).filter(function (property) {
            return (property instanceof PModuleConfig)
        }).forEach(function (module) {
            module.update(entity);
        });
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
     * @returns {BeteiligtBinding}
     */
    bind() {
        this.initLayouts();
        this.doLabels();

        this._onsite = this._onsite !== null ? this._onsite.update(this._entity) : (this._onsite = new PModuleConfig(this.document, this._involvements.onsite)
            .bind(this._entity, 'onsite')
            .render());

        this._text = this._text !== null ? this._text.update(this._entity) : (this._text = new PModuleConfig(this.document, this._involvements.text)
            .bind(this._entity, 'text')
            .render());

        this._photo = this._photo !== null ? this._photo.update(this._entity) : (this._photo = new PModuleConfig(this.document, this._involvements.photo)
            .bind(this._entity, 'photo')
            .render());

        this._video = this._video !== null ? this._video.update(this._entity) : (this._video = new PModuleConfig(this.document, this._involvements.video)
            .bind(this._entity, 'video')
            .render());

        this._illu = this._illu !== null ? this._illu.update(this._entity) : (this._illu = new PModuleConfig(this.document, this._involvements.illu)
            .bind(this._entity, 'illu')
            .render());

        this._ad = this._ad !== null ? this._ad.update(this._entity) : (this._ad = new PModuleConfig(this.document, this._involvements.ad)
            .bind(this._entity, 'ad')
            .render());

        let tabs = Object.values(this).filter(function (property) {
            return property instanceof PModuleConfig && property.valueHolder.show;
        });
        let tab = tabs.find(function(item) {
            return !item.valueHolder.data.isEmpty()
        }) || tabs[0];
        tab.activate();
        this._activated = tab;
        return this;
    }

    /**
     * Update the input fields in that form instead of re-rendering the whole form
     *
     * @param forms
     * @param valueHolder
     */
    onLayoutUpdate(forms, valueHolder) {
        // common fields (both KONTAKT and INSERAT and BLOG)
        forms.setFieldValue("name", valueHolder.data, "name");
        forms.setFieldValue("social", valueHolder.data, "social");
        forms.setFieldValue("address", valueHolder.data, "address");
        forms.setFieldValue("notes", valueHolder.data, "notes");
        forms.setFieldValue("duedate", valueHolder.data, "duedate");

        forms.setFieldValue("fee", valueHolder.data, "fee");
        forms.setFieldValue("charges", valueHolder.data, "charges");
        forms.setFieldValue("project", valueHolder.data, "project");
        forms.setFieldValue("capOnDepenses", valueHolder.data, "capOnDepenses");

        // fields from INSERAT Layout
        forms.setFieldValue("price", valueHolder.data, "price");
        forms.setFieldValue("format", valueHolder.data, "format");
        forms.setFieldValue("placement", valueHolder.data, "placement");
        forms.setFieldValue("total", valueHolder.data, "total");

        // BLOG Layout
        forms.setFieldValue("date", valueHolder.data, "date");
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
            this.onLayoutUpdate(forms, valueHolder);
        } else {
            switch (valueHolder.layout) {
                case "ad":
                    this.onAdLayout(forms, valueHolder);
                    break;
                case "blog":
                    this.onBlogLayout(forms, valueHolder);
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
        if (valueHolder.show) {
            let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._entity};
            let config = this.getLayoutConfigurationFor("regular", "field.name");
            forms.setField("name", this.document.newSingleLineInput(valueHolder, ".pa.name", "name", config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.social");
            forms.setField("social", this.document.newSingleLineInput(valueHolder, ".pa.social", "social", config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.address");
            forms.setField("address", this.document.newMultiLineInput(valueHolder, ".pa.address", "address", config.label, params, this._action, 2, config.placeholder, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.notes");
            forms.setField("notes", this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", config.label, params, this._action, 6, config.placeholder, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.deadline");
            forms.setField("duedate", this.document.newSingleLineInput(valueHolder, ".pa.duedate", "duedate", config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.a");
            forms.setField("fee", this.document.newSingleLineInput(valueHolder, ".pa.fee", "fee", config.label, params, this._action, config.placeholder, "money", false, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.b");
            forms.setField("charges", this.document.newSingleLineInput(valueHolder, ".pa.charges", "charges", config.label, params, this._action, config.placeholder, "money", false, config.visible));

            config = this.getLayoutConfigurationFor("regular", "field.c");
            forms.setField("project", this.document.newSingleLineInput(valueHolder, ".pa.project", "project", config.label, params, this._action, config.placeholder, "money", true, config.visible)
                .addClass("bold"));

            // forms.setField("capOnDepenses", this.document.newSingleLineInput(valueHolder, ".pa.cap_on_depenses", "capOnDepenses", "Kostendach Total Projekt", params, this._action, "Betrag…", "money", false));
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

        if (valueHolder.show) {
            let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._entity};
            let config = this.getLayoutConfigurationFor("ad", "field.name");
            forms.setField("name", this.document.newSingleLineInput(valueHolder, ".pa.name", 'name', config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.social");
            forms.setField("social", this.document.newSingleLineInput(valueHolder, ".pa.social", 'social', config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.address");
            forms.setField("address", this.document.newMultiLineInput(valueHolder, ".pa.address", 'address', config.label, params, this._action, 2, config.placeholder, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.format");
            forms.setField("format", this.document.newSingleLineInput(valueHolder, ".pa.format", 'format', config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.placement");
            forms.setField("placement", this.document.newSingleLineInput(valueHolder, ".pa.placement", "placement", config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.sujet");
            forms.setField("notes", this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", config.label, params, this._action, 2, config.placeholder, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.price");
            forms.setField("price", this.document.newSingleLineInput(valueHolder, ".pa.price", "price", config.label, params, this._action, config.placeholder, "money", false, config.visible));

            config = this.getLayoutConfigurationFor("ad", "field.total");
            forms.setField("total", this.document.newSingleLineInput(valueHolder, ".pa.total", "total", config.label, params, this._action, config.placeholder, "money", true, config.visible)
                .addClass("bold"));
        }
    }

    /**
     * Called when a blog layout is request by clicking on a section tab (s. _involvements)
     * @param forms
     * @param valueHolder
     */
    onBlogLayout(forms, valueHolder) {
        let virtual = this.document.createElement('div');
        virtual.innerHTML = template_blog;
        let templ = virtual.cloneNode(true);

        this._switchContent(forms, templ);

        if (valueHolder.show) {
            let params = {'context': this._context, 'valueHolder': valueHolder, 'config': this._entity};
            let config = this.getLayoutConfigurationFor("blog", "field.link");
            forms.setField("address", this.document.newSingleLineInput(valueHolder, ".pa.link", 'address', config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("blog", "field.notes");
            forms.setField("notes", this.document.newMultiLineInput(valueHolder, ".pa.notes", "notes", config.label, params, this._action, 6, config.placeholder, config.visible));

            config = this.getLayoutConfigurationFor("blog", "field.follower");
            forms.setField("social", this.document.newSingleLineInput(valueHolder, ".pa.follower", 'social', config.label, params, this._action, config.placeholder, "text", false, config.visible));

            config = this.getLayoutConfigurationFor("blog", "field.date");
            forms.setField("date", this.document.newSingleLineInput(valueHolder, ".pa.date", "date", config.label, params, this._action, config.placeholder, "text", false, config.visible));
        }
    }

    /**
     * Update the tab labels
     */
    doLabels() {
        let that = this;
        this.document.getElementsByClassName("js-panta-editable-title").forEach(function (title) {
            let editable = that._configuration.config.editables.find(function (editable) {
                return editable.id === "title";
            });
            if (editable) {
                title.removeClasses(["hidden", "show"]);
                title.addClass(editable.show ? "show" : "hidden");
                title.getElementsByClassName("js-panta-label").forEach(function (element) {
                    if (element instanceof HTMLElement) {
                        element.innerText = editable.label;
                    }
                });
            }
        })
    }

    /**
     * Update all elements that are configured by this configuration
     *
     * @param configuration
     */
    updateConfiguration(configuration) {
        this._configuration = configuration;
        this.doLabels();

        this._updateTab(this._onsite, "onsite");
        this._updateTab(this._text, "text");
        this._updateTab(this._photo, "photo");
        this._updateTab(this._video, "video");
        this._updateTab(this._illu, "illu");
        this._updateTab(this._ad, "ad");
    }

    /**
     * @param {PModuleConfig} tab
     * @param id
     * @private
     */
    _updateTab(tab, id) {
        let config = this.getConfigurationFor(id);
        tab.setTabName(config.editable.label);

        let fconfig = this.getLayoutConfigurationFor("regular", "field.name");
        tab.showHideField("name", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.social");
        tab.showHideField("social", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.address");
        tab.showHideField("address", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.notes");
        tab.showHideField("notes", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.deadline");
        tab.showHideField("duedate", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.a");
        tab.showHideField("fee", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.b");
        tab.showHideField("charges", !fconfig || !fconfig.editable || fconfig.editable.visible);

        fconfig = this.getLayoutConfigurationFor("regular", "field.c");
        tab.showHideField("project", !fconfig || !fconfig.editable || fconfig.editable.visible);
    }

    /**
     * Switch content by removing any previous content first, resetting UI states and then set the new tab content
     * @param forms
     * @param templ
     * @private
     */
    _switchContent(forms, templ) {
        let that = this;
        let content = this.document.getElementById("pa.tab.content");
        // remember the scroll position
        let scrolltop = this.document.getElementsByTagName("body")[0].scrollTop;
        content.removeChildren();
        this._onsite.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._text.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._photo.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._video.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._illu.valueHolder.tab.removeClasses(["selected", 'editing']);
        this._ad.valueHolder.tab.removeClasses(["selected", 'editing']);

        content.appendChild(templ);
        this._activated = forms;

        // restore the scroll position but the layout will flicker a lil
        setTimeout(function () {
            that.document.getElementsByTagName("body")[0].scrollTop = scrolltop;
        });
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

    /**
     * @param {string} layout the layout id
     * @param id the field id
     */
    getLayoutConfigurationFor(layout, id) {
        let lc = Object.keys(this._configuration.config.layouts)
            .find(function (key) {
                return key === layout;
            });
        return this._configuration.config.layouts[lc].fields
            .find(function (field) {
                return field.id === id;
            });
    }

}