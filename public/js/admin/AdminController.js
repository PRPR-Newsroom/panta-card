class AdminController {

    /**
     * The name of the property bag in trello
     * @returns {string}
     * @constructor
     */
    static get PROPERTY_BAG_NAME() {
        return "panta.Admin.PropertyBag";
    }

    static create(trello, document, adminService) {
        return new AdminController(trello, adminService, document);
    }


    constructor(trello, adminService, document) {
        this._trello = trello;
        /**
         * @type {AdminService}
         */
        this._adminService = adminService;
        /**
         * @type {Document}
         */
        this._document = document;
        /**
         * @type {ClientManager}
         */
        this._clientManager = ClientManager.getInstance(window);
        /**
         * @type {ArtikelController}
         */
        this._artikelController = this._clientManager.getArticleController();

        /**
         * @type {ModuleController}
         */
        this._moduleController = this._clientManager.getModuleController();
        /**
         * @type {ModulePlanController}
         */
        this._planController = this._clientManager.getPlanController();
        /**
         * @type {PluginController}
         */
        this._pluginController = this._clientManager.getPluginController();

        /**
         * @type {Import}
         * @private
         */
        this._model = null;

        /**
         * A property bag that can be used to store just plain old values
         * @type {{}}
         * @private
         */
        this._propertyBag = {};
    }

    /**
     * @param {{configuration: ImportConfiguration}} data
     * @return {Promise<boolean | never>}
     */
    render(data) {
        return this.index(data.configuration);
    }

    /**
     * @param {ImportConfiguration} previousConfig
     * @return {Promise<boolean | never>}
     */
    index(previousConfig) {
        const that = this;
        this._model = null;
        this._clearContent();
        return this.renderActions(previousConfig)
            .then(it => {
                // Sample data
                const model = new Import("Sample");
                const header = new HeaderNode(null, "Panta", {c: 0, r: 0});
                header.add(new HeaderNode(header, 'Label', {c: 1, r: 0}, [{
                    a: ' ',
                    h: '<span>Sky</span>',
                    r: '<raw>...</raw>',
                    t: 'Sky'
                }]));
                header.add(new HeaderNode(header, 'Titel', {c: 2, r: 0}));
                header.add(new HeaderNode(header, 'Beschreibung', {c: 3, r: 0}));
                header.add(new HeaderNode(header, 'Liste', {c: 4, r: 0}));
                header.add(new HeaderNode(header, 'Feld: Details', {c: 5, r: 0}));
                header.add(new HeaderNode(header, 'Mitglieder', {c: 6, r: 0}));
                header.add(new HeaderNode(header, 'Frist', {c: 7, r: 0}));
                header.add(new HeaderNode(header, 'Auswahlliste 1', {c: 8, r: 0}));
                header.add(new HeaderNode(header, 'Blog Name', {c: 9, r: 0}));
                model.header = header;
                const sample1 = new DataNode(1);
                sample1.set(header.get(0), {v: 1, t: 'n'});
                sample1.set(header.get(1), {v: 'A cocktail a day', t: 's'});
                sample1.set(header.get(2), {v: 'https://a-cocktail-a-day.com/', t: 's'});
                sample1.set(header.get(3), {v: 'Test Liste', t: 's' });
                sample1.set(header.get(4), {v: 'Blog zum Thema: Reisen, Lifestyle, Fliegen', t: 's'});
                sample1.set(header.get(5), {v: 'me@m3ns1.com', t: 's'});
                sample1.set(header.get(6), {v: 43830, w: '31/12/2019', t: 'n'});
                sample1.set(header.get(7), {v: '3.Begriff', t: 's'});
                sample1.set(header.get(8), {v: 'Manuel Wyssen', t: 's'});
                model.data.push(sample1);
                that.renderModel(model, previousConfig);
                return true;
            });
    }

    /**
     *
     * @param previousConfiguration
     * @return {Promise<boolean>}
     */
    renderActions(previousConfiguration) {
        const that = this;
        this._document.querySelectorAll(".settings-import-export")
            .forEach(it => {
                it.removeClass("hidden");
                if (it.querySelector("#btn-export")) {
                    it.querySelector("#btn-export").setEventListener('click', function (e) {
                        Promise.resolve(that._adminService.hasLabel("Panta Cards", "green"))
                            .then(result => {
                                if (result) {
                                    console.debug("Contains label");
                                } else {
                                    console.debug("Nope");
                                    // create it
                                    if (Promise.resolve(that._adminService.createLabel("Panta Cards", "green"))) {
                                        console.log("Yep");
                                    }
                                }
                            });

                    });
                }
                if (it.querySelector("#btn-load")) {
                    it.querySelector("#btn-load").setEventListener('click', function (e) {
                        e.preventDefault();
                        const button = e.target;
                        that._hideErrors(it);
                        button.disabled = true;

                        const files = that._document.querySelector("#file-import").files;
                        try {
                            that._adminService.load(files)
                                .then(imports => {
                                    imports.forEach(it => {
                                        console.log(`File ${it.file.name} loaded`, it);
                                        that.renderModel(it.model, previousConfiguration);
                                    });
                                })
                                .catch(err => {
                                    that._showErrors(it, `Fehler beim importieren der Datei ${err.name}`);
                                })
                                .finally(() => {
                                    button.disabled = false;
                                });
                        } catch (ex) {
                            console.error(`Error while importing files ${files}`, ex);
                        }
                    });
                }
                if (it.querySelector("#btn-import")) {
                    it.querySelector("#btn-import").setEventListener('click', function (e) {
                        // read configuration
                        e.preventDefault();
                        const button = e.target;
                        button.setAttribute('disabled', 'disabled');
                        const model = that._model;
                        if (model) {
                            /**
                             * @type {ImportConfiguration}
                             */
                            const configuration = Object.values(model.getNormalizedHeaders()).map(it => {
                                /**
                                 * @type {HTMLSelectElement}
                                 */
                                const select = that._document.querySelector(`#field-mapping-${it.getAddressAsText()}`);
                                const option = select.item(select.selectedIndex);
                                const type = option.getAttribute('data-type');
                                return that._createFieldOfType(type, it, option.value);
                            }).reduce((prev, cur) => {
                                prev.mapping.push(cur);
                                return prev;
                            }, new ImportConfiguration());
                            that._adminService.importCards(model, configuration)
                                .then(success => {
                                    console.debug(`success = ${success}`);
                                    if (success) {
                                        that._propertyBag['configuration'] = configuration;
                                        return that._pluginController.setAdminConfiguration(that._propertyBag);
                                    } else {
                                        return Promise.reject(`See log for more details`);
                                    }
                                })
                                .then(it => {
                                    console.debug('Configuration saved', it);
                                })
                                .catch(it => {
                                    console.error(`An error occured while importing from file: ${it}`);
                                    console.error(it.stack);
                                })
                                .finally(() => {
                                    button.removeAttribute('disabled');
                                });
                        }
                    });
                }

            });
        return Promise.resolve(true);
    }

    /**
     * Create the field for the given type
     * @param type
     * @param {HeaderNode} header
     * @param value
     * @return {AbstractField}
     * @private
     */
    _createFieldOfType(type, header, value) {
        switch (type) {
            case "boolean":
                return new BooleanField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments));
            case 'date':
                return new DateField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments));
            case 'array':
                return new ArrayField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments));
            default:
                return new TextField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments));
        }
    }

    /**
     * @param {Import} model
     * @param {ImportConfiguration} previousConfiguration
     */
    renderModel(model, previousConfiguration) {
        const that = this;
        this._document.getElementsByClassName("mapping-content-header").forEach(it => {
            it.removeClass("hidden");
        });
        const all = [];
        this._document.getElementsByClassName("mapping-content").forEach(container => {
            container.removeClass('hidden');
            Object.entries(model.getNormalizedHeaders()).forEach(entry => {
                const header = entry[1];
                const row = that._document.createElement('div');
                row.addClass('row space full');

                all.push(that._createChipsSection(header)
                    .then(it => {
                        row.appendChild(it);
                        return that._createFieldMappingSection(header, previousConfiguration);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createPreviewSection(header, model, previousConfiguration);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createMore(header);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return row;
                    })
                    .then(it => {
                        container.appendChild(it);
                        return Array.from(it.querySelectorAll('select').values());
                    })
                    .then(its => {
                        its.forEach(it => {
                            it.dispatchEvent(new Event('change'));
                        });
                        return Array.from(row.querySelectorAll('.js-preview').values());
                    })
                    .then(its => {
                        its.forEach(it => {
                            it.dispatchEvent(new Event('update'));
                        });
                        return container;
                    })
                );

            });
        });
        that._model = model;
        Promise.all(all)
            .then(it => that._trello.sizeTo('#content'));

    }

    /**
     *
     * @param header
     * @return {HTMLElement | HTMLDivElement | any}
     * @private
     */
    _createMore(header) {
        const that = this;
        const more = that._document.createElement('div');
        more.setAttribute('id', `more-${header.getAddressAsText()}`);
        more.addClass('col-2');
        return more;
    }

    /**
     * @param {HeaderNode} header
     * @return {Promise<HTMLDivElement>}
     * @private
     */
    _createChipsSection(header) {
        const that = this;
        const chips = that._document.createElement('div');
        chips.addClass('col-3');
        header.getPathItems().map((it, index, arr) => {
            let chip = that._document.createElement('div');
            chip.setAttribute('id', `chip-${header.getAddressAsText()}-${index + 1 < arr.length ? index : 'last'}`);
            chip.addClass('panta-chip');
            if (index + 2 < arr.length) {
                chip.addClass('panta-chip-grandpa');
            } else if (index + 1 < arr.length) {
                chip.addClass('panta-chip-parent');
            }
            it.comments.forEach((it, index, arr) => {
                chip.addClass(`panta-bgcolor-${it.t.toLowerCase()}`);
            });
            let label = that._document.createElement('p');
            label.appendChild(that._document.createTextNode(it.label));
            chip.appendChild(label);
            return chip;
        }).forEach((it, index) => {
            if (that._adminService.excelService.treatFirstRowAsRoot || index > 0) {
                chips.appendChild(it);
            }
        });
        return Promise.resolve(chips);
    }

    /**
     * @param {HeaderNode} header
     * @param {Import} model
     * @param {ImportConfiguration} configuration
     * @return {Promise<HTMLDivElement>}
     * @private
     */
    _createPreviewSection(header, model, configuration) {
        const that = this;
        const preview = that._document.createElement('div');
        preview.setAttribute('id', `preview-${header.getAddressAsText()}`);
        preview.addClass(`col-3 js-preview`);
        preview.setEventListener('update', e => {
            const field = e.item || configuration.mapping.find(it => it.source.isSameAddress(header.address));
            const sample = model.getSample(header);
            preview.innerHTML = model.getSampleHtml(sample, that._document, field);
        });
        return Promise.resolve(preview);
    }

    /**
     * Render the field mapping dropdown
     * @param {HeaderNode} header the header node
     * @param {ImportConfiguration} configuration
     * @return {Promise<HTMLDivElement>}
     * @private
     */
    _createFieldMappingSection(header, configuration) {
        const that = this;
        const linking = that._document.createElement('div');
        linking.addClass('col-4');

        const fields = that._document.createElement('select');
        fields.setAttribute('id', `field-mapping-${header.getAddressAsText()}`);
        fields.setEventListener('change', e => {
            this._onFieldMappingChange(e.target.item(e.target.selectedIndex), header);
        });
        const none = that._document.createElement('option');
        none.setAttribute('value', '-1');
        none.innerText = 'Feld auswählen...';
        fields.appendChild(none);

        return that._getTrelloFields(header, configuration)
            .then(it => {
                fields.appendChild(it);
                return fields;
            })
            .then(it => {
                return that._getPantaFields(header, configuration)
                    .then(its => {
                        return its.reduce((prev, cur) => {
                            prev.appendChild(cur);
                            return prev;
                        }, fields);
                    });
            })
            .then(it => {
                linking.appendChild(fields);
                const field = configuration.mapping.find(it => it.source.isSameAddress(header.address));
                fields.value = field && field.reference ? field.reference : '-1';
                return linking;
            });
    }

    /**
     * @param {HTMLOptionElement} item
     * @param {HeaderNode} header
     * @private
     */
    _onFieldMappingChange(item, header) {
        const that = this;
        const address = header.getAddressAsText();
        const more = that._document.querySelector(`#more-${address}`);
        let event = new Event('update');
        more.removeChildren();
        if (item.getAttribute('value') === 'trello.labels') {
            event.item = new BooleanField(item);
            const colorPicker = that._createColorPicker(header.color);
            colorPicker.setEventListener('change', e => {
                const item = e.target.item(e.target.selectedIndex);
                const color = item.getAttribute('value');
                const lastchip = that._document.querySelector(`#chip-${address}-last`);
                lastchip.removeClassByPrefix('panta-bgcolor-');
                if (color !== '0') {
                    lastchip.addClass(`panta-bgcolor-${color}`);

                }
                header.color = color;
            });
            more.appendChild(colorPicker);
        }
        event.item = this._createFieldOfType(item.getAttribute('data-type'), header, item.value);
        that._document.querySelector(`#preview-${address}`).dispatchEvent(event);
    }

    _createColorPicker(selected = null) {
        const that = this;
        const colorPicker = that._document.createElement('select');
        colorPicker.appendChild(that._createColorOption('Farbe wählen', '0', selected));
        colorPicker.appendChild(that._createColorOption('Blau', 'blue', selected));
        colorPicker.appendChild(that._createColorOption('Grün', 'green', selected));
        colorPicker.appendChild(that._createColorOption('Orange', 'orange', selected));
        colorPicker.appendChild(that._createColorOption('Rot', 'red', selected));
        colorPicker.appendChild(that._createColorOption('Gelb', 'yellow', selected));
        colorPicker.appendChild(that._createColorOption('Violett', 'purple', selected));
        colorPicker.appendChild(that._createColorOption('Pink', 'pink', selected));
        colorPicker.appendChild(that._createColorOption('Himmelblau', 'sky', selected));
        colorPicker.appendChild(that._createColorOption('Limette', 'lime', selected));
        colorPicker.appendChild(that._createColorOption('Grau', 'shades', selected));
        return colorPicker;
    }

    _createColorOption(color, value, selected) {
        const opt = this._document.createElement('option');
        opt.setAttribute('value', value);
        opt.selected = selected === value;
        opt.innerText = color;
        return opt;
    }

    /**
     *
     * @param {HeaderNode} header
     * @param {ImportConfiguration} previousConfiguration
     * @return {PromiseLike<HTMLOptGroupElement>}
     * @private
     */
    _getTrelloFields(header, previousConfiguration) {
        const that = this;
        const group = this._document.createElement('optgroup');
        group.setAttribute('label', 'Trello Felder');
        return Promise.resolve(TRELLO_FIELDS.map(it => {
            const option = that._document.createElement('option');
            const fieldId = it.id;
            option.setAttribute('value', fieldId);
            option.innerText = __(it.desc);
            option.setAttribute('data-type', it.hasOwnProperty('type') ? it.type : 'text');
            option.selected = previousConfiguration.mapping.find(it => it.source.isSameAddress(header.address) && it.reference === fieldId) != null;
            return option;
        }).reduce((prev, cur) => {
            prev.appendChild(cur);
            return prev;
        }, group));
    }

    /**
     *
     * @param {HeaderNode} header
     * @param {ImportConfiguration} previousConfiguration
     * @return {PromiseLike<HTMLOptGroupElement>}
     * @private
     */
    _getPantaFields(header, previousConfiguration) {
        // get the fields from the controllers
        const that = this;
        return this._pluginController.getEnabledModules()
            .then(its => {
                return its.flatMap(it => {
                    const modulename = it.name;
                    /**
                     * @type {Controller}
                     */
                    const controller = that._clientManager.getController(it.id);
                    return controller.getFields(it)
                        .flatMap(its => {
                            return its.map(it => {
                                const groupId = it.groupId;
                                const subgrp = that._document.createElement('optgroup');
                                subgrp.setAttribute('label', `${modulename}: ${it.group}`);
                                return it.fields
                                    .map(it => {
                                        const option = that._document.createElement('option');
                                        const fieldId = `${groupId}.${it.id}`;
                                        option.setAttribute('value', fieldId);
                                        option.innerText = it.label;
                                        option.setAttribute('data-type', it.hasOwnProperty('type') ? it.type : 'text');
                                        option.selected = previousConfiguration.mapping.find(it => it.source.isSameAddress(header.address) && it.reference === fieldId) != null;
                                        return option;
                                    })
                                    .reduce((prev, cur) => {
                                        prev.appendChild(cur);
                                        return prev;
                                    }, subgrp);
                            });
                        });
                });
            });
    }

    /**
     * Clear the content of the settings page completely by removing all child nodes from the
     * container
     */
    _clearContent() {
        this._document.getElementsByClassName("mapping-content").forEach(function (content) {
            content.removeChildren();
        });
    }

    _showErrors(holder, message) {
        let container = holder.querySelectorAll('.error-messages');
        container.forEach(errorMessageContainer => {
            errorMessageContainer.removeClass('hidden');
            const errorMessage = errorMessageContainer.querySelector('#error-message');
            errorMessage.innerHTML = message;
        });
        return container;
    }

    _hideErrors(holder) {
        let container = holder.querySelectorAll('.error-messages');
        container.forEach(errorMessageContainer => {
            errorMessageContainer.addClass('hidden');
            const errorMessage = errorMessageContainer.querySelector('#error-message');
            errorMessage.innerHTML = '';
        });
        return container;
    }
}